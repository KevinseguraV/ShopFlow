# 🔐 Auth Service — ShopFlow

> Microservicio de autenticación y autorización para la plataforma **ShopFlow**. Gestiona registro, login, tokens JWT y sesiones de usuario.

---

## 🧱 Stack Tecnológico

| Tecnología | Rol |
|---|---|
| Java 21 | Lenguaje principal |
| Spring Boot 3.4.5 | Framework base |
| Spring Security | Seguridad y autenticación |
| Spring Data JPA | Persistencia |
| PostgreSQL | Base de datos relacional |
| JWT (HMAC-256) | Tokens de acceso y refresco |
| Lombok | Reducción de boilerplate |
| Spring Actuator | Monitoreo del servicio |

---

## ⚙️ Configuración

### `application.properties`

```properties
# Server
server.port=8081

# Application
spring.application.name=auth-service

# PostgreSQL
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/shopflow_auth}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=${JWT_SECRET:ShopFlowSuperSecretKeyQueDebeTenerMinimo256BitsParaHMAC2024}
jwt.access-token-expiration=${JWT_ACCESS_EXPIRATION:900000}
jwt.refresh-token-expiration=${JWT_REFRESH_EXPIRATION:604800000}

# Actuator
management.endpoints.web.exposure.include=health,info

# Logging
logging.level.com.shopflow.auth_service=DEBUG
logging.level.org.springframework.security=WARN
```

### Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/shopflow_auth` | URL de conexión a PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Usuario de la base de datos |
| `SPRING_DATASOURCE_PASSWORD` | _(vacío)_ | Contraseña de la base de datos |
| `JWT_SECRET` | `ShopFlowSuperSecret...` | Clave secreta HMAC-256 (mínimo 256 bits) |
| `JWT_ACCESS_EXPIRATION` | `900000` | Expiración access token en ms (15 min) |
| `JWT_REFRESH_EXPIRATION` | `604800000` | Expiración refresh token en ms (7 días) |

> ⚠️ **Nunca subas `JWT_SECRET` ni credenciales de base de datos a GitHub.** Usa un archivo `.env` o variables del sistema en producción.

---

## 🚀 Cómo ejecutar

### Prerrequisitos

- Java 21+
- Maven 3.8+
- PostgreSQL corriendo en `localhost:5432`
- Base de datos `shopflow_auth` creada

### Crear la base de datos

```sql
CREATE DATABASE shopflow_auth;
```

### Levantar el servicio

```bash
# Compilar y ejecutar
mvn spring-boot:run

# Con variables de entorno personalizadas
SPRING_DATASOURCE_PASSWORD=mipassword JWT_SECRET=miclaveultrasecreta mvn spring-boot:run
```

El servicio arranca en: `http://localhost:8081`

> Hibernate crea las tablas automáticamente con `ddl-auto=update`.

---

## 🗄️ Base de Datos

- **Motor:** PostgreSQL
- **Base de datos:** `shopflow_auth`
- **Tablas generadas por Hibernate:**
    - `users` — Usuarios registrados
    - `refresh_tokens` — Tokens de refresco activos

---

## 🔑 Sistema de Tokens JWT

El servicio maneja dos tipos de tokens:

| Token | Expiración | Uso |
|---|---|---|
| **Access Token** | 15 minutos (900,000 ms) | Autorizar requests a microservicios |
| **Refresh Token** | 7 días (604,800,000 ms) | Obtener nuevo access token sin re-login |

**Flujo típico:**
```
1. POST /api/auth/register  →  Registro + tokens
2. POST /api/auth/login     →  Login + tokens
3. [Access token expira]
4. POST /api/auth/refresh   →  Nuevo access token con refresh token
5. POST /api/auth/logout    →  Invalida refresh token
```

---

## 📡 API Reference

**Base URL:** `http://localhost:8081/api/auth`

---

### `POST /register`
Registra un nuevo usuario y devuelve tokens JWT.

**Body:**
```json
{
  "name": "Kevin García",
  "email": "kevin@shopflow.com",
  "password": "Password123!"
}
```

**Respuesta `201 Created`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "userId": "1",
  "email": "kevin@shopflow.com",
  "role": "USER"
}
```

| Código | Descripción |
|---|---|
| `201` | Usuario registrado exitosamente |
| `400` | Validación fallida |
| `409` | Email ya registrado |

---

### `POST /login`
Autentica un usuario y devuelve tokens JWT.

**Body:**
```json
{
  "email": "kevin@shopflow.com",
  "password": "Password123!"
}
```

**Respuesta `200 OK`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "userId": "1",
  "email": "kevin@shopflow.com",
  "role": "USER"
}
```

| Código | Descripción |
|---|---|
| `200` | Login exitoso |
| `400` | Validación fallida |
| `401` | Credenciales incorrectas |

---

### `POST /refresh`
Obtiene un nuevo access token usando el refresh token.

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Respuesta `200 OK`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer"
}
```

| Código | Descripción |
|---|---|
| `200` | Token renovado |
| `401` | Refresh token inválido o expirado |

---

### `POST /logout`
Invalida el refresh token del usuario autenticado.

**Headers requeridos:**
```
Authorization: Bearer <accessToken>
```

**Respuesta `204 No Content`**

| Código | Descripción |
|---|---|
| `204` | Sesión cerrada |
| `401` | Token inválido o expirado |

---

### `GET /me`
Devuelve la información del usuario autenticado.

**Headers requeridos:**
```
Authorization: Bearer <accessToken>
```

**Respuesta `200 OK`:**
```json
{
  "userId": "1",
  "name": "Kevin García",
  "email": "kevin@shopflow.com",
  "role": "USER"
}
```

| Código | Descripción |
|---|---|
| `200` | Info del usuario |
| `401` | Token inválido o expirado |

---

## 🩺 Health & Monitoreo

```
GET http://localhost:8081/actuator/health
GET http://localhost:8081/actuator/info
```

**Respuesta de health:**
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" }
  }
}
```

---

## 📁 Estructura del Proyecto

```
auth-service/
├── src/
│   └── main/
│       ├── java/com/shopflow/auth_service/
│       │   ├── controller/
│       │   │   └── AuthController.java
│       │   ├── dto/
│       │   │   ├── RegisterRequest.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── RefreshRequest.java
│       │   │   ├── AuthResponse.java
│       │   │   └── UserInfoResponse.java
│       │   ├── entity/
│       │   │   ├── User.java
│       │   │   └── RefreshToken.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   └── RefreshTokenRepository.java
│       │   ├── security/
│       │   │   ├── JwtUtil.java
│       │   │   └── SecurityConfig.java
│       │   ├── service/
│       │   │   └── AuthService.java
│       │   └── AuthServiceApplication.java
│       └── resources/
│           └── application.properties
└── pom.xml
```

---

## 🔗 Otros Microservicios — ShopFlow

| Servicio | Puerto | Descripción |
|---|---|---|
| `api-gateway` | `8080` | Punto de entrada único |
| `auth-service` | `8081` | Autenticación y JWT ✅ |
| `catalog-service` | `8082` | Catálogo de productos |
| `cart-service` | `8083` | Carrito de compras |
| `order-service` | `8084` | Gestión de pedidos |
| `payment-service` | `8085` | Pagos |
| `inventory-service` | `8086` | Inventario |

---

*ShopFlow © 2026 — Microservicio de Autenticación*