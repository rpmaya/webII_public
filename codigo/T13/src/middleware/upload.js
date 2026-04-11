// src/middleware/upload.js
// Middleware de validación de archivos

// Validar que existe archivo
export const requireFile = (fieldName = 'file') => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return res.status(400).json({
        error: `No se proporcionó archivo en el campo '${fieldName}'`
      });
    }
    next();
  };
};

// Validar tamaño mínimo
export const minFileSize = (minBytes) => {
  return (req, res, next) => {
    const file = req.file;
    if (file && file.size < minBytes) {
      return res.status(400).json({
        error: `El archivo debe tener al menos ${minBytes / 1024}KB`
      });
    }
    next();
  };
};

// Validar dimensiones de imagen (requiere sharp previo)
export const imageDimensions = (minWidth, minHeight) => {
  return async (req, res, next) => {
    if (!req.imageMetadata) {
      return next();
    }

    const { width, height } = req.imageMetadata;

    if (width < minWidth || height < minHeight) {
      return res.status(400).json({
        error: `La imagen debe tener al menos ${minWidth}x${minHeight} píxeles`
      });
    }

    next();
  };
};

// Manejo de errores de Multer
export const handleMulterError = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'El archivo excede el tamaño máximo permitido'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      error: 'Se excedió el número máximo de archivos'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Campo de archivo inesperado'
    });
  }

  if (err.message) {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};
