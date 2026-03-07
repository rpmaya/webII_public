import { z } from 'zod';

export const validatorRegister = z.object({
  body: z.object({
    name: z.string()
      .min(3, 'Mínimo 3 caracteres')
      .max(99, 'Máximo 99 caracteres')
      .trim(),
    email: z.string()
      .email('Email no válido')
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(8, 'Mínimo 8 caracteres')
      .max(16, 'Máximo 16 caracteres'),
    age: z.number()
      .int('Debe ser un número entero')
      .min(0, 'Edad no puede ser negativa')
      .max(120, 'Edad no válida')
      .optional()
  })
});

export const validatorLogin = z.object({
  body: z.object({
    email: z.string()
      .email('Email no válido')
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(8, 'Mínimo 8 caracteres')
      .max(16, 'Máximo 16 caracteres')
  })
});
