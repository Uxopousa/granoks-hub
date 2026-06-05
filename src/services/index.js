function createServices(db, repos) {
  return {
    crearPedidoConPuntos({ producto, total, username }) {
      const transaction = db.transaction(() => {
        repos.usuario.crearSiNoExiste(db, username);
        const pedidoResult = repos.pedido.crear(db, { producto, total, usuario_username: username });
        const user = repos.usuario.sumarPuntos(db, { username, puntos: 50 });

        repos.movimiento.registrar(db, {
          tipo: "pedido_creado",
          detalle: `${producto} - $${total}`,
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
