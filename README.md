# Granoks-Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

**Granoks-Hub** es un mini-ERP Coffee 4.0 que integra:

* **Dashboard en tiempo real** de temperatura y nivel de granos (simulación IoT con WebSocket + Chart.js).
* **Punto de venta básico (POS)** para gestionar pedidos y sistema de puntos (+50 puntos por pedido).
* **Simulación de sensores** sin hardware real, con datos aleatorios enviados cada 2 segundos.
* **Canje de promociones** directo desde la interfaz, sin lógica compleja.

## 📋 Características principales

* **Monitorización en vivo**: gráfica de temperatura y nivel de granos actualizada al instante.
* **Gestión de pedidos**: CRUD de pedidos y actualización automática de puntos de usuario.
* **Gamificación ligera**: acumula puntos y canjéalos por promociones.
* **API REST**: endpoints para crear y listar pedidos en formato JSON.

## 🛠️ Tecnologías y herramientas

* **Lenguaje**: Java 21
* **Framework**: Spring Boot (Web, Data JPA, WebSocket, Scheduling)
* **Persistencia**: MySQL configurada para desarrollo local (JPA se encarga de crear y actualizar tablas automáticamente)
* **Frontend**: Thymeleaf, Chart.js, STOMP/SockJS
* **Testing**: JUnit, Mockito

## 📡 Endpoints API REST

| Método | Ruta           | Descripción              |
| ------ | -------------- | ------------------------ |
| GET    | `/api/pedidos` | Listar todos los pedidos |
| POST   | `/api/pedidos` | Crear un nuevo pedido    |

## 👥 Desarrollo

Este proyecto es desarrollado y mantenido por Uxopousa.

## 📄 Licencia

Este proyecto está bajo la **licencia MIT**. Consulta el archivo [LICENSE.md](LICENSE.md) para más detalles.
