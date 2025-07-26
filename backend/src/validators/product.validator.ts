import { body } from 'express-validator';

export const productValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('description').trim().optional().escape(),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .notEmpty()
    .withMessage('Price is required')
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error('Price must be more than 0');
      }

      return true;
    }),
  body('stock')
    .isInt()
    .withMessage('Stock must be an integer')
    .notEmpty()
    .withMessage('Stock is required'),
];
