import { Request, Response } from 'express';
import { AppError } from '../../src/utils/appError';
import { RequestContext, EntityManager } from '@mikro-orm/core';
import { Product } from '../../src/entities/Product';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../../src/controllers/product.controller';

describe('Product Controller', () => {
  const mockEm: Partial<EntityManager> = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
    assign: jest.fn(),
    removeAndFlush: jest.fn(),
  };

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

  describe('Create Product', () => {
    it('should create product successfully', async () => {
      const req = {
        body: {
          name: 'Test Product 2',
          description: 'Test product 2 description',
          price: 12,
          stock: 100,
        },
      } as Request;

      const res = mockRes();
      (mockEm.create as jest.Mock).mockImplementation((_, data) => data);

      await createProduct(req, res);

      expect(mockEm.create).toHaveBeenCalled();
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: `Product - ${req.body.name} created successfully`,
      });
    });
  });

  describe('Get All Products', () => {
    it('should return all products', async () => {
      const res = mockRes();
      const mockProducts = [{ name: 'A' }, { name: 'B' }];
      (mockEm.find as jest.Mock).mockResolvedValue(mockProducts);

      await getAllProducts({} as Request, res);

      expect(mockEm.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Retrieve products successfully',
        data: mockProducts,
      });
    });
  });

  describe('Get Product By Id', () => {
    it('should return error if product not found', async () => {
      const req = {
        params: { id: '7a299a45-1f0d-47dc-987f-c1a13b19df88' },
      } as unknown as Request;
      const res = mockRes();

      (mockEm.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getProductById(req, res)).rejects.toThrow(AppError);
    });

    it('should return product by id', async () => {
      const req = {
        params: { id: '7a299a45-1f0d-47dc-987f-c1a13b19df88' },
      } as unknown as Request;
      const res = mockRes();

      const product = {
        id: '7a299a45-1f0d-47dc-987f-c1a13b19df88',
        name: 'CC Hatchday Kids T-Shirt',
        imageUrl: '/products/product2.png',
        price: 25,
        stock: 89,
        createdAt: '2025-07-26T14:56:50.898Z',
        updatedAt: '2025-07-27T14:50:09.454Z',
      };

      (mockEm.findOne as jest.Mock).mockResolvedValue(product);

      await getProductById(req, res);

      expect(mockEm.findOne).toHaveBeenCalledWith(Product, {
        id: req.params.id,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Retrieve product successfully',
        data: product,
      });
    });
  });

  describe('Update Product', () => {
    it('should return error if product not found', async () => {
      const req = {
        params: { id: 'c1917d96-6593-4a99-a1ed-4383194e13a0' },
      } as unknown as Request;
      const res = mockRes();

      (mockEm.findOne as jest.Mock).mockResolvedValue(null);

      await expect(updateProduct(req, res)).rejects.toThrow(AppError);
    });

    it('should update a product', async () => {
      const req = {
        params: { id: 'c1917d96-6593-4a99-a1ed-4383194e13a0' },
        body: {
          name: 'Test Edit Product 1',
          price: 110,
          stock: 111,
          description: 'Testing Product 1',
        },
      } as unknown as Request;
      const res = mockRes();
      const product = {
        id: 'c1917d96-6593-4a99-a1ed-4383194e13a0',
        name: 'Test Edit Product 1',
        price: 110,
        stock: 111,
        description: 'Testing Product 1',
      };

      (mockEm.findOne as jest.Mock).mockResolvedValue(product);

      await updateProduct(req, res);

      expect(mockEm.assign).toHaveBeenCalled();
      expect(mockEm.flush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: `Product - ${req.body.name} update successfully`,
        data: product,
      });
    });
  });

  describe('Delete Product', () => {
    it('should return error if product not found', async () => {
      const req = {
        params: { id: '6f455622-0359-4262-bd94-a60c33906cf7' },
      } as unknown as Request;
      const res = mockRes();

      (mockEm.findOne as jest.Mock).mockResolvedValue(null);

      await expect(deleteProduct(req, res)).rejects.toThrow(AppError);
    });

    it('should delete product', async () => {
      const req = {
        params: { id: '6f455622-0359-4262-bd94-a60c33906cf7' },
      } as unknown as Request;
      const res = mockRes();

      const product = {
        id: '6f455622-0359-4262-bd94-a60c33906cf7',
        name: 'Test Edit Product 1',
        price: 110,
        stock: 111,
        description: 'Testing Product 1',
      };

      (mockEm.findOne as jest.Mock).mockResolvedValue(product);

      await deleteProduct(req, res);

      expect(mockEm.removeAndFlush).toHaveBeenCalledWith(product);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: `Product - ${product.name} removed`,
      });
    });
  });
});
