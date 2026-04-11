// src/types/index.ts
// Tipos e interfaces del proyecto

import { z } from 'zod';

// ==================== ENUMS ====================

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// ==================== INTERFACES ====================

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: number;
  userId: number;
  bio?: string;
  avatar?: string;
}

export interface UserWithProfile extends User {
  profile?: Profile;
}

// ==================== TYPES ====================

// Crear usuario (sin id ni timestamps)
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Actualizar usuario (campos opcionales)
export type UpdateUserInput = Partial<Pick<User, 'name' | 'role' | 'status'>>;

// Usuario para respuesta API (sin datos sensibles)
export type UserResponse = Omit<User, 'updatedAt'>;

// ==================== ZOD SCHEMAS ====================

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre muy corto').max(100),
  role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
  status: z.nativeEnum(UserStatus).optional().default(UserStatus.ACTIVE)
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional()
});

export const idParamSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().positive())
});

// Inferir tipos desde schemas
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

// ==================== API RESPONSE ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// ==================== GENERICS EXAMPLE ====================

export interface Repository<T, CreateDTO, UpdateDTO> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(id: number, data: UpdateDTO): Promise<T>;
  delete(id: number): Promise<void>;
}
