import { usersModel } from '../models/index.js';
import { encrypt, compare } from '../utils/handlePassword.js';
import { tokenSign } from '../utils/handleJwt.js';
import { handleHttpError } from '../utils/handleError.js';

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
export const registerCtrl = async (req, res) => {
  try {
    // Verificar si el email ya existe
    const existingUser = await usersModel.findOne({ email: req.body.email });
    if (existingUser) {
      handleHttpError(res, 'EMAIL_ALREADY_EXISTS', 409);
      return;
    }
    
    // Encriptar contraseña
    const password = await encrypt(req.body.password);
    
    // Crear usuario con password encriptada
    const body = { ...req.body, password };
    const dataUser = await usersModel.create(body);
    
    // Ocultar password en la respuesta
    dataUser.set('password', undefined, { strict: false });
    
    // Generar token
    const data = {
      token: tokenSign(dataUser),
      user: dataUser
    };
    
    res.status(201).send(data);
  } catch (err) {
    console.log(err);
    handleHttpError(res, 'ERROR_REGISTER_USER');
  }
};

/**
 * Login de usuario
 * POST /api/auth/login
 */
export const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario incluyendo el password
    const user = await usersModel.findOne({ email }).select('password name role email');
    
    if (!user) {
      handleHttpError(res, 'USER_NOT_EXISTS', 404);
      return;
    }
    
    // Comparar contraseñas
    const hashPassword = user.password;
    const check = await compare(password, hashPassword);
    
    if (!check) {
      handleHttpError(res, 'INVALID_PASSWORD', 401);
      return;
    }
    
    // Ocultar password en la respuesta
    user.set('password', undefined, { strict: false });
    
    // Generar token y responder
    const data = {
      token: tokenSign(user),
      user
    };
    
    res.send(data);
  } catch (err) {
    console.log(err);
    handleHttpError(res, 'ERROR_LOGIN_USER');
  }
};

/**
 * Obtener usuario actual
 * GET /api/auth/me
 */
export const getMeCtrl = async (req, res) => {
  try {
    res.send({ user: req.user });
  } catch (err) {
    handleHttpError(res, 'ERROR_GET_ME');
  }
};

/**
 * Actualizar perfil
 * PUT /api/auth/me
 */
export const updateMeCtrl = async (req, res) => {
  try {
    const { name, age } = req.body;
    
    const user = await usersModel.findByIdAndUpdate(
      req.user._id,
      { name, age },
      { new: true, runValidators: true }
    );
    
    res.send({ user });
  } catch (err) {
    handleHttpError(res, 'ERROR_UPDATE_ME');
  }
};

/**
 * Cambiar contraseña
 * PUT /api/auth/password
 */
export const changePasswordCtrl = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Obtener usuario con password
    const user = await usersModel.findById(req.user._id).select('password');
    
    // Verificar contraseña actual
    const check = await compare(currentPassword, user.password);
    if (!check) {
      handleHttpError(res, 'INVALID_CURRENT_PASSWORD', 401);
      return;
    }
    
    // Encriptar nueva contraseña
    const hashedPassword = await encrypt(newPassword);
    
    // Actualizar
    await usersModel.findByIdAndUpdate(req.user._id, { password: hashedPassword });
    
    res.send({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    handleHttpError(res, 'ERROR_CHANGE_PASSWORD');
  }
};
