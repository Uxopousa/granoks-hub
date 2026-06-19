function createServices(db, repos) {
  return {
    crearPedidoConPuntos({ items, username }) {
      const transaction = db.transaction(() => {
        repos.usuario.crearSiNoExiste(db, username);
        let total = 0;
        const nombres = [];
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          const cant = it.cantidad || 1;
          total += it.precio * cant;
          nombres.push(cant > 1 ? it.producto + " x" + cant : it.producto);
        }
        const producto = nombres.join(" + ");
        const pedidoResult = repos.pedido.crear(db, { producto, total, usuario_username: username });
        for (let j = 0; j < items.length; j++) {
          repos.pedidoItem.crear(db, { pedido_id: pedidoResult.id, producto_nombre: items[j].producto, precio: items[j].precio, cantidad: items[j].cantidad });
        }
        const user = repos.usuario.sumarPuntos(db, { username, puntos: 50 });

        repos.movimiento.registrar(db, {
          tipo: "pedido_creado",
          detalle: `${producto} - €${total}`,
          usuario_username: username,
          referencia_id: pedidoResult.id,
          referencia_tipo: "pedido"
        });
        repos.movimiento.registrar(db, {
          tipo: "puntos_sumados",
          detalle: "+50 puntos por pedido #${pedidoResult.id}",
          usuario_username: username,
          referencia_id: pedidoResult.id,
          referencia_tipo: "pedido"
        });

        const pedido = repos.pedido.obtenerPorId(db, pedidoResult.id);
        return { pedido, usuario: user };
      });

      return transaction();
    },

    canjearPromo({ promoId, username }) {
      const transaction = db.transaction(() => {
        const promo = repos.promo.obtenerPorId(db, promoId);
        if (!promo) return { error: "Promo no encontrada", status: 404 };

        const user = repos.usuario.obtener(db, username);
        if (!user) return { error: "Usuario no encontrado", status: 404 };

        const updatedUser = repos.usuario.restarPuntosSiSaldoSuficiente(db, { username, puntos: promo.coste_puntos });
        if (!updatedUser) return { error: "Puntos insuficientes", status: 400 };

        repos.movimiento.registrar(db, {
          tipo: "promo_canjeada",
          detalle: `${promo.descripcion} (-${promo.coste_puntos} puntos)`,
          usuario_username: username,
          referencia_id: promo.id,
          referencia_tipo: "promo"
        });
        repos.movimiento.registrar(db, {
          tipo: "puntos_restados",
          detalle: `-${promo.coste_puntos} puntos por canje de promo #${promo.id}`,
          usuario_username: username,
          referencia_id: promo.id,
          referencia_tipo: "promo"
        });

        return { message: "Promo canjeada", puntos: updatedUser.puntos };
      });

      return transaction();
    }
  };
}

module.exports = { createServices };
