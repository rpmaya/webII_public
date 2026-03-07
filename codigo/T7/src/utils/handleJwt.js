import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

/**
 * Genera un token JWT
 * @param {Object} user - Usuario con _id y role
 * @returns {string} - Token JWT
 */
export const tokenSign = (user) => {
  const sign = jwt.sign(
    {
      _id: user._id,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
  return sign;
};

/**
 * Verifica y decodifica un token
 * @param {string} tokenJwt - Token a verificar
 * @returns {Object|null} - Payload del token o null si es inválido
 */
export const verifyToken = (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (err) {
    console.log('Error verificando token:', err.message);
    return null;
  }
};
