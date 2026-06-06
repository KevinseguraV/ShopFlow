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

##  Tabla de contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tech Stack](#-tech-stack)
- [Microservicios](#-microservicios)
- [Flujo Saga](#-flujo-saga)
- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)

---

##  Descripción

ShopFlow es una aplicación de e-commerce completa desarrollada como proyecto de portfolio. Implementa una arquitectura de microservicios con comunicación asíncrona mediante Apache Kafka, autenticación JWT, gestión de inventario en tiempo real y notificaciones por email automáticas al confirmar o cancelar órdenes.

---

## Arquitectura

```
                        ┌─────────────────────────────────────────┐
                        │              React Frontend              │
                        │         (Vite + Tailwind CSS)           │
                        └──────────────────┬──────────────────────┘
                                           │ HTTP
                        ┌──────────────────▼──────────────────────┐
                        │              API Gateway                 │
                        │     (Spring Cloud Gateway — :8080)      │
                        │  JWT Validation · CORS · Rate Limiting  │
                        └───┬───────┬───────┬───────┬─────────────┘
                            │       │       │       │
              ┌─────────────▼─┐ ┌───▼───┐ ┌▼──────┐ ┌▼──────────┐
              │ auth-service  │ │catalog│ │ cart  │ │  order    │
              │    :8081      │ │ :8082 │ │ :8083 │ │  :8084    │
              │  PostgreSQL   │ │MongoDB│ │ Redis │ │PostgreSQL │
              └───────────────┘ └───────┘ └───────┘ └─────┬─────┘
                                                           │ Kafka
                          ┌───────────────────────────────┼──────────────┐
                          │                               │              │
                    ┌─────▼──────┐               ┌────────▼────┐  ┌──────▼──────┐
                    │  payment   │               │  inventory  │  │notification │
                    │  :8085     │               │   :8086     │  │   :8087     │
                    │ PostgreSQL │               │ PostgreSQL  │  │   Gmail     │
                    └────────────┘               └─────────────┘  └─────────────┘
```

---

##  Tech Stack

### Backend
| Tecnología | Uso |
|---|---|
| Java 17 | Lenguaje principal |
| Spring Boot 3.4.5 | Framework base |
| Spring Cloud Gateway | API Gateway + JWT |
| Spring Security | Autenticación |
| Spring Data JPA | Persistencia relacional |
| Spring Data MongoDB | Persistencia documental |
| Spring Data Redis | Cache y carrito |
| Spring Kafka | Mensajería asíncrona |
| JWT (jjwt) | Tokens de acceso y refresh |
| Lombok | Reducción de boilerplate |
| Maven | Gestión de dependencias |

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Estilos |
| React Router v6 | Navegación |
| Axios | HTTP client |
| Cloudinary | Almacenamiento de imágenes |

### Infraestructura
| Tecnología | Uso |
|---|---|
| PostgreSQL | BD relacional (auth, orders, payments, inventory) |
| MongoDB | BD documental (catálogo) |
| Redis | Cache / carrito de compras |
| Apache Kafka | Mensajería entre microservicios |
| Docker | Kafka y Redis en contenedores |

---

##  Microservicios

| Servicio | Puerto | BD | Responsabilidad |
|---|---|---|---|
| `api-gateway` | 8080 | — | Enrutamiento, validación JWT, CORS |
| `auth-service` | 8081 | PostgreSQL | Registro, login, refresh tokens |
| `catalog-service` | 8082 | MongoDB | Productos, categorías, búsqueda |
| `cart-service` | 8083 | Redis | Carrito de compras |
| `order-service` | 8084 | PostgreSQL | Creación y gestión de órdenes |
| `payment-service` | 8085 | PostgreSQL | Procesamiento de pagos (mock 80%) |
| `inventory-service` | 8086 | PostgreSQL | Stock y reservas de inventario |
| `notification-service` | 8087 | — | Emails con Gmail SMTP |

---

##  Flujo Saga

ShopFlow implementa el **patrón Saga coreografiado** para mantener la consistencia entre microservicios sin transacciones distribuidas:

```
Usuario confirma compra
        │
        ▼
order-service → guarda orden PENDING → publica [order.created]
        │
        ├──► payment-service consume [order.created]
        │         │
        │         ├── 80% éxito  → publica [payment.approved]
        │         └── 20% fallo  → publica [payment.failed]
        │
        ├──► inventory-service consume [order.created]
        │         └── reserva stock temporalmente
        │
order-service consume [payment.approved] → orden CONFIRMED → publica [order.confirmed]
order-service consume [payment.failed]   → orden CANCELLED → publica [order.cancelled]
        │
        ├──► inventory-service consume [order.confirmed] → descuenta stock definitivo
        │    inventory-service consume [order.cancelled] → libera stock reservado
        │
        └──► notification-service consume [order.confirmed] → email de confirmación
             notification-service consume [order.cancelled] → email de cancelación
```

---

##  Características

### Tienda
-  Búsqueda y filtrado de productos por categoría
-  Carrito de compras persistente en Redis
-  Detalle de producto con estado de stock en tiempo real
-  Checkout con validación de dirección
-  Historial de órdenes con detalle completo
-  Email automático al confirmar o cancelar una orden

### Autenticación
-  JWT con access token (15 min) + refresh token (7 días)
-  Rotación automática de refresh tokens
-  Roles: `USER` y `ADMIN`

### Panel de administración
-  CRUD completo de productos con imágenes en Cloudinary
- ️ Gestión de categorías
-  Control de inventario con alertas de stock bajo
-  Visualización de órdenes con filtros por estado

### Inventario inteligente
-  Badge "En stock" con cantidad disponible
- ️ Alerta "¡Solo quedan X unidades!" cuando el stock es bajo
-  Badge "Agotado" y botón deshabilitado cuando no hay stock
-  Reserva temporal de stock durante el proceso de pago

---

##  Requisitos

- Java 17+
- Node.js 18+
- Maven 3.8+
- PostgreSQL 12+
- MongoDB 6+
- Docker (para Kafka y Redis)
- Cuenta de Cloudinary (gratuita)
- Cuenta de Gmail con verificación en 2 pasos y App Password

---

##  Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/kevinsegurav/ShopFlow.git
cd ShopFlow
```

### 2. Levantar infraestructura con Docker

```bash
# Kafka
docker run -d --name shopflow-kafka -p 9092:9092 apache/kafka:3.7.0

# Redis
docker run -d --name shopflow-redis -p 6379:6379 redis:7-alpine
```

### 3. Crear bases de datos en PostgreSQL

```sql
CREATE DATABASE shopflow_auth;
CREATE DATABASE shopflow_orders;
CREATE DATABASE shopflow_payments;
CREATE DATABASE shopflow_inventory;
```

### 4. Configurar variables de entorno

Copia y edita el archivo de ejemplo en cada microservicio (ver sección [Variables de entorno](#-variables-de-entorno)).

### 5. Levantar los microservicios

Levanta cada servicio en este orden desde su carpeta raíz:

```bash
# En cada carpeta de microservicio:
mvn spring-boot:run
```

Orden recomendado:
1. `auth-service`
2. `catalog-service`
3. `cart-service`
4. `inventory-service`
5. `payment-service`
6. `order-service`
7. `notification-service`
8. `api-gateway`

### 6. Levantar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

---

##  Variables de entorno

### auth-service / order-service / payment-service / inventory-service
```properties
POSTGRES_URL=jdbc:postgresql://localhost:5432/shopflow_auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_muy_largo
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

### catalog-service
```properties
MONGODB_URI=mongodb://localhost:27017/shopflow_catalog
```

### cart-service
```properties
REDIS_HOST=localhost
REDIS_PORT=6379
```

### notification-service
```properties
MAIL_USERNAME=tucorreo@gmail.com
MAIL_PASSWORD=tu_app_password_de_gmail
```

### Frontend (.env)
```env
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
```

---

##  Estructura del proyecto

```
ShopFlow/
├── api-gateway/
├── auth-service/
├── catalog-service/
├── cart-service/
├── order-service/
├── payment-service/
├── inventory-service/
├── notification-service/
└── frontend/
    └── src/
        ├── admin/          # Panel de administración
        ├── api/            # Clientes HTTP
        ├── components/     # Componentes reutilizables
        ├── context/        # AuthContext
        ├── layouts/        # MainLayout, AdminLayout
        ├── pages/          # Páginas de la tienda
        └── routes/         # AppRoutes, ProtectedRoute, AdminRoute
```

---

##  Autor Kevin Segura Velandia

Desarrollado como proyecto de portfolio full-stack.

- **Stack**: Java 17 · Spring Boot · React · Kafka · PostgreSQL · MongoDB · Redis
- **Patrón**: Microservicios · Saga · Event-Driven Architecture

---

>  Si te parece útil, dale una estrella al repositorio.