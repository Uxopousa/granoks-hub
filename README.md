# Granoks-Hub Node

Mini-ERP Coffee 1.0 para cafeterías, pensado como proyecto de DAW: funcional, demostrable y fácil de seguir.

## Qué hace ahora
- Dashboard en tiempo real con sensores simulados de temperatura y nivel de grano.
- Punto de venta para registrar pedidos.
- Sistema de puntos por pedido (+50 puntos).
- Canje de promociones con saldo de usuario.
- Persistencia local con SQLite.
- Tests básicos de rutas críticas.

## Roadmap v1.0
### Ya hecho
- Dashboard en vivo.
- POS operativo.
- Sistema de puntos.
- Promociones canjeables.
- Validación básica de entradas.
- Tests automáticos de API.

### Siguiente mejora
- Separar mejor el frontend en archivos CSS y JS propios.
- Añadir historial detallado de pedidos por usuario.
- Mejorar mensajes de error y feedback visual.
- Añadir filtros y búsqueda en pedidos.
- Preparar despliegue con variables de entorno.

### Más adelante
- Autenticación simple de usuarios.
- Panel de administración.
- Exportación de datos a CSV.
- Métricas o gráficas más completas.

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

## Para reclutadores
Este proyecto muestra una aplicación full stack pequeña pero completa: API REST, tiempo real, persistencia local, validación, tests y una interfaz sencilla. Está pensado para enseñar base técnica, orden y capacidad de cerrar un producto funcional.

