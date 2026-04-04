# Práctica Final: Digitalización de Albaranes — BildyApp

## Descripción

Desarrolla el backend completo de **BildyApp**, una API REST con Node.js y Express que permita la gestión de albaranes (partes de horas o materiales) entre clientes y proveedores.

Esta práctica **construye sobre la práctica intermedia** (módulo de usuarios ya implementado) y añade la lógica de negocio principal: gestión de clientes, proyectos y albaranes, junto con documentación profesional, testing automatizado, notificaciones en tiempo real, subida de archivos a la nube y despliegue con contenedores.

Evalúa los conocimientos adquiridos en los **temas T8 a T13** del curso.

---

## Tecnologías requeridas

| Categoría | Tecnología | Tema |
|-----------|------------|------|
| Documentación | Swagger/OpenAPI 3.0 (`swagger-ui-express`, `swagger-jsdoc`) | T8 |
| Testing | Jest + Supertest + `mongodb-memory-server` | T8 |
| Monitorización | Slack Incoming Webhooks para errores 5XX | T8 |
| Tiempo real | Socket.IO (WebSockets) | T10 |
| Contenedores | Docker + Docker Compose | T11 |
| CI/CD | GitHub Actions | T11 |
| Subida de archivos | Multer + Cloudinary o Cloudflare R2 (o S3) | T13 |
| Generación de PDF | pdfkit (u otra librería similar) | T13 |

---

## Onboarding (realizado en la práctica intermedia)

Se asume que los siguientes endpoints del módulo de usuarios ya están implementados y funcionan correctamente:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/user/register` | Registro de usuario |
| PUT | `/api/user/validation` | Validación del email con código |
| POST | `/api/user/login` | Login (devuelve token JWT) |
| PUT | `/api/user/register` | Datos personales del usuario |
| PATCH | `/api/user/company` | Crear/actualizar compañía (modelo Company separado) |
| PATCH | `/api/user/logo` | Subida de logo de la compañía |
| GET | `/api/user` | Obtener usuario autenticado |
| DELETE | `/api/user` | Eliminar usuario (hard/soft) |

> **Nota:** Al crear la cuenta o al hacer login, se recibe un token JWT que deberá enviarse en la cabecera `Authorization: Bearer <token>` en todas las peticiones protegidas.

Si no se completó algún endpoint en la intermedia, se puede completar ahora, pero **no sumará puntos adicionales** en esta práctica.

---

## Modelos de datos

### Relación entre entidades

```
┌──────────┐         ┌──────────┐
│ Company  │◄──owner──│   User   │
│          │──1:N────►│          │
└──────────┘         └──────────┘
     │                     │
     ├──1:N──► Client      │
     ├──1:N──► Project     │
     └──1:N──► DeliveryNote◄──1:N──┘
                    │
              Project──1:N──► DeliveryNote
              Client──1:N──► Project
```

> Los modelos **Company** y **User** se definieron en la práctica intermedia. A continuación se definen los modelos nuevos que referencian a ambos.

### Client (Cliente)

```javascript
{
  user: ObjectId,          // ref: 'User' — usuario que lo creó
  company: ObjectId,       // ref: 'Company' — compañía a la que pertenece
  name: String,            // Nombre del cliente
  cif: String,             // CIF/NIF del cliente
  email: String,
  phone: String,
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  deleted: Boolean,        // Soft delete
  createdAt: Date,
  updatedAt: Date
}
```

### Project (Proyecto)

```javascript
{
  user: ObjectId,          // ref: 'User' — usuario que lo creó
  company: ObjectId,       // ref: 'Company' — compañía a la que pertenece
  client: ObjectId,        // ref: 'Client' — cliente asociado
  name: String,            // Nombre del proyecto
  projectCode: String,     // Código interno único
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  email: String,           // Email de contacto del proyecto
  notes: String,           // Notas adicionales
  active: Boolean,
  deleted: Boolean,        // Soft delete
  createdAt: Date,
  updatedAt: Date
}
```

### DeliveryNote (Albarán)

```javascript
{
  user: ObjectId,          // ref: 'User' — usuario que crea
  company: ObjectId,       // ref: 'Company' — compañía a la que pertenece
  client: ObjectId,        // ref: 'Client'
  project: ObjectId,       // ref: 'Project'
  format: 'material' | 'hours',  // Tipo de albarán
  description: String,
  workDate: Date,          // Fecha del trabajo
  // Para format: 'material'
  material: String,
  quantity: Number,
  unit: String,
  // Para format: 'hours'
  hours: Number,
  workers: [{              // Múltiples trabajadores (opcional)
    name: String,
    hours: Number
  }],
  // Firma
  signed: Boolean,
  signedAt: Date,
  signatureUrl: String,    // URL de la imagen de firma (Cloudinary/R2)
  pdfUrl: String,          // URL del PDF firmado en la nube
  deleted: Boolean,        // Soft delete
  createdAt: Date,
  updatedAt: Date
}
```

> **Nota:** Todos los modelos incluyen `company` como referencia. Esto permite que cualquier usuario de la misma compañía pueda acceder a los recursos compartidos (clientes, proyectos, albaranes), no solo el usuario que los creó.

---

## Endpoints a implementar

### Clientes (1 punto)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/client` | Crear un cliente |
| PUT | `/api/client/:id` | Actualizar un cliente |
| GET | `/api/client` | Listar todos los clientes |
| GET | `/api/client/:id` | Obtener un cliente concreto |
| DELETE | `/api/client/:id` | Archivar (soft) o borrar (hard) |
| GET | `/api/client/archived` | Listar clientes archivados |
| PATCH | `/api/client/:id/restore` | Restaurar un cliente archivado |

Especificaciones técnicas:
- **Crear**: asociar al usuario y a su `company` (obtenidos del token JWT). Validar con Zod (nombre, CIF, email, dirección). Asegurarse de que no exista ya un cliente con el mismo CIF dentro de esa compañía.
- **Listar** (`GET /api/client`): mostrar los clientes de la compañía del usuario. Implementar **paginación** y **filtros**:
  - Paginación: `?page=1&limit=10` (devolver también `totalPages`, `totalItems`, `currentPage`).
  - Filtros: `?name=García` (búsqueda parcial), `?sort=createdAt` (ordenación).
- **Obtener**: mostrar un cliente concreto de la compañía.
- **Eliminar**: usa el parámetro query `?soft=true` para elegir el tipo de borrado.
- **Archivar/Restaurar**: listar los clientes con borrado lógico y poder recuperarlos.

### Proyectos (1,5 puntos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/project` | Crear un proyecto |
| PUT | `/api/project/:id` | Actualizar un proyecto |
| GET | `/api/project` | Listar todos los proyectos |
| GET | `/api/project/:id` | Obtener un proyecto concreto |
| DELETE | `/api/project/:id` | Archivar (soft) o borrar (hard) |
| GET | `/api/project/archived` | Listar proyectos archivados |
| PATCH | `/api/project/:id/restore` | Restaurar un proyecto archivado |

Especificaciones técnicas:
- **Crear**: asociar al usuario, a su `company` y a un cliente existente de la misma compañía. Validar con Zod (nombre, código de proyecto, dirección, cliente, etc.). Asegurarse de que no exista ya un proyecto con el mismo código dentro de esa compañía.
- **Listar** (`GET /api/project`): mostrar los proyectos de la compañía del usuario. Implementar **paginación** y **filtros**:
  - Paginación: `?page=1&limit=10` (devolver también `totalPages`, `totalItems`, `currentPage`).
  - Filtros: `?client=<clientId>`, `?name=Reforma`, `?active=true`, `?sort=-createdAt`.
- **Eliminar**: usar parámetro query `?soft=true` para elegir el tipo de borrado.

### Albaranes (2 puntos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/deliverynote` | Crear un albarán |
| GET | `/api/deliverynote` | Listar albaranes |
| GET | `/api/deliverynote/:id` | Obtener un albarán concreto |
| GET | `/api/deliverynote/pdf/:id` | Descargar albarán en PDF |
| PATCH | `/api/deliverynote/:id/sign` | Firmar un albarán |
| DELETE | `/api/deliverynote/:id` | Borrar un albarán |

Especificaciones técnicas:

- **Crear** (`POST /api/deliverynote`):
  - El albarán pertenece a un proyecto concreto.
  - Puede ser de tipo `material` (materiales entregados) o `hours` (horas trabajadas).
  - Puede ser simple (una entrada) o contener múltiples trabajadores/horas y materiales.

- **Listar** (`GET /api/deliverynote`): implementar **paginación** y **filtros**:
  - Paginación: `?page=1&limit=10` (devolver también `totalPages`, `totalItems`, `currentPage`).
  - Filtros: `?project=<projectId>`, `?client=<clientId>`, `?format=hours`, `?signed=true`, `?from=2025-01-01&to=2025-12-31`, `?sort=-workDate`.

- **Obtener** (`GET /api/deliverynote/:id`):
  - Usa `populate` en Mongoose para traer los datos del usuario, del cliente y del proyecto junto con el albarán.

- **Descargar PDF** (`GET /api/deliverynote/pdf/:id`):
  - Genera el albarán en formato PDF usando **pdfkit** (u otra librería).
  - El PDF debe contener los datos del usuario, del cliente, del proyecto y del albarán (horas o materiales), y la firma si está firmado.
  - Solo se pueden descargar albaranes del propio usuario o de un `guest` de su compañía.
  - Si el albarán está firmado y el PDF ya se subió a la nube, descárgalo desde allí.

- **Firmar** (`PATCH /api/deliverynote/:id/sign`):
  - Recibe la imagen de la firma mediante `multipart/form-data` con **Multer** (T13).
  - Sube la imagen a **Cloudinary** o **Cloudflare R2** (u otra nube) y guarda la URL en base de datos.
  - Una vez firmado, genera el PDF y súbelo también a la nube.
  - Un albarán firmado no puede modificarse ni borrarse.

- **Borrar** (`DELETE /api/deliverynote/:id`):
  - Solo se puede borrar si el albarán **no está firmado**.

---

## Requisitos obligatorios por tema

### Documentación con Swagger (T8) — 1,5 puntos

- Documenta **todos** los endpoints de la API con anotaciones Swagger/OpenAPI 3.0.
- La UI interactiva de Swagger debe ser accesible en `/api-docs`.
- Define esquemas (`components/schemas`) para todas las entidades: User, Company, Client, Project, DeliveryNote.
- Incluye ejemplos de peticiones y respuestas.
- Documenta los códigos de error posibles en cada endpoint.

### Testing con Jest (T8) — 1,5 puntos

- Escribe tests de integración con **Jest + Supertest** para todos los endpoints.
- Usa **`mongodb-memory-server`** para ejecutar los tests con una base de datos en memoria.
- Alcanza una cobertura mínima del **70 %**.
- Configura los scripts en `package.json`:
  ```json
  {
    "test": "cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit --detectOpenHandles",
    "test:watch": "npm test -- --watch",
    "test:coverage": "npm test -- --coverage"
  }
  ```

### Notificaciones en tiempo real con WebSockets (T10) — 1 punto

- Implementa **Socket.IO** para emitir eventos en tiempo real:
  - `deliverynote:new` — cuando se crea un nuevo albarán.
  - `deliverynote:signed` — cuando se firma un albarán.
  - `client:new` — cuando se crea un nuevo cliente.
  - `project:new` — cuando se crea un nuevo proyecto.
- Los eventos solo deben emitirse a los usuarios de la **misma compañía** (usa rooms de Socket.IO con el `company._id` como nombre de room).
- La conexión WebSocket debe requerir **autenticación JWT**.

### Docker y despliegue (T11) — 1 punto

- Crea un **`Dockerfile`** con multi-stage build para la aplicación.
- Crea un **`docker-compose.yml`** que levante:
  - La aplicación Node.js.
  - Una instancia de MongoDB.
- Configura un pipeline básico de **GitHub Actions** que ejecute los tests automáticamente en cada push.
- Implementa un endpoint **`GET /health`** que devuelva:
  - Estado del servidor (`status: 'ok'`).
  - Estado de la conexión a MongoDB (`db: 'connected' | 'disconnected'`).
  - Uptime del proceso (`uptime: process.uptime()`).
  - Timestamp actual.
- Implementa **graceful shutdown**: al recibir señales `SIGTERM` o `SIGINT`, cierra ordenadamente las conexiones a MongoDB y Socket.IO antes de terminar el proceso.
- (Opcional) Despliega la aplicación en un servicio cloud (Railway, Render, Fly.io, Koyeb).

### Subida de archivos a la nube (T13) — incluido en Albaranes

- Usa **Multer** como middleware para la recepción de archivos (`multipart/form-data`).
- Usa uno de los siguientes servicios de almacenamiento en la nube:
  - **Cloudinary**: ideal si quieres transformaciones de imagen automáticas (redimensionar, recortar, formato) integradas en la URL.
  - **Cloudflare R2**: ideal si prefieres almacenamiento S3-compatible sin costos de egreso. Usa el mismo SDK de AWS (`@aws-sdk/client-s3`). Combínalo con **Sharp** para las transformaciones antes de subir.
  - **AWS S3**: alternativa empresarial estándar.
- Controla el tipo y tamaño de los archivos subidos (imágenes de firma, PDFs).
- Usa **Sharp** para optimizar las imágenes antes de subirlas (redimensionar, comprimir, convertir formato). Por ejemplo: redimensionar firmas a un máximo de 800px de ancho y convertir a WebP. Esto es especialmente importante si usas R2 o S3, ya que no tienen transformaciones nativas.
- Genera PDFs de albaranes con **pdfkit** (u otra librería similar).

### Envío de emails (0,5 puntos)

- Envía el código de verificación por email al registrarse.
- Puedes usar **Nodemailer** con un servicio como Gmail, SendGrid o Mailtrap.

### Logging a Slack (0,5 puntos)

- La aplicación enviará a un canal de Slack todos los errores **5XX** HTTP mediante un Incoming Webhook.
- Incluye en el mensaje: timestamp, ruta, método HTTP, mensaje de error y stack trace.
- (Aunque no debería haber errores 5XX si has hecho una buena gestión de errores.)

---

## Requisitos técnicos generales

1. Crea todos los **modelos de Mongoose** necesarios con sus esquemas y validaciones. Recuerda que Company es un modelo separado con `owner` (ref a User) y que Client, Project y DeliveryNote referencian tanto a `user` como a `company`.
2. Crea todas las **rutas** solicitadas.
3. Crea todos los **validadores con Zod** necesarios.
4. Crea todos los **controladores** siguiendo el patrón MVC.
5. Excepto registro, login y recuperar contraseña, todos los endpoints requieren **token JWT**.
6. Implementa un manejo de errores de cliente **4XX** con la clase `AppError`.
7. Incluye **Helmet**, **rate limiting** y **sanitización** de inputs.
8. Realiza **commits progresivos** (no subir todo el código de golpe).
9. Incluye un fichero **`.env.example`** con las variables de entorno utilizadas.
10. Incluye ficheros **`.http`** de ejemplo para los distintos endpoints.

---

## Estructura esperada del proyecto

```
bildyapp-api/
├── src/
│   ├── config/
│   │   ├── index.js            # Configuración centralizada
│   │   ├── database.js         # Conexión a MongoDB
│   │   └── swagger.js          # Configuración Swagger/OpenAPI
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── client.controller.js
│   │   ├── project.controller.js
│   │   └── deliverynote.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # Verificación JWT
│   │   ├── error-handler.js    # Middleware centralizado de errores
│   │   ├── rate-limit.js       # Rate limiting
│   │   ├── sanitize.js         # Sanitización NoSQL
│   │   ├── upload.js           # Configuración de Multer
│   │   └── validate.js         # Middleware de validación Zod
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Client.js
│   │   ├── Project.js
│   │   └── DeliveryNote.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── user.routes.js
│   │   ├── client.routes.js
│   │   ├── project.routes.js
│   │   └── deliverynote.routes.js
│   ├── services/
│   │   ├── logger.service.js   # Logger con Slack
│   │   ├── mail.service.js     # Envío de emails
│   │   ├── pdf.service.js      # Generación de PDFs
│   │   └── storage.service.js  # Subida a Cloudinary/R2/S3
│   ├── utils/
│   │   └── AppError.js
│   ├── validators/
│   │   ├── user.validator.js
│   │   ├── client.validator.js
│   │   ├── project.validator.js
│   │   └── deliverynote.validator.js
│   ├── app.js                  # Configuración de Express + Socket.IO
│   └── index.js                # Punto de entrada
├── tests/
│   ├── setup.js                # Configuración de mongodb-memory-server
│   ├── auth.test.js
│   ├── client.test.js
│   ├── project.test.js
│   └── deliverynote.test.js
├── Dockerfile
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── test.yml            # GitHub Actions
├── .env
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

---

## Entrega

- **Repositorio de GitHub** con el código fuente.
- Incluir **`.env.example`** con las variables de entorno utilizadas (sin valores reales).
- Incluir ficheros **`.http`** o colección de Postman con ejemplos de cada endpoint.
- Incluir un **`README.md`** con:
  - Instrucciones de instalación y ejecución.
  - Instrucciones para ejecutar con Docker (`docker compose up`).
  - Enlace a la documentación Swagger (si está desplegado).
  - Instrucciones para ejecutar los tests (`npm test`).
- Realizar **commits progresivos** a lo largo del desarrollo.

---

## Rúbrica (10 puntos + bonus)

### Puntuación base (10 puntos)

| Funcionalidad | Tema | Puntuación |
|---------------|------|------------|
| Clientes (CRUD + paginación/filtros + archivo/restaurar) | T5, T6 | 1 punto |
| Proyectos (CRUD + paginación/filtros + archivo/restaurar) | T5, T6 | 1,5 puntos |
| Albaranes (CRUD + paginación/filtros + PDF + firma + Sharp) | T5, T13 | 2 puntos |
| Documentación Swagger (todos los endpoints) | T8 | 1,5 puntos |
| Testing con Jest (cobertura >= 70 %) | T8 | 1,5 puntos |
| WebSockets en tiempo real (Socket.IO) | T10 | 1 punto |
| Docker + GitHub Actions + health check + graceful shutdown | T11 | 1 punto |
| Envío de emails | — | 0,5 puntos |
| Logging a Slack | T8 | 0,5 puntos |

### Bonus (puntos extra)

| Funcionalidad | Tema | Puntuación extra |
|---------------|------|-----------------|
| Migración a TypeScript (total o parcial) | T12 | +1 punto |
| Versión con PostgreSQL + Prisma (alternativa o complementaria a MongoDB) | T9 | +1 punto |
| Dashboard con aggregation pipeline | T5 | +0,5 puntos |

**Detalles del bonus:**

- **TypeScript (T12)**: migra total o parcialmente la aplicación a TypeScript. Configura `tsconfig.json` con modo estricto. Usa tipos para modelos, controladores y middleware.
- **PostgreSQL + Prisma (T9)**: implementa una versión alternativa (o complementaria) usando PostgreSQL con Prisma como ORM. Puedes usar Supabase como proveedor. Define el esquema Prisma con las relaciones entre entidades y gestiona las migraciones con `prisma migrate`.
- **Dashboard con aggregation** (`GET /api/dashboard`): usa la **aggregation pipeline** de Mongoose para obtener estadísticas: total de albaranes por mes, horas totales por proyecto, materiales por cliente, etc.

---

> Se evaluará también el cumplimiento de los **requisitos técnicos generales** (MVC, Zod, AppError, seguridad, JWT, commits progresivos). Su incumplimiento podrá suponer una **penalización** sobre la nota.

---

## Recursos

- [Teoría T8: Documentación, Testing y Monitorización](../teoria/T8.md)
- [Teoría T9: PostgreSQL con Prisma](../teoria/T9.md)
- [Teoría T10: WebSockets y Socket.IO](../teoria/T10.md)
- [Teoría T11: Docker, CI/CD y Despliegue](../teoria/T11.md)
- [Teoría T12: TypeScript](../teoria/T12.md)
- [Teoría T13: Subida de Archivos y Storage](../teoria/T13.md)
- [Ejemplos de código](../codigo/)
- [Swagger/OpenAPI 3.0](https://swagger.io/specification/)
- [Jest](https://jestjs.io/docs/getting-started)
- [Socket.IO](https://socket.io/docs/v4/)
- [Docker](https://docs.docker.com/)
- [pdfkit](https://pdfkit.org/)
- [Cloudinary](https://cloudinary.com/documentation)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
