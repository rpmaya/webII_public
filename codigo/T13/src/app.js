// src/app.js
// Servidor Express para subida de archivos

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

import uploadRoutes from './routes/upload.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(express.json());

// Servir archivos estáticos (para pruebas)
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Crear directorio de uploads si no existe
await mkdir(join(__dirname, '../uploads'), { recursive: true });

// Rutas
app.use('/api/upload', uploadRoutes);

// Formulario de prueba
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>File Upload Test</title>
      <style>
        body { font-family: system-ui; max-width: 600px; margin: 40px auto; padding: 20px; }
        form { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        input, button { margin: 10px 0; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
        pre { background: #f5f5f5; padding: 10px; overflow: auto; }
      </style>
    </head>
    <body>
      <h1>Upload de archivos</h1>

      <form action="/api/upload/local" method="post" enctype="multipart/form-data">
        <h3>Subida Local</h3>
        <input type="file" name="image" accept="image/*" required>
        <button type="submit">Subir</button>
      </form>

      <form action="/api/upload/cloud" method="post" enctype="multipart/form-data">
        <h3>Subida a Cloudinary</h3>
        <input type="file" name="image" accept="image/*" required>
        <button type="submit">Subir a la nube</button>
      </form>

      <form action="/api/upload/optimized" method="post" enctype="multipart/form-data">
        <h3>Subida Optimizada</h3>
        <input type="file" name="image" accept="image/*" required>
        <button type="submit">Optimizar y subir</button>
      </form>

      <form action="/api/upload/multiple" method="post" enctype="multipart/form-data">
        <h3>Múltiples archivos</h3>
        <input type="file" name="images" accept="image/*" multiple required>
        <button type="submit">Subir todos</button>
      </form>
    </body>
    </html>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
