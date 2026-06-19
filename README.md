# Granoks-Hub

**Mini-ERP para cafeterías** — dashboard en tiempo real, punto de venta con catálogo dinámico, fidelización de clientes y promociones.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000?logo=express)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite)](https://github.com/WiseLibs/better-sqlite3)
[![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-25c2a0?logo=socket.io)](https://socket.io/)
[![Tests](https://img.shields.io/badge/Tests-node%3Atest-5a5)](https://nodejs.org/api/test.html)

---

## Features

- **Dashboard operativo** — sensores simulados (temperatura, nivel de grano), gráfico histórico, KPIs de ventas y feed de pedidos en vivo vía WebSocket.
- **Punto de venta** — catálogo organizado por categorías con grid visual, selección múltiple con cantidad, auto-lookup de cliente con saldo de puntos.
- **Fidelización** — acumulación automática de puntos por pedido, canje por promociones, ledger completo de movimientos.
- **API REST** — endpoints para pedidos, productos, promociones, usuarios y movimientos con filtros.
- **Arquitectura limpia** — backend organizado en 3 capas (routes / services / repositories) sobre Express.
- **UI responsiva** — paleta cafetera, navegación adaptable a móvil, componentes reutilizables (tabla, toasts).

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Express 4.x (3-Tier) |
| Base de datos | SQLite via better-sqlite3 |
| Tiempo real | Socket.IO |
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Gráficos | Chart.js (CDN) |

---

## Quick start

```bash
npm install
npm start        # http://localhost:8080
npm test         # 9 tests, node:test
```

Variables de entorno:

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `8080` | Puerto del servidor |

---

## API

### Pedidos

```http
GET /api/pedidos?usuario=&desde=&hasta=&limite=
POST /api/pedidos
GET /api/pedidos/resumen
```

`POST /api/pedidos` crea un pedido con múltiples items y otorga +50 puntos al cliente:

```json
{
  "items": [
    { "producto": "Latte", "precio": 3.50, "cantidad": 2 },
    { "producto": "Croissant", "precio": 3.00, "cantidad": 1 }
  ],
  "username": "cliente1"
}
```

### Catálogo

```http
GET /api/categorias
GET /api/productos?categoria_id=
```

### Promociones

```http
GET /api/promos
POST /api/promos/:id/redeem    # body: { "username": "..." }
```

### Usuarios

```http
GET /api/usuarios/:username
```

### Movimientos (ledger)

```http
GET /api/movimientos?usuario=&limite=
```

---

## Estructura del proyecto

```
├── server.js                  # Entrypoint
├── src/
│   ├── granoks.js             # Fábrica del servidor
│   ├── db.js                  # Schema SQLite + seed data
│   ├── routes/                # Capa de presentación (Express)
│   ├── services/              # Capa de negocio (transacciones)
│   └── repositories/          # Capa de datos (queries)
├── public/                    # Frontend estático
│   ├── index.html             # Dashboard
│   ├── pedidos.html           # POS
│   ├── css/                   # Estilos (styles, nav, pos, dashboard)
│   └── js/                    # Lógica frontend + componentes (table, toast)
├── test/
│   └── granoks.test.js        # Tests (node:test)
├── granoks.db                 # SQLite local (gitignored)
└── package.json
```

---

## Seed data

Al arrancar por primera vez, la aplicación crea automáticamente:

- **3 categorías**: Cafés, Bebidas Frías, Pastelería
- **13 productos**: espresso, americano, latte, cappuccino, mocaccino, iced latte, frappuccino, smoothie, limonada, croissant, muffin, cookie, brownie
- **3 promociones**: café gratis (50 pts), descuento 20% (100 pts), taza personalizada (200 pts)
- **1 usuario de prueba**: `cliente1` (0 puntos iniciales)

---

## Tests

```bash
npm test
```

Suite de 9 tests que cubren:

- Creación de pedidos con validación
- Acumulación y canje de puntos
- Cálculo de resumen de ventas (KPIs)
- Ledger de movimientos (pedido + canje)
- Filtros por usuario y rango de fechas

---

## Roadmap

- [x] Dashboard con sensores simulados y KPIs
- [x] POS con catálogo y selección múltiple
- [x] Fidelización con puntos y promociones
- [x] Ledger de trazabilidad (movimientos)
- [ ] Simulación de pedidos automáticos
- [ ] Alertas de stock bajo
- [ ] Autenticación y roles
- [ ] Exportación CSV
- [ ] Panel de administración

---

## Licencia

MIT
