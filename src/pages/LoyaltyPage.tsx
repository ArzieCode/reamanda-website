// ============================================================
// Page — Loyalty & Rewards (/rewards)
// Program overview, membership tiers, how to earn & redeem
// ============================================================
import { useRewards } from '../context/RewardsContext';
import { useAuth } from '../context/AuthContext';
import { Award, Gift, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoyaltyPage() {
  const { toggleRewardsDrawer, points, tier } = useRewards();
  const { user, openAuthModal } = useAuth();

  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 pb-28 md:pb-36">
      {/* Hero Banner */}
      <div className="border border-line bg-surface p-8 sm:p-14 text-center max-w-3xl mx-auto mb-16">
        <Award size={36} color="var(--caramel-deep)" className="mx-auto mb-4" />
        <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          PROGRAM APRESIASI KELUARGA RIAMIRANDA
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal mb-4 leading-tight">
          RiaMiranda Privilege Club
        </h1>
        <p className="text-sm font-light text-muted max-w-xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
          Sebagai wujud cinta dan rasa terima kasih kami atas kesetiaan Anda, nikmati keistimewaan pengumpulan poin, diskon hari ulang tahun, serta akses awal ke setiap koleksi rilis terbatas kami.
        </p>

        {user ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="px-6 py-2.5 border border-line bg-bg text-xs font-light text-muted">
              Saldo: <strong className="text-charcoal font-medium">{points.toLocaleString('id-ID')} Poin</strong> (Member {tier})
            </div>
            <button
              onClick={() => toggleRewardsDrawer(true)}
              className="nav-label px-6 py-3 bg-charcoal text-white hover:opacity-85 transition-opacity"
              style={{ fontSize: '11px', letterSpacing: '0.14em' }}
            >
              BUKA MENU TUKAR POIN
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('register')}
            className="nav-label px-8 py-3.5 bg-charcoal text-white hover:opacity-85 transition-opacity"
            style={{ fontSize: '11px', letterSpacing: '0.16em' }}
          >
            GABUNG SEKARANG (+100 POIN)
          </button>
        )}
      </div>

      {/* 3 Tiers */}
      <div className="mb-20">
        <p className="nav-label text-center text-muted mb-10" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          TINGKATAN STATUS KEANGGOTAAN
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Silver */}
          <div className="border border-line p-8 bg-bg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-cormorant text-2xl text-charcoal font-light">Silver Member</h3>
                <span className="nav-label text-[9px] text-muted px-2 py-0.5 border border-line">0 – 999 POIN</span>
              </div>
              <p className="text-xs text-muted font-light mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                Otomatis aktif sejak pendaftaran akun pertama kali.
              </p>
              <ul className="space-y-3 text-xs font-light text-ink" style={{ fontFamily: 'Jost, sans-serif' }}>
                <li className="flex items-center gap-2">✓ 1 Poin setiap belanja Rp 10.000</li>
                <li className="flex items-center gap-2">✓ Bonus 100 poin selamat datang</li>
                <li className="flex items-center gap-2">✓ Diskon ulang tahun 5%</li>
              </ul>
            </div>
          </div>

          {/* Gold */}
          <div className="border-2 border-caramel p-8 bg-surface flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 bg-caramel text-white nav-label text-[8px] px-2 py-0.5" style={{ letterSpacing: '0.14em' }}>
              POPULER
            </span>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-cormorant text-2xl text-charcoal font-light">Gold Member</h3>
                <span className="nav-label text-[9px] text-white px-2 py-0.5 bg-caramel">1.000 – 2.499 POIN</span>
              </div>
              <p className="text-xs text-muted font-light mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                Untuk pelanggan setia dengan transaksi konsisten.
              </p>
              <ul className="space-y-3 text-xs font-light text-ink" style={{ fontFamily: 'Jost, sans-serif' }}>
                <li className="flex items-center gap-2">✓ Seluruh manfaat status Silver</li>
                <li className="flex items-center gap-2">✓ Gratis ongkir tanpa batas minimum</li>
                <li className="flex items-center gap-2">✓ Akses rilis awal katalog 24 jam sebelum publik</li>
                <li className="flex items-center gap-2">✓ Diskon ulang tahun 10%</li>
              </ul>
            </div>
          </div>

          {/* Platinum */}
          <div className="border border-line p-8 bg-bg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-cormorant text-2xl text-charcoal font-light">Platinum VIP</h3>
                <span className="nav-label text-[9px] text-white px-2 py-0.5 bg-charcoal">2.500+ POIN</span>
              </div>
              <p className="text-xs text-muted font-light mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                Tingkat eksklusif tertinggi bagi pencinta karya RiaMiranda.
              </p>
              <ul className="space-y-3 text-xs font-light text-ink" style={{ fontFamily: 'Jost, sans-serif' }}>
                <li className="flex items-center gap-2">✓ Seluruh manfaat status Gold</li>
                <li className="flex items-center gap-2">✓ Undangan VIP Fashion Show RiaMiranda tahunan</li>
                <li className="flex items-center gap-2">✓ Konsultan busana dan interior pribadi</li>
                <li className="flex items-center gap-2">✓ Diskon ulang tahun 15%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How to Earn */}
      <div className="border-t border-line pt-14 text-center">
        <p className="nav-label text-muted mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          CARA MENGUMPULKAN POIN
        </p>
        <p className="text-sm font-light text-ink max-w-xl mx-auto mb-8" style={{ fontFamily: 'Jost, sans-serif' }}>
          Belanja busana kesayangan Anda, pesan perjamuan katering keluarga, atau ikuti penawaran properti untuk mengumpulkan poin secara berkelanjutan.
        </p>
        <Link
          to="/busana"
          className="nav-label inline-flex items-center gap-2 px-8 py-3.5 border border-charcoal text-charcoal hover:bg-surface transition-colors"
          style={{ fontSize: '11px', letterSpacing: '0.14em' }}
        >
          MULAI BELANJA & KUMPULKAN POIN
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
