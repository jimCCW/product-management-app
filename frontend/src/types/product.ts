import type { GenericResponse } from './api';

export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductResponse extends GenericResponse {
  data?: ProductInfo[];
}

export interface GetProductByIdResponse extends GenericResponse {
  data?: ProductInfo;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface UpdateProductData extends CreateProductData {
  id: string;
}
