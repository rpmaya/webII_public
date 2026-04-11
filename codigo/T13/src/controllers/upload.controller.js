// src/controllers/upload.controller.js
// Controlador de subida de archivos

import sharp from 'sharp';
import { uploadFromBuffer, deleteImage, getTransformedUrl } from '../config/cloudinary.js';

// ==================== SUBIDA LOCAL ====================

// Subir imagen (almacenada localmente)
export const uploadLocal = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    res.json({
      message: 'Archivo subido correctamente',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SUBIDA A CLOUDINARY ====================

// Subir imagen a Cloudinary
export const uploadToCloud = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    const result = await uploadFromBuffer(req.file.buffer, {
      folder: 'uploads',
      public_id: `image-${Date.now()}`
    });

    res.json({
      message: 'Imagen subida a Cloudinary',
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      }
    });
  } catch (error) {
    next(error);
  }
};

// Subir imagen optimizada
export const uploadOptimized = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    // Procesar con Sharp antes de subir
    const optimizedBuffer = await sharp(req.file.buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();

    const result = await uploadFromBuffer(optimizedBuffer, {
      folder: 'optimized',
      public_id: `optimized-${Date.now()}`
    });

    res.json({
      message: 'Imagen optimizada y subida',
      original: {
        size: req.file.size
      },
      optimized: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        savedBytes: req.file.size - result.bytes
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== PROCESAMIENTO CON SHARP ====================

// Subir imagen con thumbnail
export const uploadWithThumbnail = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    // Crear thumbnail
    const thumbnailBuffer = await sharp(req.file.buffer)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 70 })
      .toBuffer();

    // Subir ambas versiones
    const [original, thumbnail] = await Promise.all([
      uploadFromBuffer(req.file.buffer, {
        folder: 'images',
        public_id: `original-${Date.now()}`
      }),
      uploadFromBuffer(thumbnailBuffer, {
        folder: 'thumbnails',
        public_id: `thumb-${Date.now()}`
      })
    ]);

    res.json({
      message: 'Imagen y thumbnail subidos',
      original: {
        url: original.secure_url,
        publicId: original.public_id
      },
      thumbnail: {
        url: thumbnail.secure_url,
        publicId: thumbnail.public_id
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== MÚLTIPLES ARCHIVOS ====================

// Subir múltiples imágenes
export const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron archivos' });
    }

    const uploads = await Promise.all(
      req.files.map(async (file, index) => {
        const result = await uploadFromBuffer(file.buffer, {
          folder: 'gallery',
          public_id: `gallery-${Date.now()}-${index}`
        });
        return {
          url: result.secure_url,
          publicId: result.public_id
        };
      })
    );

    res.json({
      message: `${uploads.length} archivos subidos`,
      files: uploads
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ELIMINAR ====================

// Eliminar imagen de Cloudinary
export const deleteFromCloud = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    const result = await deleteImage(publicId);

    res.json({
      message: 'Imagen eliminada',
      result
    });
  } catch (error) {
    next(error);
  }
};
