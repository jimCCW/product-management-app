import { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Product } from '../entities/Product';
import { AppError } from '../utils/appError';

export const createProduct = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const { name, description, price, stock } = req.body;

  try {
    // We hardcode the imageUrl for simplicity,
    // But in a real application, the image shoudl upload and store at a specific location example in S3 or Cloudinary
    const product = em.create(Product, {
      name,
      description,
      price,
      stock,
      imageUrl: '/products/placeholder.png',
    });

    await em.persistAndFlush(product);
    res.status(201).json({
      success: true,
      message: `Product - ${name} created successfully`,
    });
  } catch (err) {
    console.error('Error creating product:', err);
    throw new AppError('Failed to create product', 500);
  }
};

export const getAllProducts = async (_: Request, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const products = await em.find(Product, {}, { orderBy: { name: 'ASC' } });

  res.status(200).json({
    success: true,
    message: 'Retrieve products successfully',
    data: products,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  try {
    const product = await em.findOne(Product, { id: req.params.id });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Retrieve product successfully',
      data: product,
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError('Failed to fetch product', 500);
    }
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  try {
    const product = await em.findOne(Product, { id: req.params.id });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const { name, description, price, stock } = req.body;

    em.assign(product, {
      name,
      description,
      price,
      stock,
    });

    await em.flush();

    res.status(200).json({
      success: true,
      messge: `Product - ${name} update successfully`,
      data: product,
    });
  } catch (err) {
    console.error('Error updating product:', err);
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError('Failed to update product', 500);
    }
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  try {
    const product = await em.findOne(Product, { id: req.params.id });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await em.removeAndFlush(product);
    res.status(200).json({
      success: true,
      message: `Product - ${product.name} removed`,
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError('Failed to delete product', 500);
    }
  }
};
