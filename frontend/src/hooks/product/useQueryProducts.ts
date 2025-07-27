import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../services/api';

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: () => productAPI.getProducts().then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 Minutes
  });

export const useProductsById = (id: string) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: () => productAPI.getProductById(id).then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 Minutes
  });
