import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfig from '../mikro-orm.config';
import bcrypt from 'bcryptjs';
import { User } from './entities/User';
import { UserRole } from './types/user';
import { Product } from './entities/Product';

async function seed() {
  if (
    !process.env.DEFAULT_ADMIN_PASSWORD ||
    !process.env.DEFAULT_USER_PASSWORD
  ) {
    console.error('No default user and admin passwords provided in .env file.');
    return;
  }

  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  // Create default users
  const defaultUsers = [
    {
      name: 'Admin',
      email: 'admin@mandai.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD,
      role: UserRole.ADMIN,
    },
    {
      name: 'User',
      email: 'user@mandai.com',
      password: process.env.DEFAULT_USER_PASSWORD,
      role: UserRole.USER,
    },
  ];

  for (const userInfo of defaultUsers) {
    const exists = await em.findOne(User, { email: userInfo.email });
    if (exists) {
      console.log(`User email ${userInfo.email} already exists. Skipping...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userInfo.password, 12);

    const user = em.create(User, {
      ...userInfo,
      password: hashedPassword,
    });

    await em.persist(user);
  }

  // Create default products
  const defaultProducts = [
    {
      id: 'c1917d96-6593-4a99-a1ed-4383194e13a0',
      name: 'Mr Merlion',
      description: `Celebrate SG60 with Mr Merlion at Mandai Wildlife Reserve! Discover 60 unforgettable reasons to visit Singapore's top wildlife parks — exclusive Mr Merlion experiences, limited-edition SG60 merchandise, family-friendly activities, and close encounters with over 1,000 animals. Make this Singapore 60th anniversary truly wild at Mandai Wild Reserve.`,
      price: 39.0,
      stock: 100,
      imageUrl: '/products/product1.png',
    },
    {
      id: '7a299a45-1f0d-47dc-987f-c1a13b19df88',
      name: 'CC Hatchday Kids T-Shirt',
      description: `Let your little ones shine on their big day with the adorable CC Hatchday Tee - a perfect blend of comfort, style, and birthday cheer! Designed for active kids and featuring the lovable CC character ready to hatch into birthday fun, this T-shirt brings joy to any celebration.`,
      price: 25.0,
      stock: 100,
      imageUrl: '/products/product2.png',
    },
  ];

  for (const productInfo of defaultProducts) {
    const productExists = await em.findOne(Product, { id: productInfo.id });
    if (productExists) {
      console.log(`Product - ${productInfo.name} already exists. Skipping...`);
      continue;
    }

    const product = em.create(Product, productInfo);

    await em.persist(product);
  }

  await em.flush();
  await orm.close();
}

seed().catch(console.error);
