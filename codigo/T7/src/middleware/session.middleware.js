import { usersModel } from '../models/index.js';
import { verifyToken } from '../utils/handleJwt.js';
import { handleHttpError } from '../utils/handleError.js';

/**
 * Middleware de autenticación
 * Verifica el token JWT y añade el usuario a req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Verificar que existe el header Authorization
    if (!req.headers.authorization) {
      handleHttpError(res, 'NOT_TOKEN', 401);
      return;
    }
    
    // Extraer token: "Bearer eyJhbG..." -> "eyJhbG..."
    const token = req.headers.authorization.split(' ').pop();
    
    // Verificar token
    const dataToken = await verifyToken(token);
    
    if (!dataToken || !dataToken._id) {
      handleHttpError(res, 'ERROR_ID_TOKEN', 401);
      return;
    }
    
    // Buscar usuario y añadirlo a req
    const user = await usersModel.findById(dataToken._id);
    
    if (!user) {
      handleHttpError(res, 'USER_NOT_FOUND', 401);
      return;
    }
    
    // Inyectar usuario en la petición
    req.user = user;
    
    next();
  } catch (err) {
    handleHttpError(res, 'NOT_SESSION', 401);
  }
};

export default authMiddleware;
