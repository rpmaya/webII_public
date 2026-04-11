// src/controllers/users.controller.ts
// Controlador de usuarios tipado

import { Request, Response, NextFunction } from 'express';
import {
  User,
  UserRole,
  UserStatus,
  CreateUserDTO,
  UpdateUserDTO
} from '../types/index.js';
import { sendSuccess, sendCreated, sendNotFound, sendPaginated } from '../utils/response.js';

// Base de datos simulada
const users: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let nextId = 2;

// Type guard para verificar si existe usuario
const isValidUser = (user: User | undefined): user is User => {
  return user !== undefined;
};

// ==================== HANDLERS ====================

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const paginatedUsers = users.slice(skip, skip + limit);

    sendPaginated(res, paginatedUsers, {
      page,
      limit,
      total: users.length
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!isValidUser(user)) {
      sendNotFound(res, 'User');
      return;
    }

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request<object, object, CreateUserDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name, role, status } = req.body;

    const newUser: User = {
      id: nextId++,
      email,
      name,
      role: role ?? UserRole.USER,
      status: status ?? UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    sendCreated(res, newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request<{ id: string }, object, UpdateUserDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      sendNotFound(res, 'User');
      return;
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...req.body,
      updatedAt: new Date()
    };

    users[userIndex] = updatedUser;
    sendSuccess(res, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      sendNotFound(res, 'User');
      return;
    }

    users.splice(userIndex, 1);
    sendSuccess(res, { message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
