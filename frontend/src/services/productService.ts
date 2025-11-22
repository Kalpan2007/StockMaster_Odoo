import api from './api';
import { Product } from '../types';

export interface ProductFilters {
  search?: string;
  category?: string;
  warehouse?: string;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}

// Get all products with filters
export const getProducts = async (filters?: ProductFilters): Promise<ProductResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get<ProductResponse>(`/products?${params.toString()}`);
  return response.data;
};

// Get single product
export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Create new product (Manager only)
export const createProduct = async (productData: Partial<Product>) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// Update product (Manager only)
export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product (Manager only)
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Get product categories
export const getCategories = async () => {
  const response = await api.get('/products/categories/list');
  return response.data;
};

// Get low stock products
export const getLowStockProducts = async () => {
  const response = await api.get('/products/alerts/low-stock');
  return response.data;
};

// Get out of stock products
export const getOutOfStockProducts = async () => {
  const response = await api.get('/products/alerts/out-of-stock');
  return response.data;
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getLowStockProducts,
  getOutOfStockProducts,
};
