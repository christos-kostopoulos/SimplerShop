import axios from 'axios';
import { Product } from '../models/Product';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  cart_id: string | null;
  discount_code: string;
}

export interface OrderResponse {
  id: number;
  items: OrderItem[];
  total: number;
  discountApplied: number;
  finalTotal: number;
}

export interface CartResponse {
  id: string;
  items: {
    product_id: string;
    quantity: number;
  }[];
}

export interface CartItemRequest {
  product_id: string;
  quantity: number;
}

// API functions
export const fetchProductsApi = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const submitOrderApi = async (orderData: OrderRequest): Promise<any> => {
  const response = await api.post('/orders', orderData);
  // Return the entire response object to access headers
  return response;
};

export const createCartApi = async (): Promise<string> => {
  const response = await api.post<string>('/carts');
  return response.headers.location;
};

export const getCartApi = async (cartId: string): Promise<CartResponse> => {
  const response = await api.get<CartResponse>(`/carts/${cartId}`);
  return response.data;
};

export const updateCartApi = async (
  cartId: string,
  items: CartItemRequest[]
): Promise<CartResponse> => {
  const response = await api.put<CartResponse>(`/carts/${cartId}`, items);
  return response.data;
};

export default api;
