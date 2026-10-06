// ============================================================
// App.tsx — Global Provider Stack & Complete Route Registry
// ============================================================
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Global Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { RewardsProvider } from './context/RewardsContext';
import { SearchProvider } from './context/SearchContext';
import { ChatProvider } from './context/ChatContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import BusanaPage from './pages/BusanaPage';
import KoleksiPage from './pages/KoleksiPage';
import ProdukDetailPage from './pages/ProdukDetailPage';
import PropertiPage from './pages/PropertiPage';
import PropertiDetailPage from './pages/PropertiDetailPage';
import KateringPage from './pages/KateringPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AkunPage from './pages/AkunPage';
import TentangKamiPage from './pages/TentangKamiPage';
import LokasiTokoPage from './pages/LokasiTokoPage';
import KarierPage from './pages/KarierPage';
import MediaPage from './pages/MediaPage';
import KontakPage from './pages/KontakPage';
import FaqPage from './pages/FaqPage';
import KebijakanPengirimanPage from './pages/KebijakanPengirimanPage';
import KebijakanPengembalianPage from './pages/KebijakanPengembalianPage';
import KebijakanPrivasiPage from './pages/KebijakanPrivasiPage';
import SyaratKetentuanPage from './pages/SyaratKetentuanPage';
import CaraPemesananPage from './pages/CaraPemesananPage';
import SustainabilityPage from './pages/SustainabilityPage';
import AfiliasiPage from './pages/AfiliasiPage';
import LoyaltyPage from './pages/LoyaltyPage';
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
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <RewardsProvider>
                  <SearchProvider>
                    <ChatProvider>
                      <BrowserRouter>
                        <ScrollToTop />
                        <Layout>
                          <Routes>
                            {/* Core Landing & Section Roots */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/busana" element={<BusanaPage />} />
                            <Route path="/busana/koleksi/:slug" element={<KoleksiPage />} />
                            <Route path="/busana/produk/:slug" element={<ProdukDetailPage />} />
                            <Route path="/properti" element={<PropertiPage />} />
                            <Route path="/properti/:id" element={<PropertiDetailPage />} />
                            <Route path="/katering" element={<KateringPage />} />

                            {/* Search, Commerce & User Flows */}
                            <Route path="/cari" element={<SearchResultsPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/order/:id" element={<OrderSuccessPage />} />
                            <Route path="/akun" element={<AkunPage />} />
                            <Route path="/akun/:tab" element={<AkunPage />} />

                            {/* Company, Policies, Information */}
                            <Route path="/tentang-kami" element={<TentangKamiPage />} />
                            <Route path="/lokasi-toko" element={<LokasiTokoPage />} />
                            <Route path="/karier" element={<KarierPage />} />
                            <Route path="/media" element={<MediaPage />} />
                            <Route path="/kontak" element={<KontakPage />} />
                            <Route path="/faq" element={<FaqPage />} />
                            <Route path="/kebijakan-pengiriman" element={<KebijakanPengirimanPage />} />
                            <Route path="/kebijakan-pengembalian" element={<KebijakanPengembalianPage />} />
                            <Route path="/kebijakan-privasi" element={<KebijakanPrivasiPage />} />
                            <Route path="/syarat-ketentuan" element={<SyaratKetentuanPage />} />
                            <Route path="/cara-pemesanan" element={<CaraPemesananPage />} />
                            <Route path="/sustainability" element={<SustainabilityPage />} />
                            <Route path="/afiliasi" element={<AfiliasiPage />} />
                            <Route path="/rewards" element={<LoyaltyPage />} />

                            {/* Catch-all 404 */}
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </Layout>
                      </BrowserRouter>
                    </ChatProvider>
                  </SearchProvider>
                </RewardsProvider>
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
