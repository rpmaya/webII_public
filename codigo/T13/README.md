# T13 - File Upload

Ejemplos de subida de archivos con Multer, Cloudinary y Sharp.

## Estructura

```
codigo/T13/
├── src/
│   ├── config/
│   │   ├── multer.js          # Configuración de Multer
│   │   └── cloudinary.js      # Configuración de Cloudinary
│   ├── controllers/
│   │   └── upload.controller.js
│   ├── routes/
│   │   └── upload.routes.js
│   ├── middleware/
│   │   └── upload.js          # Middleware de validación
│   └── app.js
├── uploads/                    # Almacenamiento local temporal
└── package.json
```

## Instalación

```bash
npm install
npm run dev
```

## Variables de entorno

```env
CLOUDINARY_CLOUD_NAME=tu-cloud
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

## Conceptos demostrados

- Multer para subida local
- Cloudinary para almacenamiento en la nube
- Sharp para procesamiento de imágenes
- Validación de tipos y tamaños
- Múltiples archivos
