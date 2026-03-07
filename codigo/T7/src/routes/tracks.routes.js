import { Router } from 'express';
import { 
  getTracks, 
  getTrack, 
  createTrack, 
  updateTrack, 
  deleteTrack 
} from '../controllers/tracks.controller.js';
import authMiddleware from '../middleware/session.middleware.js';
import checkRol from '../middleware/rol.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  validatorCreateTrack, 
  validatorUpdateTrack, 
  validatorTrackId 
} from '../validators/track.validator.js';

const router = Router();

// Rutas públicas
router.get('/', getTracks);
router.get('/:id', validate(validatorTrackId), getTrack);

// Rutas protegidas (requieren token)
router.post('/', 
  authMiddleware,                   // 1. Verificar token
  checkRol(['user', 'admin']),      // 2. user o admin pueden crear
  validate(validatorCreateTrack),   // 3. Validar datos
  createTrack                       // 4. Ejecutar
);

router.put('/:id', 
  authMiddleware,
  checkRol(['user', 'admin']),
  validate(validatorUpdateTrack),
  updateTrack
);

// Solo admin puede eliminar
router.delete('/:id',
  authMiddleware,
  checkRol(['admin']),              // Solo admin
  validate(validatorTrackId),
  deleteTrack
);

export default router;
