import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BusanaPage from './pages/BusanaPage';
import KoleksiPage from './pages/KoleksiPage';
import ProdukDetailPage from './pages/ProdukDetailPage';
import PropertiPage from './pages/PropertiPage';
import PropertiDetailPage from './pages/PropertiDetailPage';
import KateringPage from './pages/KateringPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/busana" element={<BusanaPage />} />
            <Route path="/busana/koleksi/:slug" element={<KoleksiPage />} />
            <Route path="/busana/produk/:slug" element={<ProdukDetailPage />} />
            <Route path="/properti" element={<PropertiPage />} />
            <Route path="/properti/:id" element={<PropertiDetailPage />} />
            <Route path="/katering" element={<KateringPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}
