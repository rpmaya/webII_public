// src/app.ts
// Servidor Express con TypeScript

import express, { Express, Request, Response, NextFunction } from 'express';
import usersRoutes from './routes/users.routes.js';

const app: Express = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/users', usersRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Error handler tipado
interface AppError extends Error {
  statusCode?: number;
}

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Iniciar servidor
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Servidor TypeScript en http://localhost:${PORT}`);
});

export default app;
