import { Response } from 'express';
import { AuthRequest } from '../middleware/authenticate';
import { RequestContext, wrap } from '@mikro-orm/core';
import { CartItem } from '../entities/CartItem';
import { Product } from '../entities/Product';
import { AppError } from '../utils/appError';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';

export const addToCart = async (req: AuthRequest, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const userId = req?.user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { productId, quantity } = req.body;

  try {
    const product = await em.findOne(Product, { id: productId });
    if (!product) throw new AppError('Product not found', 404);

    if (product.stock < quantity) {
      throw new AppError('Insufficient stock', 404);
    }

    const existsCartItem = await em.findOne(CartItem, {
      user: userId,
      product: productId,
    });

    if (existsCartItem) {
      existsCartItem.quantity += quantity;
      await em.flush();
      return res.status(200).json({
        success: true,
        message: 'Item updated in cart',
        data: existsCartItem,
      });
    }

    const cartItem = em.create(CartItem, {
      user: userId,
      product,
      quantity,
    });
    await em.persistAndFlush(cartItem);
    res.status(201).json({
      success: true,
      message: 'Item added into cart',
      data: {
        id: cartItem.id,
        user: cartItem.user.id,
        product: cartItem.product.id,
        quantity: cartItem.quantity,
        createdAt: cartItem.createdAt,
        updatedAt: cartItem.updatedAt,
      },
    });
  } catch (err) {
    console.error('Error add cart item:', err);
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError('Failed to add item to cart', 500);
    }
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const userId = req?.user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const items = await em.find(
    CartItem,
    {
      user: userId,
    },
    {
      populate: ['product'],
      orderBy: { product: { name: 'ASC' } },
    }
  );

  res.status(200).json({
    success: true,
    message: 'Retrieve cart items successfully',
    data: items,
  });
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const userId = req?.user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const item = await em.findOne(CartItem, {
    id: req.params.cartItemId,
    user: userId,
  });

  if (!item) throw new AppError('Cart item not found', 404);

  const quantity = req.body.quantity;

  // If quantity is 0 or less, remove the item from the cart
  if (quantity <= 0) {
    await em.removeAndFlush(item);

    return res.status(200).json({
      success: true,
      message: 'Delete cart items successfully',
      data: [],
    });
  }

  item.quantity = quantity;
  await em.persistAndFlush(item);
  res.status(200).json({
    success: true,
    message: 'Update cart items successfully',
    data: item,
  });
};

export const deleteCartItem = async (req: AuthRequest, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const userId = req?.user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const item = await em.findOne(CartItem, {
    id: req.params.cartItemId,
    user: userId,
  });

  if (!item) throw new AppError('Cart item not found', 404);

  await em.removeAndFlush(item);

  res.status(200).json({
    success: true,
    message: 'Delete cart item successfully',
  });
};

export const checkoutCart = async (req: AuthRequest, res: Response) => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error('EntityManager not found in RequestContext');
  }

  const userId = req?.user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const cartItems = await em.find(
    CartItem,
    { user: userId },
    {
      populate: ['product'],
    }
  );

  if (!cartItems.length) throw new AppError('Cart is empty', 400);

  try {
    await em.transactional(async (trx) => {
      const order = trx.create(Order, {
        user: userId,
      });

      for (const item of cartItems) {
        if (!item.product || item.product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for product: ${item.product.name}`,
            400
          );
        }

        item.product.stock -= item.quantity;

        trx.create(OrderItem, {
          order,
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        });
      }

      // Save all changes
      await trx.flush();
      // Remove cart items
      await trx.nativeDelete(CartItem, { user: userId });
    });
    res.status(200).json({
      success: true,
      message: 'Checkout successfully',
    });
  } catch (err) {
    console.error('Error checkout:', err);
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError('Failed to checkout', 500);
    }
  }
};
