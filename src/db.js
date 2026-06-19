const Database = require("better-sqlite3");

function createDatabase(dbPath) {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuario (
      username TEXT PRIMARY KEY,
      puntos INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto TEXT NOT NULL,
      total REAL NOT NULL,
      usuario_username TEXT NOT NULL REFERENCES usuario(username),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS promo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT NOT NULL,
      coste_puntos INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS movimiento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      detalle TEXT,
      usuario_username TEXT NOT NULL REFERENCES usuario(username),
      referencia_id INTEGER,
      referencia_tipo TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS categoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS producto (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      categoria_id INTEGER NOT NULL REFERENCES categoria(id)
    );
    CREATE TABLE IF NOT EXISTS pedido_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL REFERENCES pedido(id),
      producto_nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      cantidad INTEGER NOT NULL DEFAULT 1
    );
  `);
  const colInfo = db.prepare("PRAGMA table_info(pedido_item)").all();
  const hasCantidad = colInfo.some(c => c.name === "cantidad");
  if (!hasCantidad) {
    db.exec("ALTER TABLE pedido_item ADD COLUMN cantidad INTEGER NOT NULL DEFAULT 1");
  }

  const promoCount = db.prepare("SELECT COUNT(*) c FROM promo").get().c;
  if (promoCount === 0) {
    const insert = db.prepare("INSERT INTO promo (descripcion, coste_puntos) VALUES (?,?)");
    insert.run("Cafe gratis", 50);
    insert.run("Descuento 20%", 100);
    insert.run("Taza personalizada", 200);
  }

  const userCount = db.prepare("SELECT COUNT(*) c FROM usuario").get().c;
  if (userCount === 0) {
    db.prepare("INSERT INTO usuario (username, puntos) VALUES (?,?)").run("cliente1", 0);
  }

  const catCount = db.prepare("SELECT COUNT(*) c FROM categoria").get().c;
  if (catCount === 0) {
    const insC = db.prepare("INSERT INTO categoria (nombre) VALUES (?)");
    insC.run("Cafes");
    insC.run("Bebidas Frias");
    insC.run("Pasteleria");
    const insP = db.prepare("INSERT INTO producto (nombre, precio, categoria_id) VALUES (?,?,?)");
    insP.run("Espresso", 2.50, 1);
    insP.run("Americano", 3.00, 1);
    insP.run("Latte", 3.50, 1);
    insP.run("Cappuccino", 3.50, 1);
    insP.run("Mocaccino", 4.00, 1);
    insP.run("Iced Latte", 3.50, 2);
    insP.run("Frappuccino", 4.50, 2);
    insP.run("Smoothie", 5.00, 2);
    insP.run("Limonada", 2.50, 2);
    insP.run("Croissant", 3.00, 3);
    insP.run("Muffin", 3.50, 3);
    insP.run("Cookie", 2.00, 3);
    insP.run("Brownie", 3.50, 3);
  }

  return db;
}

module.exports = { createDatabase };
