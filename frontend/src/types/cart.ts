import type { GenericResponse } from './api';
import type { ProductInfo } from './product';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

export interface CartInfo {
  id: string;
  user: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartInfoWithDetails extends CartInfo {
  product: ProductInfo;
}

export interface BasicCartInfo extends CartInfo {
  product: string;
}

export interface GetCartItemsResponse extends GenericResponse {
  data?: CartInfoWithDetails[];
}

export interface CreateCartData {
  productId: string;
  quantity: number;
}

export interface CreateCartResponse extends GenericResponse {
  data?: BasicCartInfo;
}

export interface UpdateCartData {
  id: string;
  quantity: number;
}
