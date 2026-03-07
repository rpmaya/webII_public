import { handleHttpError } from '../utils/handleError.js';

/**
 * Middleware de autorización por rol
 * @param {string[]} roles - Array de roles permitidos
 */
const checkRol = (roles) => (req, res, next) => {
  try {
    // El usuario viene del middleware de autenticación
    const { user } = req;
    
    // Obtener rol del usuario
    const userRol = user.role;
    
    // Verificar si el rol está en la lista de permitidos
    const checkValueRol = roles.includes(userRol);
    
    if (!checkValueRol) {
      handleHttpError(res, 'NOT_ALLOWED', 403);
      return;
    }
    
    next();
  } catch (err) {
    handleHttpError(res, 'ERROR_PERMISSIONS', 403);
  }
};

export default checkRol;
