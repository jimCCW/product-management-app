import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validationErrorHandler } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  loginValidator,
  registerValidator,
} from '../validators/auth.validator';

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

export default router;
