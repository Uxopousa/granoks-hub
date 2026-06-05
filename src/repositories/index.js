const pedido = {
  listar(db, filtros = {}) {
    let sql = "SELECT p.id, p.producto, p.total, p.usuario_username, p.created_at FROM pedido p WHERE 1=1";
    const params = [];
    if (filtros.usuario) { sql += " AND p.usuario_username = ?"; params.push(filtros.usuario); }
    if (filtros.desde) { sql += " AND p.created_at >= ?"; params.push(filtros.desde); }
    if (filtros.hasta) { sql += " AND p.created_at < date(?, '+1 day')"; params.push(filtros.hasta); }
    sql += " ORDER BY p.id DESC";
    if (filtros.limite) { sql += " LIMIT ?"; params.push(filtros.limite); }
    return db.prepare(sql).all(...params);
  },

  obtenerPorId(db, id) {
    return db.prepare("SELECT p.id, p.producto, p.total, p.usuario_username, p.created_at FROM pedido p WHERE p.id = ?").get(id);
  },

  crear(db, { producto, total, usuario_username }) {
    const result = db.prepare("INSERT INTO pedido (producto, total, usuario_username) VALUES (?, ?, ?)").run(producto, total, usuario_username);
    return { id: result.lastInsertRowid };
  }
};

const usuario = {
  obtener(db, username) {
    return db.prepare("SELECT * FROM usuario WHERE username = ?").get(username);
  },

  crearSiNoExiste(db, username) {
    const exists = db.prepare("SELECT 1 FROM usuario WHERE username = ?").get(username);
    if (!exists) {
      db.prepare("INSERT INTO usuario (username, puntos) VALUES (?, 0)").run(username);
    }
  },

  sumarPuntos(db, { username, puntos }) {
    db.prepare("UPDATE usuario SET puntos = puntos + ? WHERE username = ?").run(puntos, username);
    return db.prepare("SELECT * FROM usuario WHERE username = ?").get(username);
  },

  restarPuntosSiSaldoSuficiente(db, { username, puntos }) {
    const updated = db.prepare("UPDATE usuario SET puntos = puntos - ? WHERE username = ? AND puntos >= ?").run(puntos, username, puntos);
    if (updated.changes === 0) return null;
    return db.prepare("SELECT * FROM usuario WHERE username = ?").get(username);
  }
};

const promo = {
  listar(db) { return db.prepare("SELECT * FROM promo").all(); },
  obtenerPorId(db, id) { return db.prepare("SELECT * FROM promo WHERE id = ?").get(id); }
};

const movimiento = {
  registrar(db, { tipo, detalle, usuario_username, referencia_id, referencia_tipo }) {
    db.prepare("INSERT INTO movimiento (tipo, detalle, usuario_username, referencia_id, referencia_tipo) VALUES (?, ?, ?, ?, ?)")
      .run(tipo, detalle, usuario_username, referencia_id ?? null, referencia_tipo ?? null);
  },

  listar(db, { usuario_username, limite = 50 } = {}) {
    let sql = "SELECT * FROM movimiento WHERE 1=1";
    const params = [];
    if (usuario_username) { sql += " AND usuario_username = ?"; params.push(usuario_username); }
    sql += " ORDER BY id DESC LIMIT ?";
    params.push(limite);
    return db.prepare(sql).all(...params);
  }
};

module.exports = { pedido, usuario, promo, movimiento };
