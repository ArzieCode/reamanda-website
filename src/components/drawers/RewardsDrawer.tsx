// ============================================================
// Drawer — Loyalty & Rewards Program
// Points balance, tier progress, earn rules, redeem list
// ============================================================
import { useState } from 'react';
import { X, Award } from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import { formatRupiah } from '../../utils/format';

export default function RewardsDrawer() {
  const { points, tier, tierProgress, vouchers, isRewardsOpen, toggleRewardsDrawer, redeemVoucher } = useRewards();
  const [activeTab, setActiveTab] = useState<'redeem' | 'earn'>('redeem');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  if (!isRewardsOpen) return null;

  const close = () => toggleRewardsDrawer(false);

  const handleRedeem = async (voucher: any) => {
    setRedeemingId(voucher.id);
    await redeemVoucher(voucher);
    setRedeemingId(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(77,73,70,0.45)' }}
        onClick={close}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 bottom-0 z-[60] flex flex-col w-full sm:w-[420px] max-w-full bg-bg border-l border-line"
        role="dialog"
        aria-label="Program Loyalitas & Hadiah"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <p className="nav-label text-charcoal flex items-center gap-2" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
            <Award size={16} color="var(--caramel)" strokeWidth={1.5} />
            RIAMIRANDA PRIVILEGE
          </p>
          <button
            onClick={close}
            className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
            aria-label="Tutup menu hadiah"
          >
            <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-6 bg-surface border-b border-line">
          <div className="flex items-baseline justify-between mb-2">
            <span className="nav-label text-muted" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
              TOTAL POIN ANDA
            </span>
            <span
              className="nav-label px-2.5 py-0.5 rounded-full text-white"
              style={{
                fontSize: '9px',
                letterSpacing: '0.14em',
                backgroundColor: tier === 'Platinum' ? 'var(--charcoal)' : 'var(--caramel)',
              }}
            >
              MEMBER {tier.toUpperCase()}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-cormorant font-light text-4xl text-charcoal">
              {points.toLocaleString('id-ID')}
            </span>
            <span className="text-sm font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
              Poin
            </span>
          </div>

          {/* Tier progress */}
          <div>
            <div className="flex justify-between text-xs font-light text-muted mb-1.5" style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px' }}>
              <span>Status Level: {tier}</span>
              <span>{tierProgress}% menuju {tier === 'Silver' ? 'Gold' : tier === 'Gold' ? 'Platinum' : 'Maksimal'}</span>
            </div>
            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${tierProgress}%`,
                  backgroundColor: 'var(--caramel)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-line">
          <button
            onClick={() => setActiveTab('redeem')}
            className="flex-1 nav-label py-3 text-center border-b-2 transition-all focus-visible:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              borderColor: activeTab === 'redeem' ? 'var(--charcoal)' : 'transparent',
              color: activeTab === 'redeem' ? 'var(--charcoal)' : 'var(--muted)',
            }}
          >
            TUKAR VOUCHER
          </button>
          <button
            onClick={() => setActiveTab('earn')}
            className="flex-1 nav-label py-3 text-center border-b-2 transition-all focus-visible:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              borderColor: activeTab === 'earn' ? 'var(--charcoal)' : 'transparent',
              color: activeTab === 'earn' ? 'var(--charcoal)' : 'var(--muted)',
            }}
          >
            CARA DAPATKAN POIN
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'redeem' ? (
            <div className="space-y-4">
              <p className="text-xs text-muted font-light mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Tukarkan poin Anda dengan kode kupon eksklusif untuk potongan belanja saat checkout.
              </p>
              {vouchers.map((v) => {
                const canAfford = points >= v.pointsCost;
                const isRedeeming = redeemingId === v.id;

                return (
                  <div
                    key={v.id}
                    className="p-4 border border-line bg-bg flex flex-col justify-between"
                  >
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="nav-label" style={{ fontSize: '12px', color: 'var(--charcoal)', letterSpacing: '0.12em' }}>
                          {v.title}
                        </span>
                        <span className="nav-label" style={{ fontSize: '11px', color: 'var(--caramel-deep)', letterSpacing: '0.1em' }}>
                          {v.pointsCost} Poin
                        </span>
                      </div>
                      <p className="text-xs text-muted font-light leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {v.description}
                      </p>
                      {v.minPurchase > 0 && (
                        <p className="text-[11px] text-muted font-light mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                          Min. Belanja: {formatRupiah(v.minPurchase)}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRedeem(v)}
                      disabled={!canAfford || isRedeeming}
                      className="nav-label w-full py-2.5 px-4 text-center border transition-all duration-300 focus-visible:outline-none disabled:opacity-40"
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        borderColor: canAfford ? 'var(--charcoal)' : 'var(--line)',
                        backgroundColor: canAfford ? 'var(--charcoal)' : 'transparent',
                        color: canAfford ? '#ffffff' : 'var(--muted)',
                      }}
                    >
                      {isRedeeming ? 'MEMPROSES...' : canAfford ? 'TUKAR SEKARANG' : 'POIN BELUM CUKUP'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="nav-label text-charcoal mb-3" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
                  AKTIVITAS PEROLEHAN POIN
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-surface border border-line flex items-center justify-center text-xs text-charcoal flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <p className="text-xs font-medium text-charcoal" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Belanja Koleksi Busana & Katering
                      </p>
                      <p className="text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Dapatkan 1 poin setiap kelipatan Rp 10.000 belanja online.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-surface border border-line flex items-center justify-center text-xs text-charcoal flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <p className="text-xs font-medium text-charcoal" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Pendaftaran Anggota Baru
                      </p>
                      <p className="text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Otomatis mendapatkan 100 poin selamat datang saat mendaftar akun.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-surface border border-line flex items-center justify-center text-xs text-charcoal flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <p className="text-xs font-medium text-charcoal" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Hari Ulang Tahun RiaMiranda
                      </p>
                      <p className="text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Bonus poin kejutan tahunan untuk seluruh anggota aktif.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border-t border-line pt-4">
                <p className="nav-label text-charcoal mb-3" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
                  TINGKAT KEANGGOTAAN
                </p>
                <div className="space-y-2 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                  <p><strong className="text-charcoal font-medium">Silver:</strong> 0 – 999 poin (Diskon ulang tahun 5%)</p>
                  <p><strong className="text-charcoal font-medium">Gold:</strong> 1.000 – 2.499 poin (Gratis ongkir & akses rilis awal)</p>
                  <p><strong className="text-charcoal font-medium">Platinum:</strong> 2.500+ poin (Undangan VIP fashion show tahunan & konsultan pribadi)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
