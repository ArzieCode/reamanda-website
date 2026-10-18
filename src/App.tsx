import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import { OverlayProvider } from './context/OverlayContext';
import { Toast } from './components/ui/Toast';
import { Layout } from './components/layout/Layout';

import { HomePage } from './pages/HomePage';
import { BusanaPage } from './pages/BusanaPage';
import { PropertiPage } from './pages/PropertiPage';
import { KateringPage } from './pages/KateringPage';
import { AdminPage } from './pages/AdminPage';
import { TentangKamiPage } from './pages/TentangKamiPage';
import { KontakPage } from './pages/KontakPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <BrowserRouter>
          <OverlayProvider>
            <ScrollToTop />
            <Toast />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="busana" element={<BusanaPage />} />
                <Route path="properti" element={<PropertiPage />} />
                <Route path="katering" element={<KateringPage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="tentang-kami" element={<TentangKamiPage />} />
                <Route path="kontak" element={<KontakPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </OverlayProvider>
        </BrowserRouter>
      </CartProvider>
    </AdminProvider>
  );
}
