import api from './api';
import { Receipt, Delivery } from '../types';

// ==================== RECEIPTS ====================

export interface ReceiptFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Get all receipts
export const getReceipts = async (filters?: ReceiptFilters) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/receipts?${params.toString()}`);
  return response.data;
};

// Get single receipt
export const getReceipt = async (id: string) => {
  const response = await api.get(`/receipts/${id}`);
  return response.data;
};

// Create new receipt
export const createReceipt = async (receiptData: Partial<Receipt>) => {
  const response = await api.post('/receipts', receiptData);
  return response.data;
};

// Update receipt
export const updateReceipt = async (id: string, receiptData: Partial<Receipt>) => {
  const response = await api.put(`/receipts/${id}`, receiptData);
  return response.data;
};

// Process receipt (receive items)
export const processReceipt = async (id: string, items: any[]) => {
  const response = await api.post(`/receipts/${id}/process`, { items });
  return response.data;
};

// Cancel receipt
export const cancelReceipt = async (id: string, reason?: string) => {
  const response = await api.post(`/receipts/${id}/cancel`, { reason });
  return response.data;
};

// ==================== DELIVERIES ====================

export interface DeliveryFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Get all deliveries
export const getDeliveries = async (filters?: DeliveryFilters) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/deliveries?${params.toString()}`);
  return response.data;
};

// Get single delivery
export const getDelivery = async (id: string) => {
  const response = await api.get(`/deliveries/${id}`);
  return response.data;
};

// Create new delivery
export const createDelivery = async (deliveryData: Partial<Delivery>) => {
  const response = await api.post('/deliveries', deliveryData);
  return response.data;
};

// Update delivery
export const updateDelivery = async (id: string, deliveryData: Partial<Delivery>) => {
  const response = await api.put(`/deliveries/${id}`, deliveryData);
  return response.data;
};

// Process delivery (ship items)
export const processDelivery = async (id: string, items: any[]) => {
  const response = await api.post(`/deliveries/${id}/process`, { items });
  return response.data;
};

// Cancel delivery
export const cancelDelivery = async (id: string, reason?: string) => {
  const response = await api.post(`/deliveries/${id}/cancel`, { reason });
  return response.data;
};

// ==================== TRANSFERS ====================

export interface TransferFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Get all transfers
export const getTransfers = async (filters?: TransferFilters) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/transfers?${params.toString()}`);
  return response.data;
};

// Get single transfer
export const getTransfer = async (id: string) => {
  const response = await api.get(`/transfers/${id}`);
  return response.data;
};

// Create new transfer
export const createTransfer = async (transferData: any) => {
  const response = await api.post('/transfers', transferData);
  return response.data;
};

// Update transfer
export const updateTransfer = async (id: string, transferData: any) => {
  const response = await api.put(`/transfers/${id}`, transferData);
  return response.data;
};

// Process transfer
export const processTransfer = async (id: string, items: any[]) => {
  const response = await api.post(`/transfers/${id}/process`, { items });
  return response.data;
};

// Cancel transfer
export const cancelTransfer = async (id: string, reason?: string) => {
  const response = await api.post(`/transfers/${id}/cancel`, { reason });
  return response.data;
};

// ==================== STOCK ADJUSTMENTS ====================

export interface AdjustmentFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Get all adjustments
export const getAdjustments = async (filters?: AdjustmentFilters) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/adjustments?${params.toString()}`);
  return response.data;
};

// Get single adjustment
export const getAdjustment = async (id: string) => {
  const response = await api.get(`/adjustments/${id}`);
  return response.data;
};

// Create new adjustment (Manager only)
export const createAdjustment = async (adjustmentData: any) => {
  const response = await api.post('/adjustments', adjustmentData);
  return response.data;
};

// Process adjustment (Manager only)
export const processAdjustment = async (id: string, items: any[]) => {
  const response = await api.post(`/adjustments/${id}/process`, { items });
  return response.data;
};

// Cancel adjustment (Manager only)
export const cancelAdjustment = async (id: string, reason?: string) => {
  const response = await api.post(`/adjustments/${id}/cancel`, { reason });
  return response.data;
};

// ==================== MOVEMENT HISTORY ====================

export interface HistoryFilters {
  type?: string;
  productId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Get movement history
export const getMovementHistory = async (filters?: HistoryFilters) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await api.get(`/history?${params.toString()}`);
  return response.data;
};

// Get product movement history
export const getProductHistory = async (productId: string) => {
  const response = await api.get(`/history/product/${productId}`);
  return response.data;
};

// Get movement statistics
export const getMovementStats = async () => {
  const response = await api.get('/history/stats');
  return response.data;
};

export default {
  // Receipts
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  processReceipt,
  cancelReceipt,
  
  // Deliveries
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  processDelivery,
  cancelDelivery,
  
  // Transfers
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  processTransfer,
  cancelTransfer,
  
  // Adjustments
  getAdjustments,
  getAdjustment,
  createAdjustment,
  processAdjustment,
  cancelAdjustment,
  
  // History
  getMovementHistory,
  getProductHistory,
  getMovementStats,
};
