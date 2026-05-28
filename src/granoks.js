const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Database = require("better-sqlite3");
const path = require("path");

function createGranoksServer(options = {}) {
  const dbPath = options.dbPath || path.join(__dirname, "..", "granoks.db");
  const db = new Database(dbPath);

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec("CREATE TABLE IF NOT EXISTS usuario (username TEXT PRIMARY KEY, puntos INTEGER DEFAULT 0)");
  db.exec("CREATE TABLE IF NOT EXISTS pedido (id INTEGER PRIMARY KEY AUTOINCREMENT, producto TEXT NOT NULL, total REAL NOT NULL, usuario_username TEXT NOT NULL REFERENCES usuario(username), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  db.exec("CREATE TABLE IF NOT EXISTS promo (id INTEGER PRIMARY KEY AUTOINCREMENT, descripcion TEXT NOT NULL, coste_puntos INTEGER NOT NULL)");

  const promoCount = db.prepare("SELECT COUNT(*) c FROM promo").get().c;
  if (promoCount === 0) {
    db.prepare("INSERT INTO promo (descripcion, coste_puntos) VALUES (?,?)").run("Cafe gratis", 50);
    db.prepare("INSERT INTO promo (descripcion, coste_puntos) VALUES (?,?)").run("Descuento 20%", 100);
    db.prepare("INSERT INTO promo (descripcion, coste_puntos) VALUES (?,?)").run("Taza personalizada", 200);
  }

  const userCount = db.prepare("SELECT COUNT(*) c FROM usuario").get().c;
  if (userCount === 0) db.prepare("INSERT INTO usuario (username, puntos) VALUES (?,?)").run("cliente1", 0);

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { pingInterval: 10000, pingTimeout: 5000 });
  const sensorTimer = setInterval(simularSensores, 2000);

  app.use(express.json({ limit: "50kb" }));
  app.use(express.static(path.join(__dirname, "..", "public")));

  function normalizarTexto(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function normalizarTotal(value) {
    const total = Number(value);
    return Number.isFinite(total) ? Math.round(total * 100) / 100 : NaN;
  }

  function obtenerPedido(id) {
    return db.prepare("SELECT p.id, p.producto, p.total, p.usuario_username, p.created_at FROM pedido p WHERE p.id = ?").get(id);
  }

  const crearPedidoTransaction = db.transaction(({ producto, total, username }) => {
    const user = db.prepare("SELECT * FROM usuario WHERE username = ?").get(username);
    if (!user) db.prepare("INSERT INTO usuario (username, puntos) VALUES (?, ?)").run(username, 0);
    const result = db.prepare("INSERT INTO pedido (producto, total, usuario_username, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)").run(producto, total, username);
    db.prepare("UPDATE usuario SET puntos = puntos + 50 WHERE username = ?").run(username);
    return { pedido: obtenerPedido(result.lastInsertRowid), usuario: db.prepare("SELECT * FROM usuario WHERE username = ?").get(username) };
  });

  const canjearPromoTransaction = db.transaction(({ promo, username }) => {
    const updated = db.prepare("UPDATE usuario SET puntos = puntos - ? WHERE username = ? AND puntos >= ?").run(promo.coste_puntos, username, promo.coste_puntos);
    if (updated.changes === 0) return null;
    return db.prepare("SELECT * FROM usuario WHERE username = ?").get(username);
  });

  app.get("/api/pedidos", (request, response) => response.json(db.prepare("SELECT p.id, p.producto, p.total, p.usuario_username, p.created_at FROM pedido p ORDER BY p.id DESC").all()));

  app.post("/api/pedidos", (request, response) => {
    const body = request.body;
    const producto = normalizarTexto(body.producto);
    const username = normalizarTexto(body.username);
    const total = normalizarTotal(body.total);

    if (!producto || !username || !Number.isFinite(total) || total <= 0) {
      return response.status(400).json({ error: "Datos de pedido invalidos" });
    }

    const { pedido, usuario } = crearPedidoTransaction({ producto, total, username });
    io.emit("nuevo-pedido", pedido);
    response.status(201).json({ pedido, puntos: usuario.puntos });
  });

  app.get("/api/promos", (request, response) => response.json(db.prepare("SELECT * FROM promo").all()));

  app.post("/api/promos/:id/redeem", (request, response) => {
    const username = normalizarTexto(request.body.username);
    const promoId = Number(request.params.id);

    if (!username) return response.status(400).json({ error: "Username requerido" });
    if (!Number.isInteger(promoId) || promoId <= 0) return response.status(400).json({ error: "Promo invalida" });

    const promo = db.prepare("SELECT * FROM promo WHERE id = ?").get(promoId);
    if (!promo) return response.status(404).json({ error: "Promo no encontrada" });

    const user = db.prepare("SELECT * FROM usuario WHERE username = ?").get(username);
    if (!user) return response.status(404).json({ error: "Usuario no encontrado" });

    const updatedUser = canjearPromoTransaction({ promo, username });
    if (!updatedUser) return response.status(400).json({ error: "Puntos insuficientes" });

    response.json({ message: "Promo canjeada", puntos: updatedUser.puntos });
  });

  app.get("/api/usuarios/:username", (request, response) => {
    const username = normalizarTexto(request.params.username);
    if (!username) return response.status(400).json({ error: "Username requerido" });

    let user = db.prepare("SELECT * FROM usuario WHERE username = ?").get(username);
    if (!user) {
      db.prepare("INSERT INTO usuario (username, puntos) VALUES (?,?)").run(username, 0);
      user = db.prepare("SELECT * FROM usuario WHERE username = ?").get(username);
    }

    response.json(user);
  });

  io.on("connection", socket => {
    console.log("Cliente:", socket.id);
    socket.on("disconnect", () => console.log("Desconectado:", socket.id));
  });

  function simularSensores() {
    io.emit("sensores", {
      temperatura: +(70 + Math.random() * 10).toFixed(1),
      nivelGrano: +(Math.random() * 100).toFixed(1),
      timestamp: Date.now()
    });
  }

  async function close() {
    clearInterval(sensorTimer);
    io.close();
    await new Promise(resolve => server.close(resolve));
    db.close();
  }

  return { app, server, io, db, listen: server.listen.bind(server), close };
}

module.exports = { createGranoksServer };
