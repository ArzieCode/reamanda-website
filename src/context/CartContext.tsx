// ============================================================
// Cart Context — in-memory state, no persistence
// ============================================================
import React, { createContext, useContext, useReducer } from 'react';
import type { CartItem, Product } from '../types/busana';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string; color: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string; color: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload?: boolean };

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, color } = action.payload;
      const existing = state.items.find(
        (i) => i.product.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === product.id && i.size === size && i.color === color
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product, size, color, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) =>
            !(
              i.product.id === action.payload.productId &&
              i.size === action.payload.size &&
              i.color === action.payload.color
            )
        ),
      };
    case 'UPDATE_QUANTITY': {
      const { productId, size, color, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === productId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen,
      };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
