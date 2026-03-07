# T7 - Autenticación JWT y Autorización por Roles

API REST con Express 5, autenticación JWT y autorización basada en roles.

## Requisitos

- Node.js 22+
- MongoDB Atlas

## Instalación

```bash
npm install
cp .env.example .env
# Editar .env con tus credenciales
```

## Uso

```bash
npm run dev    # Desarrollo
npm start      # Producción
```

## Características

- ✅ Registro y login de usuarios
- ✅ Hash de contraseñas con bcrypt
- ✅ Tokens JWT
- ✅ Middleware de autenticación
- ✅ Autorización por roles (user/admin)
- ✅ Protección de rutas

## Endpoints

### Auth (públicas)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Auth (protegidas)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/auth/me` | Obtener usuario actual |
| PUT | `/api/auth/me` | Actualizar perfil |
| PUT | `/api/auth/password` | Cambiar contraseña |

### Tracks

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/tracks` | Público | Listar tracks |
| GET | `/api/tracks/:id` | Público | Obtener track |
| POST | `/api/tracks` | user, admin | Crear track |
| PUT | `/api/tracks/:id` | user, admin | Actualizar track |
| DELETE | `/api/tracks/:id` | admin | Eliminar track |

### Users (solo admin)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios |
| PUT | `/api/users/:id/role` | Cambiar rol |

## Testing

Usar `api.http` con REST Client de VS Code.

## Verificar Token

Copia el token de login y pégalo en [jwt.io](https://jwt.io) junto con tu `JWT_SECRET` para ver el contenido.
