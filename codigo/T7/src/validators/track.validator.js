import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID no válido');

export const validatorCreateTrack = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'El título es requerido')
      .max(200, 'Máximo 200 caracteres')
      .trim(),
    duration: z.number()
      .int('Debe ser un número entero')
      .min(1, 'Mínimo 1 segundo'),
    genres: z.array(z.string().trim())
      .min(1, 'Debe tener al menos un género')
  })
});

export const validatorUpdateTrack = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    title: z.string().min(1).max(200).trim().optional(),
    duration: z.number().int().min(1).optional(),
    genres: z.array(z.string().trim()).min(1).optional()
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Debe enviar al menos un campo' }
  )
});

export const validatorTrackId = z.object({
  params: z.object({ id: objectIdSchema })
});
