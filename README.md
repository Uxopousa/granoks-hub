# Granoks-Hub ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

Mini-ERP Coffee 4.0 con dashboard en tiempo real, POS básico y simulación IoT de sensores.

**Granoks-Hub** es una demo de “mini-ERP” para cafeterías, que permite:

- **Vigilar en directo** la temperatura y el nivel de granos de la cafetera (simulado).  
- **Registrar pedidos** al instante y acumular 50 puntos por cada café.  
- **Canjear puntos** por promociones desde la misma interfaz.  
- **Mostrar datos en vivo**: la aplicación recibe y muestra automáticamente información de “sensores” cada pocos segundos.

---

## Prerrequisitos

- **Java** 21  
- **Maven** 3.8+  
- **MySQL** 8.x (o Docker) escuchando en `localhost:3306`, con base de datos `granoks_hub` y un usuario con permisos.

---

## Funcionalidades

- **Dashboard en vivo**  
  Gráficas de temperatura (70–80 °C) y nivel de granos (0–100 %) enviadas por WebSocket (STOMP/SockJS) y renderizadas con Chart.js.

- **Punto de venta (POS)**  
  CRUD de pedidos y sistema de puntos (+50 puntos/pedido). Visualización instantánea del saldo de cada usuario.

- **Simulación IoT**  
  Servicio programado (`@Scheduled`) que envía datos aleatorios cada 2 s, sin hardware real.

- **Promociones**  
  Entidad `Promo` sencilla (id, descripción, costePuntos) y canje de puntos desde la UI.

---

## Tecnologías y versiones

- **Java** 21  
- **Spring Boot** 3.2.x  
- **Spring WebSocket (STOMP + SockJS)**  
- **Spring Data JPA**  
- **MySQL** configurado en `application.properties`  
- **Thymeleaf**  
- **Chart.js** (v4.x desde CDN)  
- **JUnit Jupiter & Mockito**

---

## Estructura del proyecto

```
granoks-hub/
├─ src/
│  ├─ main/
│  │  ├─ java/com/uxopousa/granokshub/
│  │  │  ├─ config/       ← WebSocket, Scheduling
│  │  │  ├─ model/        ← Pedido, Usuario, Promo
│  │  │  ├─ repo/         ← JpaRepositories
│  │  │  ├─ service/      ← Lógica de pedidos y simulación IoT
│  │  │  ├─ web/          ← @Controller & @RestController
│  │  │  └─ dto/          ← Clases DTO para API REST
│  │  └─ resources/
│  │     ├─ templates/    ← Thymeleaf (.html)
│  │     └─ application.properties
│  └─ test/
│     └─ java/...         ← Tests unitarios
├─ .gitignore
├─ LICENSE.md
└─ pom.xml
```

---

## Endpoints API REST

| Método | Ruta                       | Descripción                   |
|:-------|:---------------------------|:------------------------------|
| GET    | `/api/pedidos`             | Lista todos los pedidos       |
| POST   | `/api/pedidos`             | Crea un nuevo pedido          |
| GET    | `/api/promos`              | Lista promociones disponibles |
| POST   | `/api/promos/{id}/redeem`  | Canjea una promoción          |

**Ejemplo**:  
```bash
curl -X POST http://localhost:8080/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"producto":"Espresso","total":2.50,"username":"cliente1"}'
```

---

## Uso rápido

1. Clona el repositorio  
   ```bash
   git clone https://github.com/Uxopousa/granoks-hub.git
   cd granoks-hub
   ```
2. Ajusta tus credenciales MySQL en  
   `src/main/resources/application.properties`.  
3. Ejecuta la aplicación  
   ```bash
   mvn clean spring-boot:run
   ```
4. Accede en tu navegador  
   - **Dashboard**: `http://localhost:8080/dashboard`  
   - **POS**:       `http://localhost:8080/pedidos`  
   - **API REST**: `http://localhost:8080/api/pedidos`

---

## Mantenimiento

Proyecto mantenido por **Uxopousa**.

---

## Licencia

Este proyecto está bajo la [MIT License](LICENSE.md).
