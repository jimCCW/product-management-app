import { useQuery } from '@tanstack/react-query';
import { cartAPI } from '../../services/api';

export const useCarts = () =>
  useQuery({
    queryKey: ['carts'],
    queryFn: () => cartAPI.getCartItems().then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 Minutes
  });
