import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRAND } from '../config/brand';
import type { BusanaProduct } from '../data/busana';
import { INITIAL_BUSANA_PRODUCTS } from '../data/busana';
import type { PropertyListing } from '../data/properti';
import { INITIAL_PROPERTIES } from '../data/properti';
import type { KateringPackageItem, KateringDishItem } from '../data/katering';
import { INITIAL_KATERING_PACKAGES, INITIAL_KATERING_DISHES } from '../data/katering';

export interface SiteSettings {
  announcement: string;
  whatsappNumber: string; // e.g. "6281234567890"
  companyEmail: string;
  officeAddress: string;
}

export interface StoredOrder {
  id: string;
  type: 'busana' | 'properti' | 'katering';
  createdAt: string;
  customerName: string;
  whatsapp: string;
  summary: string;
  totalAmountFormatted: string;
  status: 'Menunggu' | 'Dikonfirmasi' | 'Selesai' | 'Dibatalkan';
  itemsOrDetails: any;
}

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  toggleEditMode: () => void;
  settings: SiteSettings;
  updateSettings: (s: Partial<SiteSettings>) => void;
  products: BusanaProduct[];
  updateProduct: (p: BusanaProduct) => void;
  properties: PropertyListing[];
  updateProperty: (p: PropertyListing) => void;
  packages: KateringPackageItem[];
  updatePackage: (pkg: KateringPackageItem) => void;
  dishes: KateringDishItem[];
  updateDish: (d: KateringDishItem) => void;
  orders: StoredOrder[];
  addOrder: (order: Omit<StoredOrder, 'id' | 'createdAt' | 'status'>) => string;
  updateOrderStatus: (id: string, status: StoredOrder['status']) => void;
  deleteOrder: (id: string) => void;
  resetAllData: () => void;
  isDashboardOpen: boolean;
  openDashboard: () => void;
  closeDashboard: () => void;
}

const DEFAULT_SETTINGS: SiteSettings = {
  announcement: 'KOLEKSI RAYA BERSAMA 2025 KINI HADIR · PENGIRIMAN GRATIS KE SELURUH INDONESIA',
  whatsappNumber: '6281234567890',
  companyEmail: `editorial@${BRAND.slug}.com`,
  officeAddress: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190',
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('reamanda:admin_session') === 'true';
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('reamanda:site_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [products, setProducts] = useState<BusanaProduct[]>(() => {
    try {
      const saved = localStorage.getItem('reamanda:busana_products');
      return saved ? JSON.parse(saved) : INITIAL_BUSANA_PRODUCTS;
    } catch {
      return INITIAL_BUSANA_PRODUCTS;
    }
  });

  const [properties, setProperties] = useState<PropertyListing[]>(() => {
    try {
      const saved = localStorage.getItem('reamanda:properties');
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [packages, setPackages] = useState<KateringPackageItem[]>(() => {
    try {
      const saved = localStorage.getItem('reamanda:packages');
      return saved ? JSON.parse(saved) : INITIAL_KATERING_PACKAGES;
    } catch {
      return INITIAL_KATERING_PACKAGES;
    }
  });

  const [dishes, setDishes] = useState<KateringDishItem[]>(() => {
    try {
      const saved = localStorage.getItem('reamanda:dishes');
      return saved ? JSON.parse(saved) : INITIAL_KATERING_DISHES;
    } catch {
      return INITIAL_KATERING_DISHES;
    }
  });

  const [orders, setOrders] = useState<StoredOrder[]>(() => {
    try {
      const saved = localStorage.getItem('reamanda:orders');
      if (saved) return JSON.parse(saved);
      // Seed 2 realistic sample orders for demonstration
      return [
        {
          id: `${BRAND.orderPrefix.busana}-8021`,
          type: 'busana',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          customerName: 'Aisyah Putri',
          whatsapp: '081298765432',
          summary: 'Hijab Voal Aruna Monogram (x1), Tunik Malika (x1)',
          totalAmountFormatted: 'Rp 820.000',
          status: 'Menunggu',
          itemsOrDetails: { address: 'Pondok Indah, Jakarta Selatan' },
        },
        {
          id: `RES-${BRAND.orderPrefix.busana}-3042`,
          type: 'properti',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          customerName: 'Bambang Soediro',
          whatsapp: '08112345678',
          summary: 'Reservasi Boutique Hotel Dharmawangsa (Suite Utama)',
          totalAmountFormatted: 'Rp 3.700.000 (2 Malam)',
          status: 'Dikonfirmasi',
          itemsOrDetails: { checkIn: '2025-04-10', checkOut: '2025-04-12', guests: 2 },
        },
      ];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage with reamanda: prefix
  useEffect(() => {
    localStorage.setItem('reamanda:site_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('reamanda:busana_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('reamanda:properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('reamanda:packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('reamanda:dishes', JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    localStorage.setItem('reamanda:orders', JSON.stringify(orders));
  }, [orders]);

  const login = (u: string, p: string) => {
    if (u === 'admin' && (p === 'reamanda2025' || p === 'admin123' || p === 'reamanda')) {
      setIsAdmin(true);
      setIsEditMode(true);
      localStorage.setItem('reamanda:admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    setIsDashboardOpen(false);
    localStorage.removeItem('reamanda:admin_session');
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const updateSettings = (s: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
  };

  const updateProduct = (p: BusanaProduct) => {
    setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  };

  const updateProperty = (p: PropertyListing) => {
    setProperties((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  };

  const updatePackage = (pkg: KateringPackageItem) => {
    setPackages((prev) => prev.map((item) => (item.id === pkg.id ? pkg : item)));
  };

  const updateDish = (d: KateringDishItem) => {
    setDishes((prev) => prev.map((item) => (item.id === d.id ? d : item)));
  };

  const addOrder = (orderData: Omit<StoredOrder, 'id' | 'createdAt' | 'status'>) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const prefix =
      orderData.type === 'busana'
        ? BRAND.orderPrefix.busana
        : orderData.type === 'properti'
        ? 'RES'
        : BRAND.orderPrefix.katering;
    const newId = `${prefix}-${randomCode}`;
    const newOrder: StoredOrder = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'Menunggu',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newId;
  };

  const updateOrderStatus = (id: string, status: StoredOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Dibatalkan' } : o)));
  };

  const resetAllData = () => {
    setSettings(DEFAULT_SETTINGS);
    setProducts(INITIAL_BUSANA_PRODUCTS);
    setProperties(INITIAL_PROPERTIES);
    setPackages(INITIAL_KATERING_PACKAGES);
    setDishes(INITIAL_KATERING_DISHES);
    localStorage.removeItem('reamanda:site_settings');
    localStorage.removeItem('reamanda:busana_products');
    localStorage.removeItem('reamanda:properties');
    localStorage.removeItem('reamanda:packages');
    localStorage.removeItem('reamanda:dishes');
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isEditMode,
        login,
        logout,
        toggleEditMode,
        settings,
        updateSettings,
        products,
        updateProduct,
        properties,
        updateProperty,
        packages,
        updatePackage,
        dishes,
        updateDish,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        resetAllData,
        isDashboardOpen,
        openDashboard: () => setIsDashboardOpen(true),
        closeDashboard: () => setIsDashboardOpen(false),
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
