# Granoks-Hub Node

Mini-ERP Coffee 4.0 migrado a Node.js.

## Requisitos
Node.js 18+

## Instalacion
npm install

## Ejecutar
npm start

## Paginas
- / - Dashboard con graficas y WebSocket
- /pedidos.html - POS y canje promos

## API
| GET /api/pedidos | Lista pedidos |
| POST /api/pedidos | Crea pedido (+50 puntos) |
| GET /api/promos | Lista promociones |
| POST /api/promos/:id/redeem | Canjea promo |
| GET /api/usuarios/:username | Consulta usuario |

## Stack
Express + Socket.io + better-sqlite3 + Tailwind CSS + Chart.js

