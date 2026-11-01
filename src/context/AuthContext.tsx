// ============================================================
// Context — AuthContext (Session, Current User & RBAC)
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Session, LoginResult, RegisterInput } from '../types/auth';
import { authService, type AuthAction } from '../services/auth';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoading: boolean;
  isStaff: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isStaf: boolean;
  isCustomer: boolean;
  login: (email: string, pass: string, remember?: boolean) => Promise<LoginResult>;
  logout: () => void;
  register: (input: RegisterInput) => Promise<{ success: boolean; user?: User; errorMessage?: string }>;
  refreshUser: () => Promise<void>;
  hasPermission: (action: AuthAction) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(() => authService.getCurrentSession());
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      setSession(authService.getCurrentSession());
    } catch (err) {
      console.error('Failed to load current user:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, pass: string, remember = false): Promise<LoginResult> => {
    const result = await authService.login(email, pass, remember);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      setSession(result.session || null);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setSession(null);
  };

  const register = async (input: RegisterInput) => {
    const res = await authService.registerCustomer(input);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setSession(authService.getCurrentSession());
    }
    return res;
  };

  const hasPermission = (action: AuthAction): boolean => {
    return authService.hasPermission(currentUser?.role, action);
  };

  const role = currentUser?.role;
  const isOwner = role === 'owner';
  const isAdmin = role === 'admin';
  const isStaf = role === 'staf';
  const isStaff = isOwner || isAdmin || isStaf;
  const isCustomer = role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        isLoading,
        isStaff,
        isOwner,
        isAdmin,
        isStaf,
        isCustomer,
        login,
        logout,
        register,
        refreshUser,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
