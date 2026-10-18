import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminBar } from './AdminBar';
import { BrandTabStrip } from './BrandTabStrip';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../busana/CartDrawer';
import { SearchModal } from '../modals/SearchModal';
import { AdminLoginModal } from '../admin/AdminLoginModal';
import { AdminDashboardModal } from '../admin/AdminDashboardModal';

export const Layout: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink font-sans">
      {/* 1. Admin Bar (normal flow, only when logged in) */}
      <AdminBar />

      {/* 2. Brand Tab Strip (normal flow, 40px) */}
      <BrandTabStrip />

      {/* 3. Announcement Bar (normal flow, 40px) */}
      <AnnouncementBar />

      {/* 4. Sticky Header (solid white, 72px/60px mobile, z-header) */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAdminModal={() => setAdminLoginOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer onOpenAdminModal={() => setAdminLoginOpen(true)} />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AdminLoginModal isOpen={adminLoginOpen} onClose={() => setAdminLoginOpen(false)} />
      <AdminDashboardModal />
    </div>
  );
};
