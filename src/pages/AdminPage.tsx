// ============================================================
// Page — Unified Admin Back-Office Portal & Shell
// ============================================================
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useOverlay } from '../context/OverlayContext';
import { BRAND } from '../config/brand';
import { SalesDashboardView } from '../components/admin/SalesDashboardView';
import { ProductManagementView } from '../components/admin/ProductManagementView';
import { OrderManagementView } from '../components/admin/OrderManagementView';
import { PropertyManagementView } from '../components/admin/PropertyManagementView';
import { CateringManagementView } from '../components/admin/CateringManagementView';
import { CustomerManagementView } from '../components/admin/CustomerManagementView';
import { StaffManagementView } from '../components/admin/StaffManagementView';
import { SettingsView } from '../components/admin/SettingsView';
import { ActivityLogView } from '../components/admin/ActivityLogView';
import { ContentManagementView } from '../components/admin/ContentManagementView';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Home,
  UtensilsCrossed,
  Users,
  FileEdit,
  ShieldCheck,
  Settings,
  Activity,
  LogOut,
  Menu,
  X,
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    currentUser,
    isStaff,
    isOwner,
    isAdmin,
    isStaf,
    login,
    logout,
    hasPermission,
  } = useAuth();

  const {
    activeAdminTab,
    setActiveAdminTab,
    isEditMode,
    toggleEditMode,
    isVisitorPreview,
    toggleVisitorPreview,
  } = useAdmin();

  const { showToast } = useOverlay();

  // Mobile menu
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('owner@reamanda.com');
  const [loginPass, setLoginPass] = useState('Owner123!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await login(loginEmail, loginPass, true);
      if (res.success && res.user) {
        showToast(`Selamat datang di portal admin, ${res.user.name}!`);
      } else {
        setLoginError(res.errorMessage || 'Kredensial tidak valid.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Gagal masuk.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If user is not staff, show Admin Login Portal
  if (!isStaff || !currentUser) {
    return (
      <div className="section-padding site-container max-w-xl">
        <div className="bg-white border border-line p-8 md:p-10 rounded-[2px] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={20} className="text-charcoal stroke-[1.25]" />
            <span className="label-editorial text-charcoal">Portal Administrator {BRAND.name}</span>
          </div>

          <h1 className="font-serif text-charcoal text-3xl font-light mb-2">
            Masuk Back-Office
          </h1>

          <p className="text-xs text-muted font-sans mb-6">
            Akses sistem manajemen terpadu: CMS, katalog produk, lelang hunian, katering, dan audit pesanan.
          </p>

          {loginError && (
            <div className="p-3 bg-status-occupied/10 border border-status-occupied/30 text-status-occupied text-xs flex items-center gap-2 font-sans mb-4 rounded-[2px]">
              <AlertCircle size={15} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                Surel Staf
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
                <User size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
                <Lock size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            {/* Quick Demo Staff Credentials */}
            <div className="p-3 bg-surface border border-line text-[11px] font-sans space-y-1.5 rounded-[2px]">
              <span className="text-muted uppercase tracking-wider block font-medium">Akun Demo Staf Cepat:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('owner@reamanda.com');
                    setLoginPass('Owner123!');
                  }}
                  className="p-1.5 bg-white border border-line hover:border-charcoal text-left rounded-[2px]"
                >
                  <strong className="block text-charcoal">Owner</strong>
                  <span className="text-[10px] text-muted">Akses Penuh</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@reamanda.com');
                    setLoginPass('Admin123!');
                  }}
                  className="p-1.5 bg-white border border-line hover:border-charcoal text-left rounded-[2px]"
                >
                  <strong className="block text-charcoal">Admin</strong>
                  <span className="text-[10px] text-muted">CMS & Produk</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('staf@reamanda.com');
                    setLoginPass('Staf123!');
                  }}
                  className="p-1.5 bg-white border border-line hover:border-charcoal text-left rounded-[2px]"
                >
                  <strong className="block text-charcoal">Staf</strong>
                  <span className="text-[10px] text-muted">Pesanan Saja</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-[0.18em] font-sans transition-colors rounded-[2px] font-medium disabled:opacity-50"
            >
              {isLoggingIn ? 'Memverifikasi...' : 'Masuk ke Portal Administrator'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Define sidebar menu tabs according to user role permissions
  // Spec: Owner sees revenue; Admin sees counts; Staf does not see Ringkasan page (orders and inquiries only)
  const menuItems = [
    ...(!isStaf
      ? [
          { id: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
        ]
      : []),
    { id: 'pesanan', label: 'Pesanan', icon: ShoppingBag },
    ...(hasPermission('MANAGE_PRODUCTS')
      ? [{ id: 'produk', label: 'Produk', icon: Package }]
      : []),
    { id: 'properti', label: 'Properti & Penawaran', icon: Home },
    { id: 'katering', label: 'Katering', icon: UtensilsCrossed },
    ...(hasPermission('MANAGE_CUSTOMERS')
      ? [{ id: 'pelanggan', label: 'Pelanggan', icon: Users }]
      : []),
    ...(hasPermission('EDIT_CONTENT')
      ? [{ id: 'konten', label: 'Konten CMS', icon: FileEdit }]
      : []),
    ...(isOwner
      ? [{ id: 'staf', label: 'Akun Staf', icon: ShieldCheck }]
      : []),
    ...(hasPermission('SYSTEM_SETTINGS')
      ? [{ id: 'pengaturan', label: 'Pengaturan', icon: Settings }]
      : []),
    ...(!isStaf
      ? [{ id: 'aktivitas', label: 'Aktivitas', icon: Activity }]
      : []),
  ];

  const handleTabClick = (tabId: string) => {
    setActiveAdminTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Bar for Admin Controls */}
      <div className="bg-charcoal text-white px-4 py-2 text-xs font-sans flex items-center justify-between border-b border-line/20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-1 text-white hover:text-caramel"
          >
            <Menu size={18} />
          </button>
          <span className="font-serif text-base tracking-wide text-white">{BRAND.name} Back-Office</span>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-white/10 text-white text-[10px] uppercase font-sans tracking-widest rounded-[2px]">
            {currentUser.role}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Visitor Preview Toggle */}
          <button
            type="button"
            onClick={toggleVisitorPreview}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-[2px] transition-colors ${
              isVisitorPreview
                ? 'bg-caramel-deep text-white font-medium'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Sembunyikan semua kendali admin untuk melihat tampilan seperti pengunjung"
          >
            {isVisitorPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            <span className="hidden sm:inline">
              {isVisitorPreview ? 'Keluar Pratinjau' : 'Pratinjau Pengunjung'}
            </span>
          </button>

          {/* Live Edit Mode Switch */}
          {hasPermission('EDIT_CONTENT') && (
            <button
              type="button"
              onClick={toggleEditMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-[2px] transition-colors ${
                isEditMode
                  ? 'bg-white text-charcoal font-medium'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FileEdit size={13} />
              <span className="hidden sm:inline">Edit Langsung: {isEditMode ? 'ON' : 'OFF'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1 text-[11px] uppercase tracking-wider hover:text-status-occupied transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden md:inline">Keluar</span>
          </button>
        </div>
      </div>

      <div className="site-container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar (>= 768px) */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="bg-white border border-line rounded-[2px] p-2 space-y-1 sticky top-24 shadow-sm">
              <div className="p-3 border-b border-line/60 mb-2">
                <span className="text-[10px] uppercase font-sans tracking-widest text-muted block">Masuk Sebagai:</span>
                <span className="font-serif text-charcoal text-base font-normal block truncate">{currentUser.name}</span>
                <span className="text-[11px] text-muted block capitalize">{currentUser.role}</span>
              </div>

              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full px-3 py-2 text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-2.5 transition-colors text-left ${
                      isActive
                        ? 'bg-charcoal text-white font-medium shadow-xs'
                        : 'text-ink hover:bg-surface hover:text-charcoal'
                    }`}
                  >
                    <Icon size={14} className="stroke-[1.5]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Mobile Slide-in Drawer Sidebar (< 768px) */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="relative w-72 max-w-full bg-white h-full p-4 flex flex-col justify-between shadow-xl z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <span className="font-serif text-charcoal text-lg">{BRAND.name} Admin</span>
                    <button
                      type="button"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="p-1 text-muted hover:text-charcoal"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeAdminTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full px-3 py-2.5 text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-2.5 ${
                            isActive ? 'bg-charcoal text-white font-medium' : 'text-ink hover:bg-surface'
                          }`}
                        >
                          <Icon size={14} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full py-2 text-xs uppercase tracking-wider font-sans text-status-occupied flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={14} /> Keluar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Pane */}
          <main className="flex-1 min-w-0">
            {activeAdminTab === 'ringkasan' && !isStaf && (
              <SalesDashboardView onNavigateTab={(tab) => setActiveAdminTab(tab)} />
            )}

            {activeAdminTab === 'pesanan' && <OrderManagementView />}

            {activeAdminTab === 'produk' && hasPermission('MANAGE_PRODUCTS') && (
              <ProductManagementView />
            )}

            {activeAdminTab === 'properti' && <PropertyManagementView />}

            {activeAdminTab === 'katering' && <CateringManagementView />}

            {activeAdminTab === 'pelanggan' && hasPermission('MANAGE_CUSTOMERS') && (
              <CustomerManagementView />
            )}

            {activeAdminTab === 'konten' && hasPermission('EDIT_CONTENT') && (
              <ContentManagementView />
            )}

            {activeAdminTab === 'staf' && isOwner && <StaffManagementView />}

            {activeAdminTab === 'pengaturan' && hasPermission('SYSTEM_SETTINGS') && (
              <SettingsView />
            )}

            {activeAdminTab === 'aktivitas' && !isStaf && <ActivityLogView />}
          </main>
        </div>
      </div>
    </div>
  );
};
