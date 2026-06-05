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
  `);

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

  return db;
}

module.exports = { createDatabase };
