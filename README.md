# Granoks-Hub

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Local-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?logo=socket.io)](https://socket.io/)
[![Tests](https://img.shields.io/badge/Tests-node%3Atest-success)](https://nodejs.org/api/test.html)

Mini-ERP Coffee 1.0 para cafeterías.

Plataforma web para centralizar pedidos, promociones y fidelización.
Dashboard en tiempo real con datos simulados y punto de venta operativo.
Base técnica sencilla, persistente y preparada para evolucionar por versiones.

## Descripción
Granoks-Hub es una aplicación web para cafeterías que centraliza pedidos, puntos de fidelización, promociones y un panel en tiempo real con datos simulados de sensores.

La aplicación está planteada como un mini ERP ligero y demostrable, con una interfaz clara y un alcance cerrado para mostrar de forma ordenada funcionalidades clave en cafetería. La integración física con cafetera o tolva no forma parte de esta versión y se sustituye por simulación de datos.

## Vista rápida
| Campo | Valor |
| --- | --- |
| Versión | 1.0 |
| Tipo | Mini ERP para cafeterías |
| Tiempo real | Socket.IO |
| Persistencia | SQLite |
| Tests | Node.js `node:test` |
| Frontend | HTML, CSS y JavaScript estáticos |
| Sensorización | Simulada |

## Requisitos
| Requisito | Detalle |
| --- | --- |
| Node.js | 18 o superior |

## Instalación y ejecución
| Paso | Comando |
| --- | --- |
| Instalar dependencias | `npm install` |
| Ejecutar la app | `npm start` |
| Ejecutar tests | `npm test` |

## Páginas
| Ruta | Descripción |
| --- | --- |
| `/` | Dashboard con gráficas y WebSocket |
| `/pedidos.html` | POS y canje de promociones |

## API
| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/pedidos` | Lista pedidos |
| POST | `/api/pedidos` | Crea pedido (+50 puntos) |
| GET | `/api/promos` | Lista promociones |
| POST | `/api/promos/:id/redeem` | Canjea promo |
| GET | `/api/usuarios/:username` | Consulta usuario |

## Qué hace ahora
- Dashboard en tiempo real con sensores simulados de temperatura y nivel de grano.
- Punto de venta para registrar pedidos.
- Sistema de puntos por pedido (+50 puntos).
- Canje de promociones con saldo de usuario.
- Persistencia local con SQLite.
- Tests básicos de rutas críticas.

## Estructura
| Archivo | Función |
| --- | --- |
| [server.js](server.js) | Punto de entrada que arranca el servidor |
| [src/granoks.js](src/granoks.js) | Fábrica del servidor y rutas API |
| [test/granoks.test.js](test/granoks.test.js) | Tests de rutas críticas |
| [public/](public) | Frontend estático |

## Notas
| Punto | Detalle |
| --- | --- |
| Base de datos | SQLite local en `granoks.db` |
| Puerto por defecto | `8080` si no se define `PORT` |
| Datos iniciales | Se crean `cliente1` y promos base al arrancar |
| Sensores | La comunicación con cafetera y tolva no está implementada; los datos se simulan para mostrar el comportamiento en tiempo real |

## Stack
| Componente | Tecnología |
| --- | --- |
| Backend | Express |
| Tiempo real | Socket.IO |
| Base de datos | better-sqlite3 |
| Gráficas | Chart.js CDN |

## Alcance por versión
| Versión | Incluye |
| --- | --- |
| v1.0 | Dashboard, POS, puntos, promociones, validación, SQLite y tests |
| v1.1 | Historial de pedidos, filtros, stock básico, alertas y resumen de ventas |
| v2.0 | Autenticación, roles, panel de administración, exportación CSV e informes avanzados |

## Evolución prevista
| Prioridad | Mejora |
| --- | --- |
| Alta | Introducir un ledger de negocio con trazabilidad de pedidos, puntos, promos y stock |
| Alta | Añadir historial de pedidos por usuario y filtros de consulta |
| Alta | Mejorar el frontend con componentes reutilizables, diseño responsive y una capa visual más cuidada |
| Media | Gestión de stock y alertas de stock bajo |
| Media | Preparar despliegue con variables de entorno |
| Media | Mejorar mensajes de error y feedback visual |
| Baja | Informes de ventas e ingresos más completos |
| Baja | Autenticación, roles, panel de administración y exportación CSV |

---

*Para agentes y contribuidores: ver [`AGENTS.md`](./AGENTS.md) — brief completo con reglas, arquitectura y preferencias del proyecto.*

