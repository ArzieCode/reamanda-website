// ============================================================
// Service — Unified AuthService (Interface & Local Implementation)
// ============================================================
import type {
  User,
  Session,
  LoginResult,
  RegisterInput,
  StaffCreateInput,
  StaffUpdateInput,
  UserRole,
  StaffRole,
  UserAddress,
} from '../types/auth';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  generateTemporaryPassword,
} from './crypto';
import { logActivity } from './activity';
import { createDemoUsers } from './seed';

const STORAGE_KEY_USERS = 'reamanda:users_db';
const STORAGE_KEY_SESSION = 'reamanda:auth_session';
const STORAGE_KEY_REMEMBER = 'reamanda:auth_remember';

export interface IAuthService {
  getCurrentSession(): Session | null;
  getCurrentUser(): Promise<User | null>;
  login(email: string, passwordAttempt: string, rememberMe?: boolean): Promise<LoginResult>;
  logout(): void;
  registerCustomer(input: RegisterInput): Promise<{ success: boolean; user?: User; errorMessage?: string }>;
  requestPasswordReset(email: string): Promise<{ success: boolean; resetCode?: string; errorMessage?: string }>;
  resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<{ success: boolean; errorMessage?: string }>;
  updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>): Promise<User>;
  changePassword(userId: string, oldPass: string, newPass: string): Promise<{ success: boolean; errorMessage?: string }>;
  // Address Book CRUD
  addAddress(userId: string, address: Omit<UserAddress, 'id'>): Promise<UserAddress>;
  updateAddress(userId: string, address: UserAddress): Promise<UserAddress>;
  deleteAddress(userId: string, addressId: string): Promise<void>;
  setDefaultAddress(userId: string, addressId: string): Promise<void>;
  // Staff Account Management (Owner only)
  getStaffAccounts(query?: string): Promise<User[]>;
  createStaffAccount(input: StaffCreateInput, performedBy: User): Promise<User>;
  updateStaffAccount(input: StaffUpdateInput, performedBy: User): Promise<User>;
  resetStaffPassword(staffId: string, performedBy: User): Promise<string>;
  deleteStaffAccount(staffId: string, performedBy: User): Promise<void>;
  // Customers list
  getCustomers(query?: string): Promise<User[]>;
  getCustomerById(id: string): Promise<User | null>;
  setCustomerStatus(customerId: string, isActive: boolean, performedBy: User): Promise<User>;
  updateCustomerNotes(customerId: string, notes: string, performedBy: User): Promise<User>;
  // Permission checks
  hasPermission(role: UserRole | undefined, action: AuthAction): boolean;
}

export type AuthAction =
  | 'VIEW_REVENUE'
  | 'MANAGE_STAFF'
  | 'EDIT_CONTENT'
  | 'MANAGE_PRODUCTS'
  | 'DELETE_RECORDS'
  | 'MANAGE_ORDERS'
  | 'MANAGE_INQUIRIES'
  | 'MANAGE_CUSTOMERS'
  | 'SYSTEM_SETTINGS';

export class LocalAuthService implements IAuthService {
  private usersCache: User[] | null = null;

  private async getUsers(): Promise<User[]> {
    if (this.usersCache) return this.usersCache;
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) {
      try {
        this.usersCache = JSON.parse(raw);
        return this.usersCache!;
      } catch {
        // Fall back to seed
      }
    }
    const seeded = await createDemoUsers();
    this.saveUsers(seeded);
    return seeded;
  }

  private saveUsers(users: User[]): void {
    this.usersCache = users;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  public getCurrentSession(): Session | null {
    // 1. Check sessionStorage first
    const sessionRaw = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionRaw) {
      try {
        const session: Session = JSON.parse(sessionRaw);
        if (new Date(session.expiresAt).getTime() > Date.now()) {
          return session;
        }
        sessionStorage.removeItem(STORAGE_KEY_SESSION);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY_SESSION);
      }
    }

    // 2. Check localStorage remember me token
    const rememberRaw = localStorage.getItem(STORAGE_KEY_REMEMBER);
    if (rememberRaw) {
      try {
        const session: Session = JSON.parse(rememberRaw);
        if (new Date(session.expiresAt).getTime() > Date.now()) {
          // Re-populate session storage
          sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
          return session;
        }
        localStorage.removeItem(STORAGE_KEY_REMEMBER);
      } catch {
        localStorage.removeItem(STORAGE_KEY_REMEMBER);
      }
    }

    return null;
  }

  public async getCurrentUser(): Promise<User | null> {
    const session = this.getCurrentSession();
    if (!session) return null;
    const users = await this.getUsers();
    return users.find((u) => u.id === session.userId) || null;
  }

  public async login(email: string, passwordAttempt: string, rememberMe = false): Promise<LoginResult> {
    const users = await this.getUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (userIndex === -1) {
      return { success: false, errorMessage: 'Surel atau kata sandi tidak sesuai.' };
    }

    const user = users[userIndex];

    // Check account status
    if (!user.isActive) {
      return { success: false, errorMessage: 'Akun Anda dinonaktifkan. Silakan hubungi pihak pengelola.' };
    }

    // Check brute force lock (5 attempts -> 5 minutes)
    if (user.lockedUntil) {
      const lockTime = new Date(user.lockedUntil).getTime();
      const remainingMs = lockTime - Date.now();
      if (remainingMs > 0) {
        const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
        return {
          success: false,
          isLocked: true,
          lockRemainingMinutes: remainingMinutes,
          errorMessage: `Akun terkunci sementara demi keamanan karena 5 kali salah kata sandi. Silakan tunggu ${remainingMinutes} menit.`,
        };
      } else {
        // Lock expired
        user.lockedUntil = null;
        user.failedLoginAttempts = 0;
      }
    }

    // Check password
    const isMatch = await verifyPassword(passwordAttempt, user.salt, user.passwordHash);

    // Also check temporary password if set by admin
    const isTempMatch = user.temporaryPassword && passwordAttempt === user.temporaryPassword;

    if (!isMatch && !isTempMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      let isLocked = false;
      let lockRemainingMinutes = 0;

      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes lock
        isLocked = true;
        lockRemainingMinutes = 5;
        logActivity({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'ACCOUNT_LOCKED',
          entityType: 'auth',
          entityId: user.id,
          entityName: user.email,
          details: 'Akun terkunci 5 menit akibat 5 kali kegagalan autentikasi.',
        });
      }

      users[userIndex] = user;
      this.saveUsers(users);

      return {
        success: false,
        isLocked,
        lockRemainingMinutes,
        errorMessage: isLocked
          ? 'Akun terkunci selama 5 menit karena telah 5 kali salah memasukkan kata sandi.'
          : `Kata sandi tidak tepat. Sisa percobaan: ${5 - user.failedLoginAttempts}.`,
      };
    }

    // Login success: reset counters
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date().toISOString();
    if (isTempMatch) {
      // Clear temporary password once used
      user.temporaryPassword = null;
    }
    users[userIndex] = user;
    this.saveUsers(users);

    // Create session (24h or 30 days)
    const durationMs = rememberMe ? 30 * 86400000 : 24 * 3600000;
    const session: Session = {
      token: `token-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      expiresAt: new Date(Date.now() + durationMs).toISOString(),
    };

    sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_REMEMBER, JSON.stringify(session));
    }

    // Set admin legacy flag for compatibility
    if (user.role === 'owner' || user.role === 'admin' || user.role === 'staf') {
      localStorage.setItem('reamanda:admin_session', 'true');
    }

    logActivity({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'LOGIN_SUCCESS',
      entityType: 'auth',
      entityId: user.id,
      entityName: user.email,
      details: `Pengguna berhasil masuk (${user.role}).`,
    });

    return { success: true, user, session };
  }

  public logout(): void {
    const session = this.getCurrentSession();
    if (session) {
      logActivity({
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        action: 'LOGOUT',
        entityType: 'auth',
        entityId: session.userId,
        entityName: session.email,
        details: 'Pengguna keluar dari sesi.',
      });
    }
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem(STORAGE_KEY_REMEMBER);
    localStorage.removeItem('reamanda:admin_session');
  }

  public async registerCustomer(input: RegisterInput): Promise<{ success: boolean; user?: User; errorMessage?: string }> {
    if (!input.name.trim() || !input.email.trim() || !input.phone.trim() || !input.password) {
      return { success: false, errorMessage: 'Semua kolom wajib diisi dengan benar.' };
    }
    if (input.password.length < 8) {
      return { success: false, errorMessage: 'Kata sandi minimal 8 karakter.' };
    }
    if (!input.agreePolicy) {
      return { success: false, errorMessage: 'Anda harus menyetujui kebijakan privasi dan ketentuan layanan.' };
    }

    const users = await this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
      return { success: false, errorMessage: 'Alamat surel sudah terdaftar dalam sistem.' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(input.password, salt);

    const newUser: User = {
      id: `cust-${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      role: 'customer',
      isActive: true,
      passwordHash,
      salt,
      failedLoginAttempts: 0,
      lockedUntil: null,
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Auto login
    await this.login(newUser.email, input.password, false);

    return { success: true, user: newUser };
  }

  public async requestPasswordReset(email: string): Promise<{ success: boolean; resetCode?: string; errorMessage?: string }> {
    const users = await this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, errorMessage: 'Alamat surel tidak ditemukan.' };
    }
    // Generate 6-digit demo code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Save to user object temporarily
    user.temporaryPassword = resetCode;
    this.saveUsers(users);

    return { success: true, resetCode };
  }

  public async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<{ success: boolean; errorMessage?: string }> {
    if (newPassword.length < 8) {
      return { success: false, errorMessage: 'Kata sandi baru minimal 8 karakter.' };
    }
    const users = await this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.temporaryPassword !== code.trim()) {
      return { success: false, errorMessage: 'Kode verifikasi tidak valid.' };
    }

    const salt = generateSalt();
    user.passwordHash = await hashPassword(newPassword, salt);
    user.salt = salt;
    user.temporaryPassword = null;
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    this.saveUsers(users);

    return { success: true };
  }

  public async updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>): Promise<User> {
    const users = await this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Pengguna tidak ditemukan.');
    const updated = { ...users[idx], ...data };
    users[idx] = updated;
    this.saveUsers(users);
    return updated;
  }

  public async changePassword(userId: string, oldPass: string, newPass: string): Promise<{ success: boolean; errorMessage?: string }> {
    if (newPass.length < 8) {
      return { success: false, errorMessage: 'Kata sandi baru minimal 8 karakter.' };
    }
    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, errorMessage: 'Pengguna tidak ditemukan.' };

    const ok = await verifyPassword(oldPass, user.salt, user.passwordHash);
    if (!ok) return { success: false, errorMessage: 'Kata sandi saat ini tidak tepat.' };

    const newSalt = generateSalt();
    user.passwordHash = await hashPassword(newPass, newSalt);
    user.salt = newSalt;
    this.saveUsers(users);
    return { success: true };
  }

  public async addAddress(userId: string, address: Omit<UserAddress, 'id'>): Promise<UserAddress> {
    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('Pengguna tidak ditemukan.');

    const newAddr: UserAddress = {
      ...address,
      id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    if (!user.addresses) user.addresses = [];
    if (newAddr.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    } else if (user.addresses.length === 0) {
      newAddr.isDefault = true;
    }
    user.addresses.push(newAddr);
    this.saveUsers(users);
    return newAddr;
  }

  public async updateAddress(userId: string, address: UserAddress): Promise<UserAddress> {
    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user || !user.addresses) throw new Error('Pengguna tidak ditemukan.');

    if (address.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    const idx = user.addresses.findIndex((a) => a.id === address.id);
    if (idx !== -1) {
      user.addresses[idx] = address;
    }
    this.saveUsers(users);
    return address;
  }

  public async deleteAddress(userId: string, addressId: string): Promise<void> {
    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user || !user.addresses) return;
    user.addresses = user.addresses.filter((a) => a.id !== addressId);
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    this.saveUsers(users);
  }

  public async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user || !user.addresses) return;
    user.addresses.forEach((a) => {
      a.isDefault = a.id === addressId;
    });
    this.saveUsers(users);
  }

  public async getStaffAccounts(query?: string): Promise<User[]> {
    const users = await this.getUsers();
    const staff = users.filter((u) => u.role === 'owner' || u.role === 'admin' || u.role === 'staf');
    if (!query || !query.trim()) return staff;
    const q = query.toLowerCase();
    return staff.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.role.includes(q));
  }

  public async createStaffAccount(input: StaffCreateInput, performedBy: User): Promise<User> {
    if (!this.hasPermission(performedBy.role, 'MANAGE_STAFF')) {
      throw new Error('Hanya Owner yang berhak menambah akun staf.');
    }
    if (input.initialPassword.length < 8) {
      throw new Error('Kata sandi awal minimal 8 karakter.');
    }

    const users = await this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
      throw new Error('Alamat surel sudah digunakan.');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(input.initialPassword, salt);

    const newStaff: User = {
      id: `staff-${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || '',
      role: input.role,
      isActive: true,
      passwordHash,
      salt,
      failedLoginAttempts: 0,
      lockedUntil: null,
      createdAt: new Date().toISOString(),
    };

    users.push(newStaff);
    this.saveUsers(users);

    logActivity({
      userId: performedBy.id,
      userName: performedBy.name,
      userRole: performedBy.role,
      action: 'ADD_STAFF',
      entityType: 'user',
      entityId: newStaff.id,
      entityName: newStaff.name,
      details: `Menambahkan staf baru: ${newStaff.name} (${newStaff.role}).`,
      afterState: { role: newStaff.role, email: newStaff.email },
    });

    return newStaff;
  }

  public async updateStaffAccount(input: StaffUpdateInput, performedBy: User): Promise<User> {
    if (!this.hasPermission(performedBy.role, 'MANAGE_STAFF')) {
      throw new Error('Hanya Owner yang berhak menyunting akun staf.');
    }

    const users = await this.getUsers();
    const targetIndex = users.findIndex((u) => u.id === input.id);
    if (targetIndex === -1) throw new Error('Akun staf tidak ditemukan.');

    const target = users[targetIndex];
    const beforeState = { role: target.role, isActive: target.isActive };

    // Safety constraint: an owner cannot demote the last remaining owner or themselves
    if (target.role === 'owner') {
      const activeOwners = users.filter((u) => u.role === 'owner' && u.isActive);
      if (input.role && input.role !== 'owner') {
        if (target.id === performedBy.id) {
          throw new Error('Anda tidak dapat menurunkan peran (demote) akun Anda sendiri.');
        }
        if (activeOwners.length <= 1) {
          throw new Error('Tidak dapat mengubah peran owner terakhir.');
        }
      }
      if (input.isActive === false) {
        if (target.id === performedBy.id) {
          throw new Error('Anda tidak dapat menonaktifkan akun Anda sendiri.');
        }
        if (activeOwners.length <= 1) {
          throw new Error('Tidak dapat menonaktifkan owner terakhir.');
        }
      }
    }

    const updated: User = {
      ...target,
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.email ? { email: input.email.trim().toLowerCase() } : {}),
      ...(input.phone !== undefined ? { phone: input.phone.trim() } : {}),
      ...(input.role ? { role: input.role } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    };

    users[targetIndex] = updated;
    this.saveUsers(users);

    logActivity({
      userId: performedBy.id,
      userName: performedBy.name,
      userRole: performedBy.role,
      action: 'UPDATE_STAFF',
      entityType: 'user',
      entityId: updated.id,
      entityName: updated.name,
      details: `Memperbarui akun staf: ${updated.name}.`,
      beforeState,
      afterState: { role: updated.role, isActive: updated.isActive },
    });

    return updated;
  }

  public async resetStaffPassword(staffId: string, performedBy: User): Promise<string> {
    if (!this.hasPermission(performedBy.role, 'MANAGE_STAFF')) {
      throw new Error('Hanya Owner yang berhak mereset kata sandi staf.');
    }

    const users = await this.getUsers();
    const staff = users.find((u) => u.id === staffId);
    if (!staff) throw new Error('Akun staf tidak ditemukan.');

    const tempPassword = generateTemporaryPassword();
    staff.temporaryPassword = tempPassword;
    staff.failedLoginAttempts = 0;
    staff.lockedUntil = null;
    this.saveUsers(users);

    logActivity({
      userId: performedBy.id,
      userName: performedBy.name,
      userRole: performedBy.role,
      action: 'RESET_STAFF_PASSWORD',
      entityType: 'user',
      entityId: staff.id,
      entityName: staff.name,
      details: `Mereset kata sandi staf: ${staff.name}. Memberikan kata sandi sementara.`,
    });

    return tempPassword;
  }

  public async deleteStaffAccount(staffId: string, performedBy: User): Promise<void> {
    if (!this.hasPermission(performedBy.role, 'MANAGE_STAFF')) {
      throw new Error('Hanya Owner yang berhak menghapus akun staf.');
    }

    const users = await this.getUsers();
    const target = users.find((u) => u.id === staffId);
    if (!target) throw new Error('Akun staf tidak ditemukan.');

    // Safety checks
    if (target.id === performedBy.id) {
      throw new Error('Anda tidak dapat menghapus akun Anda sendiri.');
    }
    if (target.role === 'owner') {
      const owners = users.filter((u) => u.role === 'owner');
      if (owners.length <= 1) {
        throw new Error('Tidak dapat menghapus owner terakhir yang tersisa.');
      }
    }

    const filtered = users.filter((u) => u.id !== staffId);
    this.saveUsers(filtered);

    logActivity({
      userId: performedBy.id,
      userName: performedBy.name,
      userRole: performedBy.role,
      action: 'DELETE_STAFF',
      entityType: 'user',
      entityId: target.id,
      entityName: target.name,
      details: `Menghapus akun staf: ${target.name} (${target.role}).`,
      beforeState: { name: target.name, email: target.email, role: target.role },
    });
  }

  public async getCustomers(query?: string): Promise<User[]> {
    const users = await this.getUsers();
    const customers = users.filter((u) => u.role === 'customer');
    if (!query || !query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
  }

  public async getCustomerById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find((u) => u.id === id) || null;
  }

  public async setCustomerStatus(customerId: string, isActive: boolean, performedBy: User): Promise<User> {
    if (!this.hasPermission(performedBy.role, 'MANAGE_CUSTOMERS')) {
      throw new Error('Anda tidak memiliki izin mengelola pelanggan.');
    }
    const users = await this.getUsers();
    const customer = users.find((u) => u.id === customerId);
    if (!customer) throw new Error('Pelanggan tidak ditemukan.');

    customer.isActive = isActive;
    this.saveUsers(users);

    logActivity({
      userId: performedBy.id,
      userName: performedBy.name,
      userRole: performedBy.role,
      action: isActive ? 'ENABLE_CUSTOMER' : 'DISABLE_CUSTOMER',
      entityType: 'user',
      entityId: customer.id,
      entityName: customer.name,
      details: `${isActive ? 'Mengaktifkan' : 'Menonaktifkan'} akun pelanggan: ${customer.name}.`,
    });

    return customer;
  }

  public async updateCustomerNotes(customerId: string, notes: string, performedBy: User): Promise<User> {
    if (!this.hasPermission(performedBy.role, 'MANAGE_CUSTOMERS')) {
      throw new Error('Anda tidak memiliki izin.');
    }
    const users = await this.getUsers();
    const customer = users.find((u) => u.id === customerId);
    if (!customer) throw new Error('Pelanggan tidak ditemukan.');
    customer.notes = notes;
    this.saveUsers(users);
    return customer;
  }

  /**
   * Service-layer Role-based Access Control (RBAC)
   * Enforced in service layer, not just in UI!
   */
  public hasPermission(role: UserRole | undefined, action: AuthAction): boolean {
    if (!role) return false;

    // Owner: everything
    if (role === 'owner') return true;

    // Admin: edit content, manage products, orders, inquiries, bids, customers; NO manage staff, NO view revenue
    if (role === 'admin') {
      switch (action) {
        case 'VIEW_REVENUE':
          return false; // Spec: Admin sees counts, only Owner sees revenue
        case 'MANAGE_STAFF':
          return false; // Spec: Owner only
        case 'SYSTEM_SETTINGS':
          return true;
        case 'EDIT_CONTENT':
        case 'MANAGE_PRODUCTS':
        case 'DELETE_RECORDS':
        case 'MANAGE_ORDERS':
        case 'MANAGE_INQUIRIES':
        case 'MANAGE_CUSTOMERS':
          return true;
        default:
          return false;
      }
    }

    // Staf: orders and inquiries only; no revenue figures, no deletes, no content editing
    if (role === 'staf') {
      switch (action) {
        case 'MANAGE_ORDERS':
        case 'MANAGE_INQUIRIES':
          return true;
        default:
          return false;
      }
    }

    return false;
  }
}

export const authService = new LocalAuthService();
