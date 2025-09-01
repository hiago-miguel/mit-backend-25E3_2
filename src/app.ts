import express from 'express';
import dotenv from 'dotenv';
import { configureExpress } from './Infra/express';
import authRoutes from './Api/authRoutes';
import userRoutes from './Api/users';
import employeeRoutes from './Api/employees';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

configureExpress(app);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.all('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(2, 15);
  
  console.error(`[${timestamp}] Error ID: ${errorId}`);
  console.error(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.error(`[${timestamp}] Error:`, err.stack);
  
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      errorId,
      timestamp,
      message: err.message 
    });
  } else {
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      errorId,
      timestamp
    });
  }
});

export { app, PORT };
