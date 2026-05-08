const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "granoks.db"));
db.pragma("journal_mode = WAL"); db.pragma("foreign_keys = ON");
db.exec("CREATE TABLE IF NOT EXISTS usuario (username TEXT PRIMARY KEY, puntos INTEGER DEFAULT 0)");
const app = express();
app.use(express.json({ limit: "50kb" }));
app.get("/api/usuarios/:username", (q, r) => {
  const u = (q.params.username || "").trim();
  if (!u) return r.status(400).json({ error: "Username requerido" });
  let us = db.prepare("SELECT * FROM usuario WHERE username = ?").get(u);
  if (!us) { db.prepare("INSERT INTO usuario (username, puntos) VALUES (?,?)").run(u,0); us = db.prepare("SELECT * FROM usuario WHERE username = ?").get(u); }
  r.json(us);
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Granoks-Hub corriendo en http://localhost:" + PORT));
