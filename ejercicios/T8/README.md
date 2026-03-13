# 🎙️ Ejercicio T8: PodcastHub API

## La Plataforma de Podcasts que lo Peta

Crea una API completa con autenticación JWT, autorización por roles, documentación Swagger y tests automatizados.

**Nivel:** ⭐⭐⭐⭐ Experto | **Tiempo:** 50-60 min | **Temas:** T7 + T8

---

## 📖 Historia

Una startup de podcasts te ficha como backend developer. Tienen 3 meses de runway, el CTO está en modo pánico y necesitan una API en producción ya. El sistema debe tener autenticación segura (ya quemaron datos de usuarios en producción una vez), documentación para el equipo de frontend, y tests porque el CEO leyó en Twitter que los tests son importantes.

Tu misión: entregar `PodcastHub API v1.0` antes del lunes o el proyecto muere.

---

## 📋 Requisitos

### Estructura del proyecto

```
src/
├── app.js
├── index.js
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   └── podcasts.controller.js
├── docs/
│   └── swagger.js
├── middleware/
│   ├── session.middleware.js   # Verifica JWT
│   └── rol.middleware.js       # Verifica rol
├── models/
│   ├── user.model.js
│   └── podcast.model.js
├── routes/
│   ├── index.js
│   ├── auth.routes.js
│   └── podcasts.routes.js
└── validators/
    ├── auth.validator.js
    └── podcast.validator.js
tests/
├── auth.test.js
└── podcasts.test.js
```

---

### Modelo User

```javascript
{
  name: String,            // Requerido, mín 2 chars
  email: String,           // Requerido, único, formato email
  password: String,        // Requerido, mín 8 chars (guardar hasheado)
  role: String,            // Enum: ['user', 'admin'], default: 'user'
  createdAt: Date          // timestamps: true
}
```

### Modelo Podcast

```javascript
{
  title: String,           // Requerido, mín 3 chars
  description: String,     // Requerido, mín 10 chars
  author: ObjectId,        // Ref a User, requerido
  category: String,        // Enum: ['tech', 'science', 'history', 'comedy', 'news']
  duration: Number,        // Duración en segundos, mín 60
  episodes: Number,        // Número de episodios, default: 1
  published: Boolean,      // Si está publicado, default: false
  createdAt: Date          // timestamps: true
}
```

---

### Endpoints

#### Auth

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | /api/auth/register | Público | Registro de usuario |
| POST | /api/auth/login | Público | Login, devuelve token |
| GET | /api/auth/me | Autenticado | Perfil del usuario actual |

#### Podcasts

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | /api/podcasts | Público | Listar podcasts publicados |
| GET | /api/podcasts/:id | Público | Obtener un podcast |
| POST | /api/podcasts | Autenticado | Crear podcast |
| PUT | /api/podcasts/:id | Autenticado (autor) | Actualizar propio podcast |
| DELETE | /api/podcasts/:id | Admin | Eliminar cualquier podcast |
| GET | /api/podcasts/admin/all | Admin | Listar todos (incluye no publicados) |
| PATCH | /api/podcasts/:id/publish | Admin | Publicar/despublicar |

---

### Autenticación JWT

Implementar el flujo completo de T7:

1. **Registro**: Hashear contraseña con `bcryptjs` (10 rounds) antes de guardar
2. **Login**: Verificar credenciales y generar JWT

El token JWT **debe incluir únicamente en el payload**:
```javascript
{ userId: user._id }
```

> El token NO debe incluir datos como `role` o `email`. Esos datos se obtienen siempre consultando la base de datos a partir del `userId`.

3. **Middleware de sesión** (`session.middleware.js`):
   - Leer el token del header `Authorization: Bearer <token>`
   - Verificar con `jwt.verify()`
   - Buscar el usuario en BD con `User.findById(decoded.userId)`
   - Asignar a `req.user` el documento completo del usuario
   - Devolver 401 si no hay token, es inválido o el usuario no existe

4. **Middleware de rol** (`rol.middleware.js`):
   - Función factory que acepta un rol como parámetro
   - Verifica que `req.user.role === rolRequerido`
   - Devuelve 403 si no tiene permiso

---

### Documentación Swagger

Documentar **todos los endpoints** con `swagger-jsdoc` y `swagger-ui-express`.

**Configuración base** en `src/docs/swagger.js`:

```javascript
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'PodcastHub API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerToken: {               // <-- Nombre del esquema
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};
```

En cada ruta protegida añadir en el JSDoc:
```yaml
security:
  - bearerAuth: []
```

**Schemas requeridos** en Swagger:
- `User` (sin campo `password` en respuestas)
- `Podcast`
- `AuthResponse` (token + user)
- `Error` (message)

Swagger debe estar disponible en `GET /api-docs`.

---

### Tests con Jest + Supertest

Crear tests en `tests/auth.test.js` y `tests/podcasts.test.js`.

**Configuración** `jest.config.js`:
```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
};
```

#### `tests/auth.test.js` — Tests requeridos:

```
✓ POST /api/auth/register → 201 con usuario creado
✓ POST /api/auth/register → 400 si email duplicado
✓ POST /api/auth/register → 400 si faltan campos
✓ POST /api/auth/login → 201 con token cuando credenciales válidas
✓ POST /api/auth/login → 401 si contraseña incorrecta
✓ GET  /api/auth/me → 200 con datos del usuario (requiere token)
✓ GET  /api/auth/me → 401 sin token
```

#### `tests/podcasts.test.js` — Tests requeridos:

```
✓ GET  /api/podcasts → 200 con array (solo publicados)
✓ POST /api/podcasts → 201 con podcast creado (requiere token)
✓ POST /api/podcasts → 401 sin token
✓ DELETE /api/podcasts/:id → 200 solo para admin
✓ DELETE /api/podcasts/:id → 403 para user normal
✓ GET  /api/podcasts/admin/all → 200 solo para admin
```

> **Importante**: Los tests deben conectarse a una base de datos de test separada. Añade en `.env`:
> ```
> MONGODB_TEST_URI=mongodb+srv://...tu-db-de-test...
> ```
> Y en los tests usa siempre `process.env.MONGODB_TEST_URI` para la conexión. Para simplificar, reutiliza la misma URI de desarrollo pero apunta a una base de datos con sufijo `_test`.

---

### Variables de entorno

```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster/podcasthub
MONGODB_TEST_URI=mongodb+srv://user:pass@cluster/podcasthub_test
JWT_SECRET=supersecretkey_min32chars_requerido
JWT_EXPIRES_IN=2h
```

---

## 🎯 Criterios de éxito

- [ ] Registro y login funcionan, se devuelve token JWT
- [ ] Rutas protegidas requieren `Authorization: Bearer <token>`
- [ ] Solo admins pueden borrar podcasts y ver no publicados
- [ ] Swagger accesible en `/api-docs` con todos los endpoints documentados
- [ ] Botón "Authorize" de Swagger permite probar rutas protegidas
- [ ] `npm test` pasa todos los tests sin errores
- [ ] Tests de auth y podcasts cubren casos de éxito y error

## 🎁 BONUS

1. Implementar `PATCH /api/auth/change-password` (requiere contraseña actual)
2. Añadir paginación a `GET /api/podcasts` (`?page=1&limit=10`)
3. Test de cobertura `npm run test:coverage` > 80%
4. Webhook a Slack cuando se registra un nuevo admin

---

## 🚀 Ejecutar

```bash
cd ejercicios/T8
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev

# Tests
npm test
```
