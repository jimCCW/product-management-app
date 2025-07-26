import { body } from 'express-validator';

export const addToCartValidator = [
  body('productId').isUUID().withMessage('Product ID is invalid'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than 0'),
];

export const updateCartValidator = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer greater than 0'),
];
