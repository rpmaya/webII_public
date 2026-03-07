/**
 * Maneja errores HTTP
 * @param {Object} res - Objeto response de Express
 * @param {string} message - Mensaje de error
 * @param {number} code - Código HTTP (default 403)
 */
export const handleHttpError = (res, message = 'ERROR', code = 403) => {
  res.status(code).json({
    error: true,
    message
  });
};
