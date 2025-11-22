import api, { setAuthToken, setUserData, clearAuthData } from './api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'inventory_manager' | 'warehouse_staff';
}

export interface RequestOTPRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// Login
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  
  if (response.data.success && response.data.data) {
    setAuthToken(response.data.data.token);
    setUserData(response.data.data.user);
  }
  
  return response.data;
};

// Register (Manager only can create staff)
export const register = async (userData: RegisterRequest) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Request OTP for password reset
export const requestOTP = async (data: RequestOTPRequest) => {
  const response = await api.post('/auth/request-otp', data);
  return response.data;
};

// Verify OTP
export const verifyOTP = async (data: VerifyOTPRequest) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

// Reset password
export const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Get all warehouse staff (Manager only)
export const getWarehouseStaff = async () => {
  const response = await api.get('/auth/staff');
  return response.data;
};

// Update staff status (Manager only)
export const updateStaffStatus = async (staffId: string, isActive: boolean) => {
  const response = await api.put(`/auth/staff/${staffId}/status`, { isActive });
  return response.data;
};

// Delete staff (Manager only)
export const deleteStaff = async (staffId: string) => {
  const response = await api.delete(`/auth/staff/${staffId}`);
  return response.data;
};

// Logout
export const logout = () => {
  clearAuthData();
};

export default {
  login,
  register,
  requestOTP,
  verifyOTP,
  resetPassword,
  getCurrentUser,
  getWarehouseStaff,
  updateStaffStatus,
  deleteStaff,
  logout,
};
