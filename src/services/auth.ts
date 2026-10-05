// ============================================================
// Services — Authentication & Profile
// ============================================================
import type { User, LoginCredentials, RegisterData } from '../types/auth';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const AUTH_STORAGE_KEY = 'riamiranda_auth_user';

const defaultUser: User = {
  id: 'usr_001',
  name: 'Indria Miranda',
  email: 'indria@riamiranda.com',
  phone: '081234567890',
  role: 'customer',
  points: 1250,
  tier: 'Gold',
  createdAt: '2023-01-15',
};

export async function getCurrentUser(): Promise<User | null> {
  await delay(100);
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read auth user from localStorage:', err);
    return null;
  }
}

export async function login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
  await delay(400);
  if (!credentials.email || !credentials.email.includes('@')) {
    return { success: false, error: 'Masukkan alamat email yang valid.' };
  }

  // Find or create active session
  let user: User;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      user = JSON.parse(raw);
      user.email = credentials.email;
    } else {
      user = {
        ...defaultUser,
        email: credentials.email,
        name: credentials.email.split('@')[0].toUpperCase(),
      };
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  } catch {
    return { success: true, user: defaultUser };
  }
}

export async function register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
  await delay(500);
  if (!data.name || data.name.trim().length < 2) {
    return { success: false, error: 'Nama lengkap wajib diisi minimal 2 karakter.' };
  }
  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'Alamat email tidak valid.' };
  }
  if (!data.phone || data.phone.length < 8) {
    return { success: false, error: 'Nomor telepon tidak valid.' };
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'customer',
    points: 100, // 100 bonus welcome points
    tier: 'Silver',
    createdAt: new Date().toISOString().split('T')[0],
  };

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  } catch (err) {
    console.error('Failed to save registered user:', err);
  }

  return { success: true, user: newUser };
}

export async function logout(): Promise<void> {
  await delay(150);
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to remove auth user:', err);
  }
}

export async function updateProfile(data: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
  await delay(300);
  try {
    const current = await getCurrentUser();
    if (!current) return { success: false, error: 'Pengguna tidak ditemukan.' };
    const updated = { ...current, ...data };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, user: updated };
  } catch {
    return { success: false, error: 'Gagal memperbarui profil.' };
  }
}

export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  await delay(400);
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Masukkan alamat email yang terdaftar.' };
  }
  return { success: true };
}
