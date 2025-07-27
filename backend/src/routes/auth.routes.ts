import { Router } from 'express';
import { register, login, getUser } from '../controllers/auth.controller';
import { validationErrorHandler } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  loginValidator,
  registerValidator,
} from '../validators/auth.validator';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post(
  '/register',
  registerValidator,
  validationErrorHandler,
  asyncHandler(register)
);
router.post(
  '/login',
  loginValidator,
  validationErrorHandler,
  asyncHandler(login)
);

// Private Routes
router.get('/user', authenticate, asyncHandler(getUser));

export default router;
