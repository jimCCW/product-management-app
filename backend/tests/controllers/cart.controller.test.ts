import { Request, Response } from 'express';
import { AppError } from '../../src/utils/appError';
import { RequestContext, EntityManager } from '@mikro-orm/core';
import { Product } from '../../src/entities/Product';
import { CartItem } from '../../src/entities/CartItem';
import {
  addToCart,
  checkoutCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from '../../src/controllers/cart.controller';

describe('Cart Controller', () => {
  const mockEm: Partial<EntityManager> = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
    assign: jest.fn(),
    removeAndFlush: jest.fn(),
    nativeDelete: jest.fn(),
    transactional: jest.fn(),
  };

  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  const mockUserReq = {
    user: {
      id: '09273e55-3b29-4357-aec9-a66839e09416',
      name: 'User',
      email: 'user@mandai.com',
      role: 'user',
    },
    body: {},
    params: {},
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(RequestContext, 'getEntityManager')
      .mockReturnValue(mockEm as EntityManager);
  });

  describe('Add To Cart', () => {
    it('should update item if already exists in cart', async () => {
      const req = {
        ...mockUserReq,
        body: {
          productId: 'c1917d96-6593-4a99-a1ed-4383194e13a0',
          quantity: 20,
        },
      };
      const product = { id: 'c1917d96-6593-4a99-a1ed-4383194e13a0', stock: 30 };
      const cartItem = { quantity: 1 };

      (mockEm.findOne as jest.Mock).mockImplementationOnce(() => product);
      (mockEm.findOne as jest.Mock).mockImplementationOnce(() => cartItem);

      const res = mockRes();
      await addToCart(req, res);

      expect(mockEm.flush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Item updated in cart',
        data: cartItem,
      });
    });

    it('should add item to cart', async () => {
      const req = {
        ...mockUserReq,
        body: {
          productId: 'c1917d96-6593-4a99-a1ed-4383194e13a0',
          quantity: 20,
        },
      };
      const product = { id: 'c1917d96-6593-4a99-a1ed-4383194e13a0', stock: 30 };

      (mockEm.findOne as jest.Mock).mockImplementationOnce(() => product);
      (mockEm.findOne as jest.Mock).mockImplementationOnce(() => null);
      (mockEm.create as jest.Mock).mockImplementation((_, data) => data);

      const res = mockRes();
      await addToCart(req, res);

      expect(mockEm.create).toHaveBeenCalled();
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Get Cart', () => {
    it('should return error when no user id', async () => {
      const req = {} as Request;
      const res = mockRes();
      const items = [{}, {}];
      (mockEm.find as jest.Mock).mockResolvedValue(items);

      await expect(getCart(req, res)).rejects.toThrow(AppError);
    });

    it('should return cart items', async () => {
      const req = mockUserReq;
      const res = mockRes();
      const items = [{}, {}];
      (mockEm.find as jest.Mock).mockResolvedValue(items);
      await getCart(req, res);

      expect(mockEm.find).toHaveBeenCalledWith(
        CartItem,
        { user: mockUserReq.user.id },
        expect.objectContaining({ populate: ['product'] })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Retrieve cart items successfully',
        data: items,
      });
    });
  });

  describe('Update Cart Item', () => {
    it('should return error when no cart item', async () => {
      const req = {
        ...mockUserReq,
        params: { cartItemId: '34eaf99c-04e5-4491-bd62-bef473e0c19a' },
      };
      const res = mockRes();
      (mockEm.findOne as jest.Mock).mockResolvedValue(null);

      await expect(updateCartItem(req, res)).rejects.toThrow(AppError);
    });

    it('should remove item if quantity is 0', async () => {
      const req = {
        ...mockUserReq,
        params: { cartItemId: '34eaf99c-04e5-4491-bd62-bef473e0c19a' },
        body: { quantity: 0 },
      };

      const cartItem = { id: '34eaf99c-04e5-4491-bd62-bef473e0c19a' };
      (mockEm.findOne as jest.Mock).mockResolvedValue(cartItem);

      const res = mockRes();
      await updateCartItem(req, res);

      expect(mockEm.removeAndFlush).toHaveBeenCalledWith(cartItem);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update item quantity', async () => {
      const req = {
        ...mockUserReq,
        params: { cartItemId: '34eaf99c-04e5-4491-bd62-bef473e0c19a' },
        body: { quantity: 3 },
      };

      const cartItem = {
        id: '34eaf99c-04e5-4491-bd62-bef473e0c19a',
        quantity: 1,
      };
      (mockEm.findOne as jest.Mock).mockResolvedValue(cartItem);

      const res = mockRes();
      await updateCartItem(req, res);

      expect(mockEm.assign).toHaveBeenCalled();
      expect(mockEm.flush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Delete Cart Item', () => {
    it('should delete cart item', async () => {
      const req = {
        ...mockUserReq,
        params: { cartItemId: '34eaf99c-04e5-4491-bd62-bef473e0c19a' },
      };

      const cartItem = { id: '34eaf99c-04e5-4491-bd62-bef473e0c19a' };
      (mockEm.findOne as jest.Mock).mockResolvedValue(cartItem);

      const res = mockRes();
      await deleteCartItem(req, res);

      expect(mockEm.removeAndFlush).toHaveBeenCalledWith(cartItem);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Checkout Cart', () => {
    it('should return error when stock is 0', async () => {
      const req = mockUserReq;
      const res = mockRes();

      const cartItems = [
        {
          quantity: 1,
          product: { id: 'p1', name: 'Product 1', price: 10, stock: 0 },
        },
      ];

      (mockEm.find as jest.Mock).mockResolvedValue(cartItems);
      (mockEm.transactional as jest.Mock).mockImplementation(async (cb) => {
        await cb(mockEm as EntityManager);
      });

      await expect(checkoutCart(req, res)).rejects.toThrow(AppError);
    });

    it('should complete checkout transaction', async () => {
      const req = mockUserReq;
      const res = mockRes();

      const cartItems = [
        {
          quantity: 1,
          product: { id: 'p1', name: 'Product 1', price: 10, stock: 5 },
        },
      ];

      (mockEm.find as jest.Mock).mockResolvedValue(cartItems);
      (mockEm.transactional as jest.Mock).mockImplementation(async (cb) => {
        await cb(mockEm as EntityManager);
      });

      await checkoutCart(req, res);

      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.nativeDelete).toHaveBeenCalledWith(CartItem, {
        user: mockUserReq.user.id,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Checkout successfully',
      });
    });
  });
});
