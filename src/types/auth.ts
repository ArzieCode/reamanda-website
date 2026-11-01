// ============================================================
// Types — Auth, Roles & Accounts
// ============================================================

export type StaffRole = 'owner' | 'admin' | 'staf';
export type CustomerRole = 'customer';
export type UserRole = StaffRole | CustomerRole;

export interface UserAddress {
  id: string;
  label: string; // e.g. "Rumah", "Kantor"
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  passwordHash: string; // PBKDF2 hash
  salt: string; // per-user salt
  failedLoginAttempts: number;
  lockedUntil?: string | null; // ISO timestamp if locked
  temporaryPassword?: string | null; // For reset password display
  addresses?: UserAddress[];
  notes?: string; // Internal admin note about customer
  createdAt: string;
  lastLoginAt?: string;
}

export interface Session {
  token: string;
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  expiresAt: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  session?: Session;
  errorMessage?: string;
  isLocked?: boolean;
  lockRemainingMinutes?: number;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  agreePolicy: boolean;
}

export interface StaffCreateInput {
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  initialPassword: string;
}

export interface StaffUpdateInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: StaffRole;
  isActive?: boolean;
}
