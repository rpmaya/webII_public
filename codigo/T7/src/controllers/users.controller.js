import { usersModel } from '../models/index.js';
import { handleHttpError } from '../utils/handleError.js';

/**
 * Listar usuarios (solo admin)
 * GET /api/users
 */
export const getUsers = async (req, res) => {
  try {
    const data = await usersModel.find({});
    res.send({ data });
  } catch (err) {
    handleHttpError(res, 'ERROR_GET_USERS');
  }
};

/**
 * Cambiar rol de usuario (solo admin)
 * PUT /api/users/:id/role
 */
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validar rol
    if (!['user', 'admin'].includes(role)) {
      handleHttpError(res, 'INVALID_ROLE', 400);
      return;
    }
    
    // No permitir que un admin se quite el rol a sí mismo
    if (id === req.user._id.toString() && role !== 'admin') {
      handleHttpError(res, 'CANNOT_REMOVE_OWN_ADMIN', 400);
      return;
    }
    
    const data = await usersModel.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    
    if (!data) {
      handleHttpError(res, 'USER_NOT_FOUND', 404);
      return;
    }
    
    res.send({ 
      message: `Rol actualizado a '${role}'`,
      data
    });
  } catch (err) {
    handleHttpError(res, 'ERROR_CHANGE_ROLE');
  }
};
