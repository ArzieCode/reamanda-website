// ============================================================
// Layout — wraps every page
// ============================================================
import React from 'react';
import BrandTabStrip from './BrandTabStrip';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import FloatingElements from './FloatingElements';
import CartDrawer from '../busana/CartDrawer';

interface LayoutProps {
  children: React.ReactNode;
  /** Pass true for pages with a hero (header starts transparent) */
  hasHero?: boolean;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Fixed top strip (not inside the sticky header) */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <BrandTabStrip />
        <AnnouncementBar />
        {/* Header is fixed too, positioned below strip+bar via CSS top offset */}
      </div>

      {/* Header sits below the strip + announcement bar */}
      {/* Total strip+bar height: ~32 + 40 = 72px */}
      <div className="fixed left-0 right-0 z-40" style={{ top: 72 }}>
        <Header />
      </div>

      {/* Page content — padded top to account for all fixed bars */}
      {/* strip(32) + announcement(40) + header(64) = 136px */}
      <main className="flex-1 pt-[136px]">
        {children}
      </main>

      <Footer />
      <FloatingElements />
      <CartDrawer />
    </div>
  );
}
