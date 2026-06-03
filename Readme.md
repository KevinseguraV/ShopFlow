<div align="center">

#  ShopFlow

### Plataforma de E-commerce basada en Arquitectura de Microservicios

Java 17 • Spring Boot 3.4.5 • React • PostgreSQL • MongoDB • Redis • Kafka

[![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.5-green?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square&logo=redis)](https://redis.io/)
[![Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Driven-black?style=flat-square&logo=apachekafka)](https://kafka.apache.org/)

</div>

---

#  Descripción

ShopFlow es una plataforma de e-commerce moderna desarrollada utilizando una arquitectura de microservicios completamente desacoplada.

El proyecto implementa autenticación JWT, catálogo de productos, carrito de compras, procesamiento de órdenes, pagos simulados, gestión de inventario y comunicación asíncrona mediante Apache Kafka utilizando el patrón Saga para garantizar consistencia distribuida.

Cada microservicio posee su propia responsabilidad, almacenamiento y ciclo de vida independiente.

---

#  Características

- Arquitectura de Microservicios
- API Gateway centralizado
- Autenticación JWT
- Refresh Token Rotation
- Catálogo de productos
- Gestión de categorías
- Carrito basado en Redis
- Órdenes distribuidas
- Procesamiento de pagos
- Gestión de inventario
- Comunicación Event-Driven
- Apache Kafka
- Saga Pattern
- React + Vite
- Tailwind CSS
- PostgreSQL
- MongoDB
- Redis

---

# ️ Arquitectura General

```text
Frontend React
      │
      ▼
API Gateway (8080)
      │
 ┌────┼────┬────┬────┐
 ▼    ▼    ▼    ▼    ▼

Auth       Catalog      Cart
8081       8082         8083

            │
            ▼

        Kafka

            │
     ┌──────┼─────────┐
     ▼      ▼         ▼

   Orders Payments Inventory
    8084     8085      8086
```

---

# Microservicios

| Servicio | Puerto | Persistencia |
|-----------|---------|-------------|
| api-gateway | 8080 | — |
| auth-service | 8081 | PostgreSQL |
| catalog-service | 8082 | MongoDB |
| cart-service | 8083 | Redis |
| order-service | 8084 | PostgreSQL |
| payment-service | 8085 | PostgreSQL |
| inventory-service | 8086 | PostgreSQL |

---

#  Stack Tecnológico

## Backend

- Java 17
- Spring Boot 3.4.5
- Spring Security
- Spring Cloud Gateway
- Spring Data JPA
- Spring Data MongoDB
- Hibernate Validator
- Lombok
- Spring Actuator
- Micrometer

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Bases de Datos

### PostgreSQL

- shopflow_auth
- shopflow_orders
- shopflow_payments
- shopflow_inventory

### MongoDB

- shopflow_catalog

### Redis

- Carrito de compras

---

#  Seguridad

## JWT

- Access Token: 15 minutos
- Refresh Token: 7 días
- Rotación de Refresh Token
- Roles USER y ADMIN

## Propagación de Identidad

El Gateway valida el token y propaga:

```http
X-User-Id
X-User-Role
```

---

#  Saga Pattern

## Flujo Completo

```text
Frontend
   │
   ▼

POST /api/orders

   │
   ▼

order-service

   │
   ▼

Kafka Topic
order.created

   │
   ▼

payment-service

 ├─ payment.approved
 └─ payment.failed

   │
   ▼

order-service

 CONFIRMED
 CANCELLED

   │
   ▼

inventory-service

 reserva/libera stock
```

---

#  Auth Service

## Endpoints

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### Funcionalidades

- Registro
- Login
- Logout
- Refresh Token
- Perfil autenticado

---

#  Catalog Service

## Funcionalidades

- CRUD Productos
- CRUD Categorías
- Búsqueda
- Paginación
- Control ADMIN

## Endpoints

```http
GET /api/catalog/products
GET /api/catalog/products/{id}
GET /api/catalog/products/search
GET /api/catalog/categories
```

---

#  Cart Service

## Funcionalidades

- Obtener carrito
- Agregar producto
- Actualizar cantidad
- Eliminar producto
- Vaciar carrito

## Endpoints

```http
GET /api/cart
POST /api/cart/items
PUT /api/cart/items/{productId}
DELETE /api/cart/items/{productId}
DELETE /api/cart
```

---

# Order Service

## Funcionalidades

- Crear orden
- Consultar órdenes
- Consultar detalle
- Publicar eventos Kafka

## Endpoints

```http
POST /api/orders
GET /api/orders
GET /api/orders/{id}
```

---

#  Payment Service

## Funcionalidades

- Consumo de eventos order.created
- Pago mock
- Idempotencia
- Publicación de eventos

```properties
payment.mock.success-rate=0.8
```

---

#  Inventory Service

## Funcionalidades

- Reserva de stock
- Confirmación de stock
- Liberación de stock

## Endpoints

```http
GET /api/inventory
GET /api/inventory/{productId}
POST /api/inventory
```

---

# ️ Frontend

## Tecnologías

- React
- Vite
- Tailwind CSS

## Páginas

### Públicas

- Home
- Login
- Register
- Products
- Product Detail

### Protegidas

- Cart
- Checkout
- Orders

---

#  Estructura Frontend

```text
frontend/src
│
├── api
├── components
├── context
├── layouts
├── pages
└── routes
```

---

#  Ejecución Local

## Requisitos

- Java 17
- Maven 3.9+
- PostgreSQL
- MongoDB
- Docker

---

## PostgreSQL

```sql
CREATE DATABASE shopflow_auth;
CREATE DATABASE shopflow_orders;
CREATE DATABASE shopflow_payments;
CREATE DATABASE shopflow_inventory;
```

---

## MongoDB

```text
shopflow_catalog
```

---

## Kafka

```bash
docker start shopflow-kafka
```

---

## Redis

```bash
docker start shopflow-redis
```

---

## Orden de Inicio

```text
1. auth-service
2. catalog-service
3. cart-service
4. inventory-service
5. payment-service
6. order-service
7. api-gateway
8. frontend
```

---

#  Validación del Flujo

1. Registrar usuario
2. Iniciar sesión
3. Consultar catálogo
4. Agregar productos al carrito
5. Realizar checkout
6. Verificar orden creada
7. Verificar procesamiento de Saga
8. Confirmar actualización de inventario

---

#  Estructura del Proyecto

```text
ShopFlow
│
├── api-gateway
├── auth-service
├── catalog-service
├── cart-service
├── order-service
├── payment-service
├── inventory-service
├── frontend
└── README.md
```

---

#  Observabilidad

Todos los servicios exponen:

```http
GET /actuator/health
GET /actuator/info
```

---

#  Estado Actual

| Componente | Estado |
|------------|---------|
| API Gateway | ✅ |
| Auth Service | ✅ |
| Catalog Service | ✅ |
| Cart Service | ✅ |
| Order Service | ✅ |
| Payment Service | ✅ |
| Inventory Service | ✅ |
| Frontend | ✅ |
| Kafka | ✅ |
| Saga Pattern | ✅ |

---

#  Próximas Mejoras

- Docker Compose
- GitHub Actions
- Prometheus
- Grafana
- Kubernetes
- Pasarela de pagos real
- Testcontainers
- Integración continua

---

#  Autor

Kevin Jair Segura Velandia

Proyecto desarrollado para demostrar arquitectura de microservicios, comunicación asíncrona mediante Apache Kafka, autenticación JWT y patrones distribuidos utilizando Spring Boot.

---


