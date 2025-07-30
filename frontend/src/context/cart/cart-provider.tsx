import {
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import type {
  CartInfoWithDetails,
  CartItem,
  UpdateCartData,
} from '../../types/cart';
import { CartContext } from './cart-context';
import {
  useAddCartItem,
  useDeleteCartItem,
  useUpdateCartItem,
} from '../../hooks/cart/useMutateCart';
import { cartAPI } from '../../services/api';
import { AuthContext } from '../auth/auth-context';

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { mutateAsync: addToCartMutation } = useAddCartItem();
  const { mutateAsync: updateCartItemMutation } = useUpdateCartItem();
  const { mutateAsync: deleteCartItemMutation } = useDeleteCartItem();
  const [cartItems, setCartItems] = useState<CartInfoWithDetails[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      getUserCartItems();
    } else {
      clearCart();
    }
  }, [isAuthenticated]);

  const getUserCartItems = async () => {
    try {
      const response = await cartAPI.getCartItems();
      if (response.data.success) {
        setCartItems(response.data.data ?? []);
      }
    } catch (error) {
      console.error('Failed to retrieve user cart:', error);

      setCartItems([]);
    }
  };

  const addToCart = async (item: CartItem): Promise<boolean> => {
    const addRes = await addToCartMutation({
      productId: item.id,
      quantity: item.quantity,
    });

    // Refetch items
    if (addRes?.data.success) {
      await getUserCartItems();
      return true;
    }

    return false;
  };

  const updateCartItemQty = async (itemData: UpdateCartData) => {
    const updateRes = await updateCartItemMutation(itemData);

    // Refetch items
    if (updateRes?.data.success) await getUserCartItems();
  };

  const removeFromCart = async (id: string) => {
    const deleteRes = await deleteCartItemMutation(id);

    // Refetch items
    if (deleteRes?.data.success) await getUserCartItems();
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
