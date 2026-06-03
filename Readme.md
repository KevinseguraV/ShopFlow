#  ShopFlow

## Plataforma de E-commerce basada en Arquitectura de Microservicios

Java 17 • Spring Boot 3.4.5 • React • PostgreSQL • MongoDB • Redis • Kafka

---

##  Descripción

ShopFlow es una plataforma de e-commerce desarrollada con arquitectura de microservicios utilizando Java 21 y Spring Boot 3.4.5.

La plataforma implementa autenticación JWT, catálogo de productos, carrito de compras, procesamiento de órdenes, gestión de inventario y pagos simulados mediante Apache Kafka y el patrón Saga.

---

##  Microservicios

| Servicio | Puerto | Base de Datos | Estado |
|-----------|---------|---------------|---------|
| api-gateway | 8080 | — |  Completado |
| auth-service | 8081 | PostgreSQL |  Completado |
| catalog-service | 8082 | MongoDB |  Completado |
| cart-service | 8083 | Redis |  Completado |
| order-service | 8084 | PostgreSQL |  Completado |
| payment-service | 8085 | PostgreSQL |  Completado |
| inventory-service | 8086 | PostgreSQL |  Completado |

---

##  Stack Tecnológico

### Backend
- Java 17
- Spring Boot 3.4.5
- Spring Security
- Spring Cloud Gateway
- Spring Data JPA
- Spring Data MongoDB
- Spring Actuator
- Micrometer

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Datos y Mensajería
- PostgreSQL
- MongoDB
- Redis
- Apache Kafka

---

##  Saga Pattern

1. order-service crea una orden PENDING.
2. Publica order.created.
3. payment-service procesa el pago.
4. Publica payment.approved o payment.failed.
5. order-service actualiza el estado.
6. inventory-service confirma o libera stock.

---

##  Bases de Datos

```sql
CREATE DATABASE shopflow_auth;
CREATE DATABASE shopflow_orders;
CREATE DATABASE shopflow_payments;
CREATE DATABASE shopflow_inventory;
```

MongoDB:

```text
shopflow_catalog
```

---

## Autor

Kevin segura velandia
