import api from './api';
import { Warehouse } from '../types';

// Get all warehouses
export const getWarehouses = async () => {
  const response = await api.get('/warehouses');
  return response; // Return full axios response (response.data will be accessed in component)
};

// Get single warehouse
export const getWarehouse = async (id: string) => {
  const response = await api.get(`/warehouses/${id}`);
  return response.data;
};

// Create new warehouse (Manager only)
export const createWarehouse = async (warehouseData: Partial<Warehouse>) => {
  const response = await api.post('/warehouses', warehouseData);
  return response.data;
};

// Update warehouse (Manager only)
export const updateWarehouse = async (id: string, warehouseData: Partial<Warehouse>) => {
  const response = await api.put(`/warehouses/${id}`, warehouseData);
  return response.data;
};

// Delete warehouse (Manager only)
export const deleteWarehouse = async (id: string) => {
  const response = await api.delete(`/warehouses/${id}`);
  return response.data;
};

export default {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
