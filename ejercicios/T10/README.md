# Ejercicio T10: Chat en Tiempo Real con Socket.IO

## Descripción

Construye una aplicación de chat en tiempo real usando **Socket.IO** integrado con **Express** y **MongoDB**.

## Funcionalidades

### Autenticación
- Registro e inicio de sesión
- JWT para autenticación en WebSocket
- Protección de rutas y eventos

### Salas de Chat
- Crear nuevas salas
- Listar salas disponibles
- Unirse/salir de salas
- Ver usuarios en cada sala

### Mensajería
- Envío de mensajes en tiempo real
- Historial de mensajes al entrar
- Indicador "escribiendo..."
- Timestamps en mensajes

### Presencia
- Ver usuarios online
- Notificación de entrada/salida de usuarios

## Estructura

```
T10/
├── src/
│   ├── app.js                    # Express + HTTP + Socket.IO
│   ├── config/
│   │   └── db.js                 # Conexión MongoDB
│   ├── models/
│   │   ├── user.model.js
│   │   ├── room.model.js
│   │   └── message.model.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── rooms.routes.js
│   ├── socket/
│   │   ├── index.js              # Configuración Socket.IO
│   │   └── handlers/
│   │       ├── chat.handler.js
│   │       └── room.handler.js
│   └── utils/
│       ├── password.js
│       └── jwt.js
├── public/
│   ├── index.html                # Landing/Login
│   └── chat.html                 # Interfaz del chat
├── .env.example
├── package.json
└── README.md
```

## Instalación

```bash
cd ejercicios/T10
npm install
cp .env.example .env
# Editar .env con tu MONGODB_URI
npm run dev
```

## Configuración (.env)

```env
MONGODB_URI=mongodb://localhost:27017/chat-realtime
JWT_SECRET=tu_secreto_jwt_muy_largo_y_seguro
PORT=3000
```

## Endpoints REST

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/auth/me | Perfil del usuario |

### Rooms
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/rooms | Listar salas |
| POST | /api/rooms | Crear sala |
| GET | /api/rooms/:id/messages | Historial de mensajes |

## Eventos Socket.IO

### Cliente → Servidor
| Evento | Payload | Descripción |
|--------|---------|-------------|
| `room:join` | `{ roomId }` | Unirse a sala |
| `room:leave` | `{ roomId }` | Salir de sala |
| `chat:message` | `{ roomId, content }` | Enviar mensaje |
| `chat:typing` | `{ roomId }` | Indicar escribiendo |

### Servidor → Cliente
| Evento | Payload | Descripción |
|--------|---------|-------------|
| `room:joined` | `{ room, users }` | Confirmación de unión |
| `room:user-joined` | `{ user }` | Nuevo usuario en sala |
| `room:user-left` | `{ user }` | Usuario salió de sala |
| `chat:message` | `{ user, content, timestamp }` | Nuevo mensaje |
| `chat:typing` | `{ user }` | Usuario escribiendo |
| `user:online` | `{ userId }` | Usuario conectado |
| `user:offline` | `{ userId }` | Usuario desconectado |

## Criterios de éxito

- [ ] Registro y login funcionando
- [ ] WebSocket autenticado con JWT
- [ ] Crear y listar salas
- [ ] Unirse y salir de salas
- [ ] Enviar y recibir mensajes en tiempo real
- [ ] Ver usuarios en sala
- [ ] Indicador de "escribiendo"
- [ ] Historial de mensajes al entrar

## Bonus

- [ ] Mensajes privados (1 a 1)
- [ ] Emojis/Reactions
- [ ] Envío de imágenes
- [ ] Notificaciones de escritorio
- [ ] Búsqueda de mensajes
- [ ] Mensajes editables/eliminables

## Recursos

- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Teoría T10](../../teoria/T10.md)
