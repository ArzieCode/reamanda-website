// ============================================================
// Types — Auth & User Account
// ============================================================
export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  points: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  address?: UserAddress;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: UserAddress;
}
