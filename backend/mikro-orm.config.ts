import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Product } from './src/entities/Product';
import { User } from './src/entities/User';
import * as dotenv from 'dotenv';
import { Migrator } from '@mikro-orm/migrations';
import { CartItem } from './src/entities/CartItem';
import { OrderItem } from './src/entities/OrderItem';
import { Order } from './src/entities/Order';

dotenv.config();

const config: Options = {
  driver: PostgreSqlDriver,
  entities: [Product, User, CartItem, Order, OrderItem],
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  debug: true,
};

export default config;
