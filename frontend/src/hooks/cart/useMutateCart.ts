import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateCartData, UpdateCartData } from '../../types/cart';
import { cartAPI } from '../../services/api';

export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCartData) => cartAPI.addToCart(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['carts'] }),
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartData) => cartAPI.updateCartItem(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['carts'] }),
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cartAPI.deleteCartItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['carts'] }),
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartAPI.checkout(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['carts'] }),
  });
};
