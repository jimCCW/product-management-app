import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validationErrorHandler } from '../middleware/validate';
import {
  addToCartValidator,
  updateCartValidator,
} from '../validators/cart.validator';
import { asyncHandler } from '../utils/asyncHandler';
import {
  addToCart,
  checkoutCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from '../controllers/cart.controller';

const router = Router();

// Private Routes
router.use(authenticate);

router.post(
  '/',
  addToCartValidator,
  validationErrorHandler,
  asyncHandler(addToCart)
);
router.get('/', asyncHandler(getCart));
router.put(
  '/:cartItemId',
  updateCartValidator,
  validationErrorHandler,
  asyncHandler(updateCartItem)
);
router.delete('/:cartItemId', asyncHandler(deleteCartItem));
router.post('/checkout', asyncHandler(checkoutCart));

export default router;
