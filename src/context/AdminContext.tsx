// ============================================================
// Context — AdminContext (CMS, Settings, Products & Live Edit)
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { GeneralSettings } from '../types/content';
import type { Product } from '../types/busana';
import type { Property } from '../types/properti';
import type { Order } from '../types/order';
import { contentService } from '../services/content';
import { productService } from '../services/products';
import { propertyService } from '../services/properti';
import { orderService } from '../services/orders';
import { resetAllDemoData } from '../services/backup';
import { useAuth } from './AuthContext';
import {
  INITIAL_KATERING_PACKAGES,
  INITIAL_KATERING_DISHES,
  type KateringPackageItem,
  type KateringDishItem,
} from '../data/katering';

export interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  isVisitorPreview: boolean;
  toggleVisitorPreview: () => void;
  settings: GeneralSettings;
  updateSettings: (s: Partial<GeneralSettings>) => void;
  products: Product[];
  refreshProducts: () => void;
  properties: Property[];
  refreshProperties: () => void;
  orders: Order[];
  refreshOrders: () => Promise<void>;
  resetAllData: () => Promise<void>;
  isDashboardOpen: boolean;
  openDashboard: () => void;
  closeDashboard: () => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;

  // Backward compatibility methods for existing inquiry modals & legacy pages
  packages: KateringPackageItem[];
  dishes: KateringDishItem[];
  updatePackage: (pkg: KateringPackageItem) => void;
  updateDish: (dish: KateringDishItem) => void;
  updateProperty: (prop: any) => void;
  updateOrderStatus: (orderId: string, status: any) => Promise<void>;
  addOrder: (order: any) => Promise<any>;
  login: (userOrPass: string, password?: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isStaff, hasPermission, login: authLogin, logout: authLogout } = useAuth();

  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    return localStorage.getItem('reamanda:edit_mode') === 'true';
  });

  const [isVisitorPreview, setIsVisitorPreview] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('ringkasan');

  const [settings, setSettings] = useState<GeneralSettings>(() => contentService.getSettings());
  const [products, setProducts] = useState<Product[]>(() => productService.getProducts());
  const [properties, setProperties] = useState<Property[]>(() => propertyService.getProperties());
  const [orders, setOrders] = useState<Order[]>([]);

  // Catering packages and dishes
  const [packages, setPackages] = useState<KateringPackageItem[]>(() => {
    try {
      const raw = localStorage.getItem('reamanda:katering_packages');
      return raw ? JSON.parse(raw) : INITIAL_KATERING_PACKAGES;
    } catch {
      return INITIAL_KATERING_PACKAGES;
    }
  });

  const [dishes, setDishes] = useState<KateringDishItem[]>(() => {
    try {
      const raw = localStorage.getItem('reamanda:katering_dishes');
      return raw ? JSON.parse(raw) : INITIAL_KATERING_DISHES;
    } catch {
      return INITIAL_KATERING_DISHES;
    }
  });

  const refreshProducts = useCallback(() => {
    setProducts(productService.getProducts());
  }, []);

  const refreshProperties = useCallback(() => {
    setProperties(propertyService.getProperties());
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const list = await orderService.getOrders();
      setOrders(list);
    } catch (err) {
      console.error('Failed to refresh orders:', err);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const toggleEditMode = () => {
    if (!hasPermission('EDIT_CONTENT')) return;
    setIsEditMode((prev) => {
      const next = !prev;
      localStorage.setItem('reamanda:edit_mode', String(next));
      if (next) setIsVisitorPreview(false);
      return next;
    });
  };

  const toggleVisitorPreview = () => {
    setIsVisitorPreview((prev) => !prev);
  };

  const updateSettings = (s: Partial<GeneralSettings>) => {
    const updated = contentService.updateSettings(s);
    setSettings(updated);
  };

  const updatePackage = (pkg: KateringPackageItem) => {
    setPackages((prev) => {
      const idx = prev.findIndex((p) => p.id === pkg.id);
      let nextList = [...prev];
      if (idx !== -1) {
        nextList[idx] = pkg;
      } else {
        nextList.push(pkg);
      }
      localStorage.setItem('reamanda:katering_packages', JSON.stringify(nextList));
      return nextList;
    });
  };

  const updateDish = (dish: KateringDishItem) => {
    setDishes((prev) => {
      const idx = prev.findIndex((d) => d.id === dish.id);
      let nextList = [...prev];
      if (idx !== -1) {
        nextList[idx] = dish;
      } else {
        nextList.push(dish);
      }
      localStorage.setItem('reamanda:katering_dishes', JSON.stringify(nextList));
      return nextList;
    });
  };

  const updateProperty = (prop: any) => {
    propertyService.saveProperty(prop);
    refreshProperties();
  };

  const updateOrderStatus = async (orderId: string, status: any) => {
    await orderService.updateOrderStatus(orderId, status);
    await refreshOrders();
  };

  const addOrder = async (order: any) => {
    const created = await orderService.createOrder(order);
    await refreshOrders();
    return created;
  };

  const resetAllData = async () => {
    await resetAllDemoData();
    setSettings(contentService.getSettings());
    refreshProducts();
    refreshProperties();
    await refreshOrders();
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin: isStaff,
        isEditMode: isStaff && isEditMode && !isVisitorPreview,
        toggleEditMode,
        isVisitorPreview,
        toggleVisitorPreview,
        settings,
        updateSettings,
        products,
        refreshProducts,
        properties,
        refreshProperties,
        orders,
        refreshOrders,
        resetAllData,
        isDashboardOpen,
        openDashboard: () => setIsDashboardOpen(true),
        closeDashboard: () => setIsDashboardOpen(false),
        activeAdminTab,
        setActiveAdminTab,
        packages,
        dishes,
        updatePackage,
        updateDish,
        updateProperty,
        updateOrderStatus,
        addOrder,
        login: (_u: string, _p?: string) => true,
        logout: authLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
