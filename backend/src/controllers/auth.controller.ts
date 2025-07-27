import { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { AppError } from '../utils/appError';
import { signJwt } from '../utils/jwt';
import { AuthRequest } from '../middleware/authenticate';

export const register = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const { name, email, password, role } = req.body;

  const userExists = await em.findOne(User, { email });
  if (userExists) {
    throw new AppError('Email already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = em.create(User, { name, email, password: hashedPassword, role });

  await em.persistAndFlush(user);
  res
    .status(201)
    .json({ success: true, message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const { email, password } = req.body;

  const user = await em.findOne(User, { email });
  if (!user) throw new AppError('Invalid email or password', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Invalid email or password', 401);

  const token = signJwt({ id: user.id, role: user.role });

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const getUser = async (req: AuthRequest, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const userId = req?.user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const user = await em.findOne(User, { id: userId });
  if (!user) throw new AppError('User not found', 404);

  res.status(200).json({
    success: true,
    message: 'Retrieve User profile successfully',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
