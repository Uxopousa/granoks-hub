const getItemsStmt = null;

function attachItems(db, pedidos) {
  var s = db.prepare("SELECT * FROM pedido_item WHERE pedido_id = ?");
  for (var i = 0; i < pedidos.length; i++) {
    pedidos[i].items = s.all(pedidos[i].id);
  }
  return pedidos;
}

const pedido = {
  listar(db, filtros = {}) {
    let sql = "SELECT p.id, p.producto, p.total, p.usuario_username, p.created_at FROM pedido p WHERE 1=1";
    const params = [];
    if (filtros.usuario) { sql += " AND p.usuario_username = ?"; params.push(filtros.usuario); }
    if (filtros.desde) { sql += " AND p.created_at >= ?"; params.push(filtros.desde); }
    if (filtros.hasta) { sql += " AND p.created_at < date(?, '+1 day')"; params.push(filtros.hasta); }
    sql += " ORDER BY p.id DESC";
    if (filtros.limite) { sql += " LIMIT ?"; params.push(filtros.limite); }
    return attachItems(db, db.prepare(sql).all(...params));
  },

  obtenerPorId(db, id) {
    var p = db.prepare("SELECT p.id, p.producto, p.total, p.usuario_username, p.created_at FROM pedido p WHERE p.id = ?").get(id);
    if (p) p.items = db.prepare("SELECT * FROM pedido_item WHERE pedido_id = ?").all(id);
    return p;
  },

  crear(db, { producto, total, usuario_username }) {
    const result = db.prepare("INSERT INTO pedido (producto, total, usuario_username) VALUES (?, ?, ?)").run(producto, total, usuario_username);
    return { id: result.lastInsertRowid };
  },

  resumen(db) {
    return db.prepare("SELECT COUNT(*) AS total_pedidos, COALESCE(SUM(total), 0) AS total_ingresos, COALESCE(AVG(total), 0) AS promedio_pedido FROM pedido").get();
  }
};

const pedidoItem = {
  crear(db, { pedido_id, producto_nombre, precio, cantidad }) {
    db.prepare("INSERT INTO pedido_item (pedido_id, producto_nombre, precio, cantidad) VALUES (?, ?, ?, ?)").run(pedido_id, producto_nombre, precio, cantidad || 1);
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

const categoria = {
  listar(db) { return db.prepare("SELECT * FROM categoria ORDER BY id").all(); }
};

const producto = {
  listar(db, filtros) {
    if (filtros && filtros.categoria_id) {
      return db.prepare("SELECT * FROM producto WHERE categoria_id = ? ORDER BY id").all(filtros.categoria_id);
    }
    return db.prepare("SELECT * FROM producto ORDER BY categoria_id, id").all();
  }
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

module.exports = { pedido, pedidoItem, usuario, promo, movimiento, categoria, producto };
