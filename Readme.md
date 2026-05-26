<div align="center">

```
 _____ _               _____ _
/  ___| |             |  ___| |
\ `--.| |__   ___  _ _| |_  | | _____      __
 `--. \ '_ \ / _ \| '_ \  _| | |/ _ \ \ /\ / /
/\__/ / | | | (_) | |_) | |   | | (_) \ V  V /
\____/|_| |_|\___/| .__/\_|   |_|\___/ \_/\_/
                  | |
                  |_|
```

# 🛒 ShopFlow

**Plataforma de e-commerce construida con arquitectura de microservicios**

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.5-green?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-Gateway-6DB33F?style=flat-square&logo=spring)](https://spring.io/projects/spring-cloud-gateway)

</div>

---

## 📌 ¿Qué es ShopFlow?

ShopFlow es una plataforma de e-commerce moderna, construida desde cero con arquitectura de **microservicios**. Cada dominio del negocio vive en su propio servicio independiente, con su propia base de datos, desplegable y escalable de forma autónoma.

---

## 🏗️ Arquitectura General

```
                         ┌─────────────────────┐
                         │     Cliente Web      │
                         │  (Browser / Mobile)  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │         API Gateway           │
                    │        :8080                  │
                    │  • Enrutamiento               │
                    │  • Validación JWT             │
                    │  • Inyección de headers       │
                    └───┬───────┬───────┬───────────┘
                        │       │       │
          ┌─────────────┘       │       └──────────────┐
          ▼                     ▼                       ▼
  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
  │ auth-service │    │ catalog-service  │    │   cart-service   │
  │    :8081     │    │     :8082        │    │     :8083        │
  │              │    │                  │    │                  │
  │ PostgreSQL   │    │    MongoDB       │    │    (pendiente)   │
  └──────────────┘    └──────────────────┘    └──────────────────┘

          ┌─────────────────┬──────────────────┐
          ▼                 ▼                  ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
  │ order-service│  │payment-serv. │  │inventory-service │
  │    :8084     │  │    :8085     │  │     :8086        │
  │  (pendiente) │  │ (pendiente)  │  │   (pendiente)    │
  └──────────────┘  └──────────────┘  └──────────────────┘
```

---

## 🧩 Microservicios

| Servicio | Puerto | Base de Datos | Estado | README |
|---|---|---|---|---|
| `api-gateway` | `8080` | — | ✅ Listo | [Ver README](./api-gateway/README.md) |
| `auth-service` | `8081` | PostgreSQL | ✅ Listo | [Ver README](./auth-service/README.md) |
| `catalog-service` | `8082` | MongoDB | ✅ Listo | [Ver README](./catalog-service/README.md) |
| `cart-service` | `8083` | — | 🚧 En desarrollo | — |
| `order-service` | `8084` | — | 🚧 En desarrollo | — |
| `payment-service` | `8085` | — | 🚧 En desarrollo | — |
| `inventory-service` | `8086` | — | 🚧 En desarrollo | — |

---

## ⚙️ Stack Tecnológico

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Java | 21 | Lenguaje principal |
| Spring Boot | 3.4.5 | Framework base |
| Spring Cloud Gateway | — | API Gateway y enrutamiento |
| Spring Security | — | Autenticación y autorización |
| Spring Data JPA | — | Persistencia relacional |
| Spring Data MongoDB | 4.4.5 | Persistencia documental |
| Hibernate Validator | 8.0.2 | Validación de DTOs |
| Lombok | 1.18.38 | Reducción de boilerplate |
| Micrometer | 1.14.6 | Métricas y observabilidad |
| Spring Actuator | 3.4.5 | Monitoreo de servicios |

### Bases de Datos
| Motor | Versión | Servicios que lo usan |
|---|---|---|
| PostgreSQL | 16 | auth-service |
| MongoDB | 7.x | catalog-service |

### Seguridad
| Componente | Detalle |
|---|---|
| JWT | HMAC-256, access token 15 min, refresh token 7 días |
| Roles | `USER` / `ADMIN` inyectados por el gateway en headers |

---

## 🔐 Flujo de Autenticación

```
1. POST /api/auth/register  →  Crea usuario + devuelve JWT
2. POST /api/auth/login     →  Autentica + devuelve JWT
3. GET  /api/catalog/...    →  Authorization: Bearer <token>
                                    │
                                    ▼
                              API Gateway valida JWT
                              Inyecta X-User-Id y X-User-Role
                                    │
                                    ▼
                              Microservicio destino
                              (no valida JWT, solo lee headers)
```

---

## 🚀 Cómo levantar el proyecto

### Prerrequisitos

- Java 21+
- Maven 3.8+
- MongoDB en `localhost:27017`
- PostgreSQL en `localhost:5432`

### 1. Crear base de datos PostgreSQL

```sql
CREATE DATABASE shopflow_auth;
```

> MongoDB crea `shopflow_catalog` automáticamente en el primer insert.

### 2. Levantar los servicios en orden

```bash
# 1. Auth Service
cd auth-service
mvn spring-boot:run

# 2. Catalog Service
cd catalog-service
mvn spring-boot:run

# 3. API Gateway (siempre último)
cd api-gateway
mvn spring-boot:run
```

### 3. Verificar que todo está arriba

```bash
curl http://localhost:8080/actuator/health  # Gateway
curl http://localhost:8081/actuator/health  # Auth
curl http://localhost:8082/actuator/health  # Catalog
```

Todos deben responder `{"status":"UP"}`.

---

## 📡 Endpoints principales

Todos los requests van al **API Gateway en el puerto 8080**.

### Autenticación

```http
POST http://localhost:8080/api/auth/register
POST http://localhost:8080/api/auth/login
POST http://localhost:8080/api/auth/refresh
POST http://localhost:8080/api/auth/logout
GET  http://localhost:8080/api/auth/me
```

### Catálogo

```http
GET  http://localhost:8080/api/catalog/products
GET  http://localhost:8080/api/catalog/products/{id}
GET  http://localhost:8080/api/catalog/products/slug/{slug}
GET  http://localhost:8080/api/catalog/products/search?query=laptop
GET  http://localhost:8080/api/catalog/products/category/{categoryId}
POST http://localhost:8080/api/catalog/products        ← requiere ADMIN
PUT  http://localhost:8080/api/catalog/products/{id}   ← requiere ADMIN
DEL  http://localhost:8080/api/catalog/products/{id}   ← requiere ADMIN
GET  http://localhost:8080/api/catalog/categories
POST http://localhost:8080/api/catalog/categories      ← requiere ADMIN
```

---

## 📁 Estructura del Repositorio

```
ShopFlow/
├── api-gateway/
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── auth-service/
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── catalog-service/
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── cart-service/          ← En desarrollo
├── order-service/         ← En desarrollo
├── payment-service/       ← En desarrollo
├── inventory-service/     ← En desarrollo
└── README.md              ← Este archivo
```

---

## 🩺 Monitoreo

Cada microservicio expone endpoints de Actuator:

| Endpoint | Descripción |
|---|---|
| `GET /actuator/health` | Estado del servicio y sus dependencias |
| `GET /actuator/info` | Información del servicio |

---

## 🗺️ Roadmap

- [x] API Gateway con validación JWT
- [x] Auth Service (registro, login, refresh, logout)
- [x] Catalog Service (productos y categorías)
- [ ] Cart Service (carrito de compras)
- [ ] Order Service (gestión de pedidos)
- [ ] Payment Service (pagos)
- [ ] Inventory Service (inventario)
- [ ] Docker Compose para levantar todo con un comando
- [ ] Tests de integración por microservicio

---

## 👤 Autor

Desarrollado por **Kevin** como proyecto de arquitectura de microservicios con Spring Boot.

---

*ShopFlow © 2026 — Arquitectura de Microservicios con Spring Boot*