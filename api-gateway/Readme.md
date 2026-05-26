# 🌐 API Gateway — ShopFlow

> Punto de entrada único para todos los microservicios de **ShopFlow**. Enruta las peticiones, valida tokens JWT e inyecta el rol del usuario en los headers antes de delegar al microservicio correspondiente.

---

## 🧱 Stack Tecnológico

| Tecnología | Rol |
|---|---|
| Java 21 | Lenguaje principal |
| Spring Boot 3.4.5 | Framework base |
| Spring Cloud Gateway | Enrutamiento y filtros |
| Spring Security | Validación JWT |
| JWT (HMAC-256) | Verificación de tokens |
| Spring Actuator | Monitoreo del gateway |

---

## ⚙️ Configuración

### `application.yml`

```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: false  # sin Eureka por ahora
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/auth/**

        - id: catalog-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/catalog/**

        - id: cart-service
          uri: http://localhost:8083
          predicates:
            - Path=/api/cart/**

        - id: order-service
          uri: http://localhost:8084
          predicates:
            - Path=/api/orders/**

        - id: payment-service
          uri: http://localhost:8085
          predicates:
            - Path=/api/payments/**

        - id: inventory-service
          uri: http://localhost:8086
          predicates:
            - Path=/api/inventory/**

jwt:
  secret: ${JWT_SECRET:ShopFlowSuperSecretKeyQueDebeTenerMinimo256BitsParaHMAC2024}
  expiration: 86400000

management:
  endpoints:
    web:
      exposure:
        include: health, info
  endpoint:
    health:
      show-details: always

logging:
  level:
    org.springframework.cloud.gateway: DEBUG
    org.springframework.security: DEBUG
```

### Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `JWT_SECRET` | `ShopFlowSuperSecret...` | Clave secreta para verificar tokens JWT |

> ⚠️ **Nunca subas `JWT_SECRET` a GitHub.** Usa un archivo `.env` o variables del sistema en producción.

---

## 🚀 Cómo ejecutar

### Prerrequisitos

- Java 21+
- Maven 3.8+
- Los microservicios que se quieran usar corriendo en sus puertos

### Levantar el gateway

```bash
# Compilar y ejecutar
mvn spring-boot:run

# Con variable de entorno personalizada
JWT_SECRET=miclaveultrasecreta mvn spring-boot:run
```

El gateway arranca en: `http://localhost:8080`

> El gateway actúa como proxy — los microservicios deben estar corriendo para que las rutas funcionen.

---

## 🗺️ Tabla de Rutas

Todas las peticiones entran por el puerto **8080** y el gateway las redirige al microservicio correcto:

| Ruta entrante | Microservicio destino | Puerto |
|---|---|---|
| `/api/auth/**` | auth-service | `8081` |
| `/api/catalog/**` | catalog-service | `8082` |
| `/api/cart/**` | cart-service | `8083` |
| `/api/orders/**` | order-service | `8084` |
| `/api/payments/**` | payment-service | `8085` |
| `/api/inventory/**` | inventory-service | `8086` |

---

## 🔐 Flujo de Autenticación

El gateway intercepta cada petición y ejecuta este flujo:

```
Cliente
  │
  ▼
API Gateway :8080
  │
  ├── /api/auth/**  →  Sin validación JWT (registro/login son públicos)
  │
  └── /api/**       →  Valida JWT
                          │
                          ├── Token inválido → 401 Unauthorized
                          │
                          └── Token válido
                                │
                                ├── Extrae userId y role del token
                                ├── Inyecta header: X-User-Id: <userId>
                                ├── Inyecta header: X-User-Role: <role>
                                │
                                └── Delega al microservicio destino
```

### Headers inyectados por el Gateway

Los microservicios reciben estos headers automáticamente en cada request autenticado:

| Header | Ejemplo | Descripción |
|---|---|---|
| `X-User-Id` | `1` | ID del usuario autenticado |
| `X-User-Role` | `ADMIN` | Rol del usuario (USER / ADMIN) |

> Así los microservicios no necesitan validar el JWT — solo leen estos headers.

---

## 📡 Ejemplos de uso

Todas las peticiones van al **puerto 8080** del gateway:

### Registro (público — sin token)
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "Kevin García",
  "email": "kevin@shopflow.com",
  "password": "Password123!"
}
```

### Login (público — sin token)
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "kevin@shopflow.com",
  "password": "Password123!"
}
```

### Listar productos (protegido — requiere token)
```http
GET http://localhost:8080/api/catalog/products
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### Crear producto (protegido — requiere token de ADMIN)
```http
POST http://localhost:8080/api/catalog/products
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "name": "Laptop Dell XPS",
  "basePrice": 1200.00,
  "categoryId": "6a162750aa10460c52db60bf",
  "stock": 10,
  "slug": "laptop-dell-xps"
}
```

---

## 🩺 Health & Monitoreo

```
GET http://localhost:8080/actuator/health
GET http://localhost:8080/actuator/info
```

**Respuesta de health:**
```json
{
  "status": "UP",
  "components": {
    "gateway": { "status": "UP" }
  }
}
```

---

## 📁 Estructura del Proyecto

```
api-gateway/
├── src/
│   └── main/
│       ├── java/com/shopflow/api_gateway/
│       │   ├── filter/
│       │   │   └── JwtAuthFilter.java
│       │   ├── config/
│       │   │   ├── GatewayConfig.java
│       │   │   └── SecurityConfig.java
│       │   ├── util/
│       │   │   └── JwtUtil.java
│       │   └── ApiGatewayApplication.java
│       └── resources/
│           ├── application.yml
│           └── application.properties
└── pom.xml
```

---

## 🔗 Microservicios — ShopFlow

| Servicio | Puerto | Descripción |
|---|---|---|
| `api-gateway` | `8080` | Punto de entrada único ✅ |
| `auth-service` | `8081` | Autenticación y JWT |
| `catalog-service` | `8082` | Catálogo de productos |
| `cart-service` | `8083` | Carrito de compras |
| `order-service` | `8084` | Gestión de pedidos |
| `payment-service` | `8085` | Pagos |
| `inventory-service` | `8086` | Inventario |

---

## 🚦 Orden de arranque recomendado

Para desarrollo local, levanta los servicios en este orden:

```
1. MongoDB        (puerto 27017)
2. PostgreSQL     (puerto 5432)
3. auth-service   (puerto 8081)
4. catalog-service (puerto 8082)
5. api-gateway    (puerto 8080)  ← último siempre
```

---

*ShopFlow © 2026 — API Gateway*