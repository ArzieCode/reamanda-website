// ============================================================
// Cart Context — Persisted in localStorage with vouchers & shipping
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product, Voucher } from '../types/busana';
import { vouchers as mockVouchers } from '../data/busana';
import { useToast } from './ToastContext';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  appliedVoucher: Voucher | null;
  toggleCart: (open?: boolean) => void;
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  dispatch: (action: any) => void; // for backward compatibility
  state: { items: CartItem[]; isOpen: boolean }; // for backward compatibility
}

const CART_STORAGE_KEY = 'riamiranda_cart_items';
const CART_VOUCHER_KEY = 'riamiranda_cart_voucher';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(() => {
    try {
      const raw = localStorage.getItem(CART_VOUCHER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart items:', err);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedVoucher) {
        localStorage.setItem(CART_VOUCHER_KEY, JSON.stringify(appliedVoucher));
      } else {
        localStorage.removeItem(CART_VOUCHER_KEY);
      }
    } catch {
      // fallback
    }
  }, [appliedVoucher]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
    0
  );

  // Calculate discount
  let discount = 0;
  if (appliedVoucher) {
    if (subtotal >= appliedVoucher.minPurchase) {
      discount = appliedVoucher.discount;
    }
  }

  // Shipping is free if subtotal >= 500.000 or with POINTFREEONGKIR
  const shippingCost = items.length === 0 ? 0 : subtotal >= 500000 || appliedVoucher?.code === 'POINTFREEONGKIR' ? 0 : 25000;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const toggleCart = (open?: boolean) => {
    setIsOpen((prev) => (open !== undefined ? open : !prev));
  };

  const addItem = (product: Product, size: string, color: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, size, color, quantity }];
    });
    showToast(`"${product.name}" (${size}, ${color}) ditambahkan ke keranjang.`, 'success');
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && i.size === size && i.color === color)
      )
    );
    showToast('Produk dihapus dari keranjang.', 'info');
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedVoucher(null);
  };

  const applyVoucher = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = mockVouchers.find((v) => v.code === cleanCode);

    if (!found) {
      const msg = 'Kode voucher tidak valid atau sudah kedaluwarsa.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (subtotal < found.minPurchase) {
      const msg = `Minimal belanja untuk voucher ini adalah Rp ${found.minPurchase.toLocaleString('id-ID')}.`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    setAppliedVoucher(found);
    const msg = `Voucher ${found.code} berhasil digunakan! Potongan Rp ${found.discount.toLocaleString('id-ID')}.`;
    showToast(msg, 'success');
    return { success: true, message: msg };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher dihapus.', 'info');
  };

  // Backwards compatibility dispatch for components that still use it
  const dispatch = (action: any) => {
    if (action.type === 'ADD_ITEM') {
      addItem(action.payload.product, action.payload.size, action.payload.color);
    } else if (action.type === 'REMOVE_ITEM') {
      removeItem(action.payload.productId, action.payload.size, action.payload.color);
    } else if (action.type === 'UPDATE_QUANTITY') {
      updateQuantity(action.payload.productId, action.payload.size, action.payload.color, action.payload.quantity);
    } else if (action.type === 'CLEAR_CART') {
      clearCart();
    } else if (action.type === 'TOGGLE_CART') {
      toggleCart(action.payload);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        subtotal,
        discount,
        shippingCost,
        total,
        appliedVoucher,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyVoucher,
        removeVoucher,
        dispatch,
        state: { items, isOpen },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
