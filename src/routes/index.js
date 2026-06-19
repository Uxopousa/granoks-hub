function normalizarTexto(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizarTotal(value) {
  const total = Number(value);
  return Number.isFinite(total) ? Math.round(total * 100) / 100 : NaN;
}

function createRoutes({ db, repos, services, io }) {
  const { Router } = require("express");
  const router = Router();

  router.get("/api/pedidos/resumen", (req, res) => {
    res.json(repos.pedido.resumen(db));
  });

  router.get("/api/pedidos", (req, res) => {
    const filtros = {};
    if (req.query.usuario) filtros.usuario = normalizarTexto(req.query.usuario);
    if (req.query.desde) filtros.desde = req.query.desde;
    if (req.query.hasta) filtros.hasta = req.query.hasta;
    if (req.query.limite) filtros.limite = Math.min(Number(req.query.limite) || 50, 200);
    res.json(repos.pedido.listar(db, filtros));
  });

  router.post("/api/pedidos", (req, res) => {
    const body = req.body;
    const username = normalizarTexto(body.username);
    var items = body.items;

    if (!username) {
      return res.status(400).json({ error: "Username requerido" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items del pedido requeridos" });
    }

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var nombre = normalizarTexto(item.producto);
      var precio = normalizarTotal(item.precio);
      var cant = Number(item.cantidad);
      if (!nombre || !Number.isFinite(precio) || precio <= 0) {
        return res.status(400).json({ error: "Item invalido: " + JSON.stringify(item) });
      }
      item.producto = nombre;
      item.precio = precio;
      item.cantidad = Number.isInteger(cant) && cant > 0 ? cant : 1;
    }

    const { pedido, usuario } = services.crearPedidoConPuntos({ items, username });
    io.emit("nuevo-pedido", pedido);
    res.status(201).json({ pedido, puntos: usuario.puntos });
  });

  router.get("/api/categorias", (req, res) => {
    res.json(repos.categoria.listar(db));
  });

  router.get("/api/productos", (req, res) => {
    const filtros = {};
    if (req.query.categoria_id) filtros.categoria_id = Number(req.query.categoria_id);
    res.json(repos.producto.listar(db, filtros));
  });

  router.get("/api/promos", (req, res) => {
    res.json(repos.promo.listar(db));
  });

  router.post("/api/promos/:id/redeem", (req, res) => {
    const username = normalizarTexto(req.body.username);
    const promoId = Number(req.params.id);

    if (!username) return res.status(400).json({ error: "Username requerido" });
    if (!Number.isInteger(promoId) || promoId <= 0) return res.status(400).json({ error: "Promo invalida" });

    const result = services.canjearPromo({ promoId, username });
    if (result.error) return res.status(result.status).json({ error: result.error });
    res.json(result);
  });

  router.get("/api/usuarios/:username", (req, res) => {
    const username = normalizarTexto(req.params.username);
    if (!username) return res.status(400).json({ error: "Username requerido" });

    const user = repos.usuario.obtener(db, username);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  });

  router.get("/api/movimientos", (req, res) => {
    const usuario_username = req.query.usuario ? normalizarTexto(req.query.usuario) : undefined;
    const limite = Math.min(Number(req.query.limite) || 50, 200);
    res.json(repos.movimiento.listar(db, { usuario_username, limite }));
  });

  return router;
}

module.exports = { createRoutes };
