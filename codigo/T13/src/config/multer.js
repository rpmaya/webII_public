// src/config/multer.js
// Configuración de Multer para subida de archivos

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==================== STORAGE LOCAL ====================

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// ==================== STORAGE MEMORIA ====================

const memoryStorage = multer.memoryStorage();

// ==================== FILTROS ====================

// Solo imágenes
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Solo documentos
const documentFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten documentos (PDF, DOC, DOCX)'), false);
  }
};

// ==================== CONFIGURACIONES ====================

// Subida de una imagen (almacenamiento local)
export const uploadImageLocal = multer({
  storage: localStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Subida de imagen a memoria (para Cloudinary)
export const uploadImageMemory = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Subida de documento
export const uploadDocument = multer({
  storage: localStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
});

// Subida genérica con límite
export const uploadGeneric = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});
