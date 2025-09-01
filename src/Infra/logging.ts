import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

export const loggingMiddleware = morgan('combined');

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - Iniciado`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};
