// src/config/cloudinary.js
// Configuración de Cloudinary

import { v2 as cloudinary } from 'cloudinary';

// Configurar credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ==================== FUNCIONES DE UTILIDAD ====================

// Subir imagen desde buffer
export const uploadFromBuffer = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'uploads',
      resource_type: 'auto',
      ...options
    };

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });
};

// Subir imagen desde URL
export const uploadFromUrl = async (url, options = {}) => {
  return cloudinary.uploader.upload(url, {
    folder: options.folder || 'uploads',
    ...options
  });
};

// Subir imagen desde archivo local
export const uploadFromPath = async (filePath, options = {}) => {
  return cloudinary.uploader.upload(filePath, {
    folder: options.folder || 'uploads',
    ...options
  });
};

// Eliminar imagen
export const deleteImage = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

// Obtener URL optimizada
export const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options
  });
};

// Obtener URL con transformaciones
export const getTransformedUrl = (publicId, transformations) => {
  return cloudinary.url(publicId, {
    transformation: transformations
  });
};

export default cloudinary;
