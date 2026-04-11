// src/routes/users.routes.ts
// Rutas de usuarios con validación

import { Router } from 'express';
import * as usersController from '../controllers/users.controller.js';
import { validate, validateRequest } from '../middleware/validate.js';
import {
  createUserSchema,
  updateUserSchema,
  idParamSchema
} from '../types/index.js';

const router = Router();

// GET /users
router.get('/', usersController.getUsers);

// GET /users/:id
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  usersController.getUserById
);

// POST /users
router.post(
  '/',
  validate(createUserSchema),
  usersController.createUser
);

// PUT /users/:id
router.put(
  '/:id',
  validateRequest({
    params: idParamSchema,
    body: updateUserSchema
  }),
  usersController.updateUser
);

// DELETE /users/:id
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  usersController.deleteUser
);

export default router;
