import { body } from 'express-validator';
import { UserRole } from '../types/user';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage(
      'Password must contain at least one uppercase and one lowercase letter'
    ),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
];

export const loginValidator = [
  body('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];
