import axios from 'axios';
import type {
  UserLoginResponse,
  RegisterUserData,
  UserProfileResponse,
  RegisterUserResponse,
} from '../types/user';
import type {
  CreateProductData,
  GetProductByIdResponse,
  GetProductResponse,
  UpdateProductData,
} from '../types/product';
import { type GenericResponse } from '../types/api';
import {
  type CreateCartData,
  type CreateCartResponse,
  type GetCartItemsResponse,
  type UpdateCartData,
} from '../types/cart';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<UserLoginResponse>('/auth/login', { email, password }),

  register: (userData: RegisterUserData) =>
    api.post<RegisterUserResponse>('/auth/register', userData),

  getProfile: () => api.get<UserProfileResponse>('/auth/user'),
};

// Product APIs
export const productAPI = {
  getProducts: () => api.get<GetProductResponse>('/products'),
  getProductById: (id: string) =>
    api.get<GetProductByIdResponse>(`/products/${id}`),
  createProduct: (data: CreateProductData) =>
    api.post<GenericResponse>('/products', data),
  updateProduct: (data: UpdateProductData) =>
    api.put<GetProductByIdResponse>(`/products/${data.id}`, data),
  deleteProduct: (id: string) => api.delete<GenericResponse>(`/products/${id}`),
};

// Cart APIs
export const cartAPI = {
  getCartItems: () => api.get<GetCartItemsResponse>('/cart'),
  addToCart: (data: CreateCartData) =>
    api.post<CreateCartResponse>('/cart', data),
  updateCartItem: (data: UpdateCartData) =>
    api.put<CreateCartResponse>(`/cart/${data.id}`, data),
  deleteCartItem: (id: string) => api.delete<GenericResponse>(`/cart/${id}`),
  checkout: () => api.post<GenericResponse>('/cart/checkout'),
};
