import { Router } from 'express';
import { getUsers, changeUserRole } from '../controllers/users.controller.js';
import authMiddleware from '../middleware/session.middleware.js';
import checkRol from '../middleware/rol.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación y rol admin
router.use(authMiddleware);
router.use(checkRol(['admin']));

router.get('/', getUsers);
router.put('/:id/role', changeUserRole);

export default router;
