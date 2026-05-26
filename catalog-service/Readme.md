#  Catalog Service — ShopFlow

> Microservicio de catálogo de productos para la plataforma **ShopFlow**. Gestiona productos y categorías con soporte de búsqueda, paginación y validación de roles.

---

##  Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Java | 21 | Lenguaje principal |
| Spring Boot | 3.4.5 | Framework base |
| Spring Data MongoDB | 4.4.5 | Persistencia |
| MongoDB | 7.x | Base de datos |
| Hibernate Validator | 8.0.2 | Validación de DTOs |
| Lombok | 1.18.38 | Reducción de boilerplate |
| Micrometer | 1.14.6 | Métricas y observabilidad |
| Spring Actuator | 3.4.5 | Monitoreo del servicio |

---

##  Configuración

### `application.properties`

```properties
# Server
server.port=8082

# Application
spring.application.name=catalog-service

# MongoDB
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/shopflow_catalog}
spring.data.mongodb.database=${MONGODB_DATABASE:shopflow_catalog}

# Actuator
management.endpoints.web.exposure.include=health,info

# Logging
logging.level.com.shopflow.catalog_service=DEBUG
```

### Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/shopflow_catalog` | URI de conexión a MongoDB |
| `MONGODB_DATABASE` | `shopflow_catalog` | Nombre de la base de datos |

---

##  Cómo ejecutar

### Prerrequisitos

- Java 21+
- Maven 3.8+
- MongoDB corriendo en `localhost:27017`

### Levantar el servicio

```bash
# Clonar el repositorio
git clone https://github.com/shopflow/catalog-service.git
cd catalog-service

# Compilar y ejecutar
mvn spring-boot:run

# O con variables de entorno personalizadas
MONGODB_URI=mongodb://localhost:27017/shopflow_catalog mvn spring-boot:run
```

El servicio arranca en: `http://localhost:8082`

---

## ️ Base de Datos

- **Motor:** MongoDB
- **Base de datos:** `shopflow_catalog`
- **Colecciones:**
    - `products` — Documentos de productos
    - `categories` — Documentos de categorías

> MongoDB crea la base de datos automáticamente al primer insert.

---

##  Autenticación de Roles

Este servicio valida el rol del usuario mediante un header HTTP:

```
X-User-Role: ADMIN
```

Los endpoints de escritura (`POST`, `PUT`, `DELETE`) requieren este header con el valor `ADMIN`. Sin él, el servicio responde `403 Forbidden`.

> En producción este header es inyectado por el API Gateway tras validar el JWT.

---

##  API Reference

**Base URL:** `http://localhost:8082/api/catalog`

---

### 🏷 Categorías

#### `GET /categories`
Obtiene todas las categorías disponibles.

**Respuesta `200 OK`:**
```json
[
  {
    "id": "6a162750aa10460c52db60bf",
    "name": "Electrónica",
    "description": "Productos electrónicos",
    "slug": "electronica"
  }
]
```

---

#### `POST /categories`
Crea una nueva categoría.

**Headers requeridos:**
```
X-User-Role: ADMIN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Electrónica",
  "description": "Productos electrónicos"
}
```

**Respuesta `201 Created`:**
```json
{
  "id": "6a162750aa10460c52db60bf",
  "name": "Electrónica",
  "description": "Productos electrónicos",
  "slug": "electronica"
}
```

| Código | Descripción |
|---|---|
| `201` | Categoría creada |
| `400` | Validación fallida |
| `403` | Sin permisos de ADMIN |
| `409` | Categoría ya existe |

---

###  Productos

#### `GET /products`
Lista todos los productos con paginación.

**Query params:**

| Param | Default | Descripción |
|---|---|---|
| `page` | `0` | Número de página |
| `size` | `10` | Elementos por página |
| `sort` | `createdAt` | Campo de ordenamiento |

**Ejemplo:**
```
GET /api/catalog/products?page=0&size=10&sort=createdAt
```

---

#### `GET /products/{id}`
Obtiene un producto por su ID.

**Ejemplo:**
```
GET /api/catalog/products/6a1628b2aa10460c52db60c0
```

---

#### `GET /products/slug/{slug}`
Obtiene un producto por su slug.

**Ejemplo:**
```
GET /api/catalog/products/slug/laptop-dell-xps
```

---

#### `GET /products/search`
Búsqueda de productos por texto.

**Query params:**

| Param | Requerido | Descripción |
|---|-----------|---|
| `query` | SI        | Texto a buscar |
| `page` | No        | Número de página (default: 0) |
| `size` | No        | Elementos por página (default: 10) |

**Ejemplo:**
```
GET /api/catalog/products/search?query=laptop&page=0&size=10
```

---

#### `GET /products/category/{categoryId}`
Lista productos de una categoría específica.

**Ejemplo:**
```
GET /api/catalog/products/category/6a162750aa10460c52db60bf?page=0&size=10
```

---

#### `POST /products`
Crea un nuevo producto.

**Headers requeridos:**
```
X-User-Role: ADMIN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Laptop Dell XPS",
  "description": "Laptop de alto rendimiento",
  "basePrice": 1200.00,
  "categoryId": "6a162750aa10460c52db60bf",
  "stock": 10,
  "slug": "laptop-dell-xps"
}
```

**Respuesta `201 Created`:**
```json
{
  "id": "6a1628b2aa10460c52db60c0",
  "slug": "laptop-dell-xps",
  "name": "Laptop Dell XPS",
  "description": "Laptop de alto rendimiento",
  "basePrice": 1200.0,
  "categoryId": "6a162750aa10460c52db60bf",
  "categoryName": "Electrónica",
  "images": [],
  "variants": [],
  "rating": 0.0,
  "reviewCount": 0,
  "active": true,
  "createdAt": "2026-05-26T23:11:46.898Z"
}
```

---

#### `PUT /products/{id}`
Actualiza un producto existente.

**Headers requeridos:**
```
X-User-Role: ADMIN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Laptop Dell XPS 15",
  "description": "Laptop de alto rendimiento edición 2026",
  "basePrice": 1350.00,
  "categoryId": "6a162750aa10460c52db60bf",
  "stock": 15,
  "slug": "laptop-dell-xps-15"
}
```

| Código | Descripción |
|---|---|
| `200` | Producto actualizado |
| `400` | Validación fallida |
| `403` | Sin permisos de ADMIN |
| `404` | Producto no encontrado |

---

#### `DELETE /products/{id}`
Elimina un producto.

**Headers requeridos:**
```
X-User-Role: ADMIN
```

**Ejemplo:**
```
DELETE /api/catalog/products/6a1628b2aa10460c52db60c0
```

| Código | Descripción |
|---|---|
| `204` | Producto eliminado |
| `403` | Sin permisos de ADMIN |
| `404` | Producto no encontrado |

---

##  Health & Monitoreo

Spring Actuator expone los siguientes endpoints:

```
GET http://localhost:8082/actuator/health
GET http://localhost:8082/actuator/info
```

**Respuesta de health:**
```json
{
  "status": "UP"
}
```

---

##  Estructura del Proyecto

```
catalog-service/
├── src/
│   └── main/
│       ├── java/com/shopflow/catalog_service/
│       │   ├── controller/
│       │   │   └── ProductController.java
│       │   ├── document/
│       │   │   ├── Product.java
│       │   │   └── Category.java
│       │   ├── dto/
│       │   │   ├── CreateProductRequest.java
│       │   │   ├── UpdateProductRequest.java
│       │   │   ├── ProductResponse.java
│       │   │   └── CategoryRequest.java
│       │   ├── repository/
│       │   │   ├── ProductRepository.java
│       │   │   └── CategoryRepository.java
│       │   ├── service/
│       │   │   └── ProductService.java
│       │   └── CatalogServiceApplication.java
│       └── resources/
│           └── application.properties
└── pom.xml
```

---

##  Otros Microservicios — ShopFlow

| Servicio | Puerto | Descripción |
|---|---|---|
| `auth-service` | `8081` | Autenticación y JWT |
| `catalog-service` | `8082` | Catálogo de productos ✅ |
| `order-service` | `8083` | Gestión de pedidos |
| `user-service` | `8084` | Perfil de usuarios |

---

*ShopFlow © 2026 — Microservicio de Catálogo*