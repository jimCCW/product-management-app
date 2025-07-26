import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, authorize } from '../middleware/authenticate';
import { validationErrorHandler } from '../middleware/validate';
import { productValidator } from '../validators/product.validator';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/product.controller';
import { UserRole } from '../types/user';

const router = Router();

//Public Routes
router.get('/', asyncHandler(getAllProducts));
router.get('/:id', asyncHandler(getProductById));

// Private Routes
router.post(
  '/',
  authenticate,
  authorize([UserRole.ADMIN]),
  productValidator,
  validationErrorHandler,
  asyncHandler(createProduct)
);
router.put(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  productValidator,
  validationErrorHandler,
  asyncHandler(updateProduct)
);
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  asyncHandler(deleteProduct)
);

export default router;
