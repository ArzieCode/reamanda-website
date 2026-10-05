// ============================================================
// Context — Wishlist (Daftar Keinginan)
// Persisted in localStorage with try/catch
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types/busana';
import { useToast } from './ToastContext';

interface WishlistContextValue {
  items: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  toggleWishlistDrawer: (open?: boolean) => void;
}

const WISHLIST_STORAGE_KEY = 'riamiranda_wishlist';

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save wishlist:', err);
    }
  }, [items]);

  const isInWishlist = (productId: string) => items.some((p) => p.id === productId);

  const toggleWishlist = (product: Product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`"${product.name}" dihapus dari Wishlist.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`"${product.name}" ditambahkan ke Wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => {
      const removed = prev.find((p) => p.id === productId);
      if (removed) {
        showToast(`"${removed.name}" dihapus dari Wishlist.`, 'info');
      }
      return prev.filter((p) => p.id !== productId);
    });
  };

  const toggleWishlistDrawer = (open?: boolean) => {
    setIsWishlistOpen((prev) => (open !== undefined ? open : !prev));
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        isWishlistOpen,
        toggleWishlistDrawer,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
