# Granoks-Hub

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Local-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?logo=socket.io)](https://socket.io/)
[![Tests](https://img.shields.io/badge/Tests-node%3Atest-success)](https://nodejs.org/api/test.html)

Mini-ERP ligero para cafeterías — dashboard en tiempo real, punto de venta con catálogo, múltiples items por pedido, puntos de fidelización y promociones.

## Descripción

Aplicación web que centraliza pedidos, fidelización y promociones. Backend Express 3-capas con SQLite, frontend HTML/CSS/JS vanilla. Datos simulados de sensores en dashboard.

## Vista rápida

| Campo | Valor |
| --- | --- |
| Tipo | Mini ERP cafetería |
| Arquitectura | 3-Tier (routes / services / repositories) |
| Tiempo real | Socket.IO |
| Persistencia | SQLite (better-sqlite3) |
| Tests | Node.js `node:test` |
| Frontend | HTML, CSS, JS estáticos |
| Sensorización | Simulada |

## Requisitos

| Requisito | Detalle |
| --- | --- |
| Node.js | 18 o superior |

## Instalación y ejecución

| Paso | Comando |
| --- | --- |
| Instalar | `npm install` |
| Ejecutar | `npm start` |
| Tests | `npm test` |

## Páginas

| Ruta | Descripción |
| --- | --- |
| `/` | Dashboard con sensores, gráficos y resumen de ventas |
| `/pedidos.html` | POS con catálogo por categorías y canje de promos |

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/pedidos` | Lista pedidos (filtro: usuario, desde, hasta, limite) |
| POST | `/api/pedidos` | Crea pedido con items array (+50 puntos) |
| GET | `/api/pedidos/resumen` | KPIs: total pedidos, ingresos, promedio |
| GET | `/api/categorias` | Lista categorías de producto |
| GET | `/api/productos` | Lista productos (filtro: categoria_id) |
| GET | `/api/promos` | Lista promociones |
| POST | `/api/promos/:id/redeem` | Canjea promo por puntos |
| GET | `/api/usuarios/:username` | Consulta usuario y saldo puntos |
| GET | `/api/movimientos` | Ledger de movimientos (filtro: usuario, limite) |

## Funcionalidades

- **Dashboard**: sensores simulados (temp, nivel grano), gráfico histórico, KPI cards (pedidos, ingresos, ticket promedio), últimos pedidos en vivo vía WebSocket.
- **POS**: grid de productos con pestañas por categoría, selección múltiple con cantidad (+/-), auto-lookup de cliente, puntos acumulados, canje de promociones.
- **Fidelización**: +50 puntos por pedido, canje por promociones, ledger completo de movimientos.
- **UI**: paleta cafetera (espresso, crema, ámbar, matcha), diseño responsive, nav edge-to-edge, toasts, tabla reutilizable.

## Estructura

| Archivo | Función |
| --- | --- |
| `server.js` | Entrypoint |
| `src/granoks.js` | Fábrica del servidor |
| `src/db.js` | Schema + seed |
| `src/routes/` | Capa presentación (rutas Express) |
| `src/services/` | Capa negocio (transacciones) |
| `src/repositories/` | Capa datos (queries SQLite) |
| `test/granoks.test.js` | Tests node:test |
| `public/` | Frontend estático |
| `public/js/components/` | Componentes reutilizables (table, toast) |

## Stack

| Componente | Tecnología |
| --- | --- |
| Backend | Express 3-Tier |
| Tiempo real | Socket.IO |
| Base de datos | better-sqlite3 |
| Gráficas | Chart.js CDN |

## Notas

| Punto | Detalle |
| --- | --- |
| Base de datos | SQLite local en `granoks.db` |
| Puerto | `8080` por defecto (`PORT` para cambiar) |
| Datos iniciales | 3 categorías, 13 productos, 3 promos, 1 usuario seed |
| Sensores | Simulados (sin integración física) |

## Roadmap

| Versión | Estado |
| --- | --- |
| Base POS + dashboard + puntos | ✅ |
| Catálogo productos por categorías | ✅ |
| Múltiples items por pedido con cantidad | ✅ |
| Ledger de movimientos | ✅ |
| Simulación pedidos + alertas stock | Pendiente |
| Autenticación / roles | Futuro |
| Exportación CSV / informes | Futuro |
