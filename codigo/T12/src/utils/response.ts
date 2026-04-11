// src/utils/response.ts
// Helpers para respuestas tipadas

import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

// Respuesta exitosa
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  res.status(statusCode).json(response);
};

// Respuesta con paginación
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number }
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    meta: pagination
  };
  res.json(response);
};

// Respuesta de error
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500
): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: message
  };
  res.status(statusCode).json(response);
};

// Respuesta 404
export const sendNotFound = (
  res: Response,
  resource: string = 'Resource'
): void => {
  sendError(res, `${resource} not found`, 404);
};

// Respuesta 201 Created
export const sendCreated = <T>(res: Response, data: T): void => {
  sendSuccess(res, data, 201);
};
