import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MikroORM, EntityManager } from '@mikro-orm/postgresql';
import mikroOrmConfig from '../mikro-orm.config';
import { RequestContext } from '@mikro-orm/core';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';

dotenv.config();

async function startServer() {
  const orm = await MikroORM.init(mikroOrmConfig);
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    RequestContext.create(orm.em.fork() as EntityManager, next);
  });

  // TODO: Add routes here
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    res.status(status).json({ success: false, message });
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
