# Granoks-Hub Node

Mini-ERP Coffee 4.0 migrado a Node.js.

## Requisitos
Node.js 18+

## Instalacion
npm install

## Ejecutar
npm start

## Tests
npm test

## Paginas
- / - Dashboard con graficas y WebSocket
- /pedidos.html - POS y canje promos

## API
| GET /api/pedidos | Lista pedidos |
| POST /api/pedidos | Crea pedido (+50 puntos) |
| GET /api/promos | Lista promociones |
| POST /api/promos/:id/redeem | Canjea promo |
| GET /api/usuarios/:username | Consulta usuario |

## Estructura
- [server.js](server.js) - Punto de entrada que arranca el servidor
- [src/granoks.js](src/granoks.js) - Fabrica del servidor y rutas API
- [test/granoks.test.js](test/granoks.test.js) - Tests de rutas criticas
- [public/](public) - Frontend estatico

## Notas
- La app usa SQLite local en `granoks.db`.
- El puerto por defecto es `8080` si no se define `PORT`.
- Se inicializan datos de ejemplo para `cliente1` y promos base en el arranque.

## Stack
Express + Socket.io + better-sqlite3 + Chart.js CDN

