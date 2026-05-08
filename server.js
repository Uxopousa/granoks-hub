const express = require("express");
const http = require("http");
const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "granoks.db"));
db.pragma("journal_mode = WAL"); db.pragma("foreign_keys = ON");
db.exec("CREATE TABLE IF NOT EXISTS usuario (username TEXT PRIMARY KEY, puntos INTEGER DEFAULT 0)");
db.exec("CREATE TABLE IF NOT EXISTS pedido (id INTEGER PRIMARY KEY AUTOINCREMENT, producto TEXT NOT NULL, total REAL NOT NULL, usuario_username TEXT NOT NULL REFERENCES usuario(username), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
db.exec("CREATE TABLE IF NOT EXISTS promo (id INTEGER PRIMARY KEY AUTOINCREMENT, descripcion TEXT NOT NULL, coste_puntos INTEGER NOT NULL)");
const pc = db.prepare("SELECT COUNT(*) c FROM promo").get().c;
if (pc===0) { db.prepare("INSERT INTO promo (descripcion, coste_puntos) VALUES (?,?)").run("Cafe gratis",50); db.prepare("INSERT INTO promo (descripcion, coste_puntos) VALUES (?,?)").run("Descuento 20%",100); db.prepare("INSERT INTO promo (descripcion, coste_puntos) VALUES (?,?)").run("Taza personalizada",200); }
const app = express();
const server = http.createServer(app);
app.use(express.json({ limit: "50kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/api/pedidos", (q, r) => r.json(db.prepare("SELECT p.id, p.producto, p.total, p.usuario_username, p.created_at FROM pedido p ORDER BY p.id DESC").all()));
app.get("/api/promos", (q, r) => r.json(db.prepare("SELECT * FROM promo").all()));
app.post("/api/pedidos", (q, r) => {
  const p = q.body;
  if (!p.producto || !p.total || !p.username) return r.status(400).json({ error: "Faltan datos" });
  const result = db.prepare("INSERT INTO pedido (producto, total, usuario_username, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)").run(p.producto, p.total, p.username);
  db.prepare("UPDATE usuario SET puntos = puntos + 50 WHERE username = ?").run(p.username);
  r.status(201).json({ pedido: { id: result.lastInsertRowid, producto: p.producto, total: p.total, usuario_username: p.username }, puntos: 50 });
});
app.get("/api/usuarios/:username", (q, r) => {
  const u = (q.params.username || "").trim();
  if (!u) return r.status(400).json({ error: "Username requerido" });
  let us = db.prepare("SELECT * FROM usuario WHERE username = ?").get(u);
  if (!us) { db.prepare("INSERT INTO usuario (username, puntos) VALUES (?,?)").run(u,0); us = db.prepare("SELECT * FROM usuario WHERE username = ?").get(u); }
  r.json(us);
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Granoks-Hub corriendo en http://localhost:" + PORT));
