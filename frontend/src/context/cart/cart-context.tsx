import { createContext } from 'react';
import type {
  CartInfoWithDetails,
  CartItem,
  UpdateCartData,
} from '../../types/cart';

type CartContextType = {
  cartItems: CartInfoWithDetails[];
  addToCart: (item: CartItem) => Promise<boolean>;
  updateCartItemQty: (item: UpdateCartData) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>(
  {} as CartContextType
);
