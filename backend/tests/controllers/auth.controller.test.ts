import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  login,
  register,
  getUser,
} from '../../src/controllers/auth.controller';
import { AppError } from '../../src/utils/appError';
import { RequestContext, EntityManager } from '@mikro-orm/core';
import { User } from '../../src/entities/User';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn(),
}));

jest.mock('../../src/utils/jwt', () => ({
  signJwt: jest.fn().mockReturnValue('test.jwt.token'),
}));

describe('Auth Controller', () => {
  const mockEm: Partial<EntityManager> = {
    findOne: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
  };

  const MOCK_REQ_DATA = {
    body: {
      name: 'Testing 123',
      email: 'testing123@mandai.com',
      password: 'Password123',
      role: 'user',
    },
  } as Request;

  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(RequestContext, 'getEntityManager')
      .mockReturnValue(mockEm as EntityManager);
  });

  describe('Register User', () => {
    it('should return error if email exist', async () => {
      (mockEm.findOne as jest.Mock).mockResolvedValue({
        name: 'testing',
        email: ' testing123@mandai.com',
      });

      const res = mockRes();

      await expect(register(MOCK_REQ_DATA, res)).rejects.toThrow(AppError);
    });

    it('should register a new user', async () => {
      (mockEm.findOne as jest.Mock).mockResolvedValue(null);
      (mockEm.create as jest.Mock).mockImplementation(
        (_: any, data: any) => data
      );
      (mockEm.persistAndFlush as jest.Mock).mockResolvedValue(undefined);

      const res = mockRes();

      await register(MOCK_REQ_DATA, res);

      expect(mockEm.findOne).toHaveBeenCalledWith(User, {
        email: MOCK_REQ_DATA.body.email,
      });
      expect(mockEm.create).toHaveBeenCalled();
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
      });
    });
  });

  describe('User Login', () => {
    const MOCK_LOGIN_DATA = {
      body: {
        email: 'testing123@mandai.com',
        password: 'hashedPassword',
      },
    } as Request;

    const MOCK_USER_DATA = {
      id: '1',
      name: 'Testing 123',
      email: 'testing123@mandai.com',
      password: 'hashedPassword',
      role: 'user',
    };

    it('should return error if user not exist', async () => {
      (mockEm.findOne as jest.Mock).mockResolvedValue(null);
      const res = mockRes();

      await expect(login(MOCK_LOGIN_DATA, res)).rejects.toThrow(AppError);
    });

    it('should return error if invalid credentials', async () => {
      const req = {
        body: {
          email: 'testing123@mandai.com',
          password: 'wrong',
        },
      } as Request;

      const res = mockRes();

      (mockEm.findOne as jest.Mock).mockResolvedValue({
        id: '2',
        name: 'Testing 123',
        email: 'testing123@mandai.com',
        password: 'wronghash',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(login(req, res)).rejects.toThrow(AppError);
    });

    it('should login successfully', async () => {
      (mockEm.findOne as jest.Mock).mockResolvedValue(MOCK_USER_DATA);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const res = mockRes();

      await login(MOCK_LOGIN_DATA, res);

      expect(mockEm.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'test.jwt.token',
        user: {
          id: MOCK_USER_DATA.id,
          name: MOCK_USER_DATA.name,
          email: MOCK_USER_DATA.email,
          role: MOCK_USER_DATA.role,
        },
      });
    });
  });

  describe('Get User Profile', () => {
    it('should return error if user not found', async () => {
      const req = {
        user: { id: '1' },
      } as any;

      const res = mockRes();

      (mockEm.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getUser(req, res)).rejects.toThrow(AppError);
    });

    it('should return user profile', async () => {
      const req = {
        user: { id: '1' },
      } as any;

      const res = mockRes();

      const userProfile = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };

      (mockEm.findOne as jest.Mock).mockResolvedValue(userProfile);

      await getUser(req, res);

      expect(mockEm.findOne).toHaveBeenCalledWith(User, { id: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Retrieve User profile successfully',
        data: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role,
        },
      });
    });
  });
});
