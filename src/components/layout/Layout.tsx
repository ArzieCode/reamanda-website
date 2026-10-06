// ============================================================
// Layout — wraps every page
// Fixed top navigation stack (z-40): Tab Strip (40px) + Announcement (40px) + Header (60/72px)
// Hero pages start beneath announcement bar (pt-[80px]), behind transparent header
// Non-hero pages start beneath solid header (pt-[140px] min-[1100px]:pt-[152px])
// ============================================================
import React from 'react';
import { useLocation } from 'react-router-dom';
import BrandTabStrip from './BrandTabStrip';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import FloatingElements from './FloatingElements';
import CartDrawer from '../busana/CartDrawer';
import WishlistDrawer from '../drawers/WishlistDrawer';
import RewardsDrawer from '../drawers/RewardsDrawer';
import ChatPanel from '../chat/ChatPanel';
import SearchOverlay from '../modals/SearchOverlay';
import AuthModal from '../modals/AuthModal';
import ToastContainer from '../ui/ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  const isHeroPage =
    pathname === '/' ||
    pathname === '/busana' ||
    pathname === '/properti' ||
    pathname === '/katering';

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink relative">
      {/* Toast Notification Container (z-70) */}
      <ToastContainer />

      {/* Unified fixed top navigation (z-40 per design token scale) */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <BrandTabStrip />
        <AnnouncementBar />
        <Header />
      </div>

      {/* Main content:
          - Hero pages: start at 80px (beneath announcement bar, behind transparent header)
          - Non-hero pages: start at 140px mobile / 152px desktop (beneath solid header)
      */}
      <main
        className={`flex-1 ${
          isHeroPage ? 'pt-[80px]' : 'pt-[140px] min-[1100px]:pt-[152px]'
        }`}
      >
        {children}
      </main>

      <Footer />
      <FloatingElements />

      {/* Drawers & Modals (z-60 to z-70) */}
      <CartDrawer />
      <WishlistDrawer />
      <RewardsDrawer />
      <ChatPanel />
      <SearchOverlay />
      <AuthModal />
    </div>
  );
}
