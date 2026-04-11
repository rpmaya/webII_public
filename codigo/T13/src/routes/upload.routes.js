// src/routes/upload.routes.js
// Rutas de subida de archivos

import { Router } from 'express';
import { uploadImageLocal, uploadImageMemory } from '../config/multer.js';
import { requireFile, handleMulterError } from '../middleware/upload.js';
import * as uploadController from '../controllers/upload.controller.js';

const router = Router();

// Subida local
router.post(
  '/local',
  uploadImageLocal.single('image'),
  handleMulterError,
  requireFile('image'),
  uploadController.uploadLocal
);

// Subida a Cloudinary
router.post(
  '/cloud',
  uploadImageMemory.single('image'),
  handleMulterError,
  requireFile('image'),
  uploadController.uploadToCloud
);

// Subida optimizada
router.post(
  '/optimized',
  uploadImageMemory.single('image'),
  handleMulterError,
  requireFile('image'),
  uploadController.uploadOptimized
);

// Subida con thumbnail
router.post(
  '/with-thumbnail',
  uploadImageMemory.single('image'),
  handleMulterError,
  requireFile('image'),
  uploadController.uploadWithThumbnail
);

// Subida múltiple
router.post(
  '/multiple',
  uploadImageMemory.array('images', 10),
  handleMulterError,
  uploadController.uploadMultiple
);

// Eliminar de Cloudinary
router.delete(
  '/cloud/:publicId',
  uploadController.deleteFromCloud
);

export default router;
