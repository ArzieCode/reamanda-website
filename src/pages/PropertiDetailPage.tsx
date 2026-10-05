// ============================================================
// Properti Detail Page (/properti/:id)
// Sticky bid panel, countdown, validation, login guard,
// "Jadwalkan Kunjungan" modal, "Simpan Properti" toggle
// ============================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Placeholder from '../components/ui/Placeholder';
import { getListing, getBids, placeBid, simulateLiveBid } from '../services/properti';
import type { Property, Bid } from '../types/properti';
import { formatTime, getCountdown } from '../utils/format';
import { Clock, ChevronDown, Calendar, Bookmark, Check, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import ScheduleVisitModal from '../components/modals/ScheduleVisitModal';

const SAVED_PROPERTIES_KEY = 'riamiranda_saved_properties';

const statusConfig = {
  tersedia: { label: 'Tersedia', color: 'var(--available)' },
  dp: { label: 'Sudah DP', color: 'var(--deposit)' },
  ditempati: { label: 'Sudah Ditempati', color: 'var(--occupied)' },
};

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: 'var(--line)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left transition-opacity duration-400 hover:opacity-70 focus-visible:outline-none"
      >
        <span className="nav-label" style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>
          {title.toUpperCase()}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.25}
          color="var(--charcoal)"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 300ms ease' }}
        />
      </button>
      {open && <div className="pb-5 text-sm font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost' }}>{children}</div>}
    </div>
  );
}

export default function PropertiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, openAuthModal } = useAuth();
  const { format } = useCurrency();
  const { showToast } = useToast();

  const [property, setProperty] = useState<Property | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidInput, setBidInput] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      getListing(id ?? ''),
      getBids(id ?? ''),
    ]).then(([prop, bidList]) => {
      setProperty(prop);
      setBids(bidList);
      if (prop) setCurrentBid(prop.currentBid);
      setLoading(false);
    });

    try {
      const raw = localStorage.getItem(SAVED_PROPERTIES_KEY);
      const savedList = raw ? JSON.parse(raw) : [];
      setIsSaved(savedList.includes(id));
    } catch {
      // ignore
    }
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!property) return;
    const tick = () => {
      const remaining = getCountdown(property.auctionEnd);
      setCountdown(remaining);
      if (remaining === '00h 00m 00s' || new Date(property.auctionEnd).getTime() <= Date.now()) {
        setIsAuctionEnded(true);
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [property]);

  // Live bid simulation (only for tersedia)
  useEffect(() => {
    if (!property || property.status !== 'tersedia' || isAuctionEnded) return;
    const cleanup = simulateLiveBid(property.id, (newAmount) => {
      setCurrentBid(newAmount);
      setBids((prev) => [
        {
          id: `b_live_${Date.now()}`,
          propertyId: property.id,
          bidderName: 'P***a',
          amount: newAmount,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });
    return cleanup;
  }, [property, isAuctionEnded]);

  const toggleSaveProperty = () => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(SAVED_PROPERTIES_KEY);
      const savedList: string[] = raw ? JSON.parse(raw) : [];
      let updated: string[];
      if (savedList.includes(id)) {
        updated = savedList.filter((item) => item !== id);
        setIsSaved(false);
        showToast('Properti dihapus dari daftar simpanan.', 'info');
      } else {
        updated = [...savedList, id];
        setIsSaved(true);
        showToast('Properti berhasil disimpan ke daftar favorit Anda!', 'success');
      }
      localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const handleBid = async () => {
    if (!property) return;

    // Login requirement check
    if (!user) {
      showToast('Silakan masuk ke akun Anda terlebih dahulu untuk mengajukan penawaran lelang.', 'info');
      openAuthModal('login');
      return;
    }

    if (isAuctionEnded) {
      setBidError('Lelang untuk properti ini telah resmi berakhir.');
      return;
    }

    const raw = bidInput.replace(/\D/g, '');
    const amount = Number(raw);
    const minRequired = currentBid + property.minimumIncrement;

    if (!amount || isNaN(amount)) {
      setBidError('Masukkan nominal penawaran yang valid.');
      return;
    }

    if (amount < minRequired) {
      setBidError(`Penawaran harus minimal ${format(minRequired)}.`);
      return;
    }

    setBidLoading(true);
    setBidError('');
    setBidSuccess('');

    const res = await placeBid(property.id, amount);
    setBidLoading(false);

    if (res.success && res.newBid) {
      setCurrentBid(amount);
      const userBid: Bid = {
        ...res.newBid,
        bidderName: user.name || 'Anda',
      };
      setBids((prev) => [userBid, ...prev]);
      setBidSuccess(`Penawaran ${format(amount)} berhasil diajukan! Anda saat ini memimpin lelang.`);
      setBidInput('');
      showToast(`Penawaran Anda (${format(amount)}) berhasil ditempatkan!`, 'success');
    } else {
      setBidError(res.error ?? 'Gagal mengajukan penawaran.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-20 pb-28 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8"><Placeholder ratio="16/9" /></div>
          <div className="lg:col-span-4 space-y-4"><div className="h-64 bg-surface" /></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-20 text-center pb-28 md:pb-36">
        <p className="font-cormorant text-2xl font-light mb-4" style={{ color: 'var(--charcoal)' }}>
          Properti tidak ditemukan
        </p>
        <Link to="/properti" className="nav-label text-indigo-brand hover:underline" style={{ fontSize: '11px' }}>
          ← Kembali ke Listing Properti
        </Link>
      </div>
    );
  }

  const minRequired = currentBid + property.minimumIncrement;
  const statusInfo = statusConfig[property.status] ?? statusConfig.tersedia;
  const thumbs = [0, 1, 2, 3];

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 pb-28 md:pb-36 pt-4">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between py-4 border-b border-line mb-8 text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
          <div className="flex items-center gap-2">
            <Link to="/properti" className="hover:text-charcoal transition-colors">PROPERTI</Link>
            <span>/</span>
            <span className="text-charcoal font-medium truncate max-w-xs">{property.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="flex items-center gap-1.5 nav-label px-3.5 py-1.5 border border-line text-charcoal hover:bg-surface transition-colors focus-visible:outline-none"
              style={{ fontSize: '10px', letterSpacing: '0.1em' }}
            >
              <Calendar size={13} />
              <span className="hidden sm:inline">JADWALKAN</span> KUNJUNGAN
            </button>
            <button
              onClick={toggleSaveProperty}
              className={`flex items-center gap-1.5 nav-label px-3 py-1.5 border transition-colors focus-visible:outline-none ${
                isSaved ? 'border-charcoal bg-charcoal text-white' : 'border-line text-charcoal hover:bg-surface'
              }`}
              style={{ fontSize: '10px', letterSpacing: '0.1em' }}
              aria-label={isSaved ? 'Hapus dari properti tersimpan' : 'Simpan properti ini'}
            >
              <Bookmark size={13} fill={isSaved ? '#ffffff' : 'none'} />
              <span className="hidden sm:inline">{isSaved ? 'TERSIMPAN' : 'SIMPAN'}</span>
            </button>
          </div>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Main info (8 cols) */}
          <div className="lg:col-span-8">
            {/* Gallery */}
            <div className="mb-3">
              <Placeholder ratio="16/9" label={`${property.name} — Sudut ${activeThumb + 1}`} className="w-full" />
            </div>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {thumbs.map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`transition-all border ${activeThumb === i ? 'border-indigo-brand opacity-100' : 'border-line opacity-60 hover:opacity-90'}`}
                  aria-label={`Lihat gambar properti sudut ${i + 1}`}
                >
                  <Placeholder ratio="16/9" label={`${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Title & Specs */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="nav-label px-2.5 py-0.5 text-white text-[9px]" style={{ backgroundColor: statusInfo.color }}>
                  {statusInfo.label.toUpperCase()}
                </span>
                <span className="nav-label text-muted text-[10px]" style={{ letterSpacing: '0.12em' }}>
                  {property.type.toUpperCase()} · {property.location}
                </span>
              </div>
              <h1 className="font-cormorant font-light text-3xl sm:text-4xl text-charcoal mb-4">
                {property.name}
              </h1>
              <p className="text-sm font-light text-ink leading-relaxed mb-6" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', lineHeight: 1.85 }}>
                {property.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border border-line bg-surface">
                <div>
                  <span className="nav-label text-[9px] text-muted block mb-1">LUAS TANAH</span>
                  <span className="font-light text-charcoal text-sm">{property.specs.landSize}</span>
                </div>
                <div>
                  <span className="nav-label text-[9px] text-muted block mb-1">LUAS BANGUNAN</span>
                  <span className="font-light text-charcoal text-sm">{property.specs.buildingSize}</span>
                </div>
                <div>
                  <span className="nav-label text-[9px] text-muted block mb-1">KAMAR TIDUR / MANDI</span>
                  <span className="font-light text-charcoal text-sm">{property.specs.bedrooms} KT / {property.specs.bathrooms} KM</span>
                </div>
                <div>
                  <span className="nav-label text-[9px] text-muted block mb-1">LEGALITAS</span>
                  <span className="font-light text-charcoal text-sm">{property.specs.certificate}</span>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-line">
              <Accordion title="Fasilitas & Keunggulan">
                <ul className="space-y-2">
                  {property.specs.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-brand inline-block" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Legalitas & Sertifikasi">
                Status kepemilikan aset terverifikasi bebas sengketa dengan sertifikat {property.specs.certificate}, IMB/PBG lengkap, dan dokumen PBB terbayar lunas tahun berjalan.
              </Accordion>
              <Accordion title="Ketentuan Partisipasi Lelang">
                Pemenang lelang ditentukan berdasarkan penawaran sah tertinggi pada saat hitung mundur berakhir. Uang jaminan DP sebesar 10% wajib disetorkan selambatnya 3 hari kerja setelah konfirmasi kemenangan lelang untuk pengikatan Akta Jual Beli di hadapan PPAT.
              </Accordion>
            </div>
          </div>

          {/* Bid Panel (4 cols) — becomes bottom block on small screens */}
          <div className="lg:col-span-4">
            <div className="border border-line p-6 bg-surface lg:sticky lg:top-36 shadow-sm">
              <p className="nav-label mb-6 text-indigo-brand" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                PANEL PENAWARAN RESMI
              </p>

              {/* Price Details */}
              <div className="space-y-3.5 mb-6">
                <div className="flex justify-between text-xs font-light text-muted" style={{ fontFamily: 'Jost' }}>
                  <span>Harga Pembukaan Awal</span>
                  <span className="text-charcoal">{format(property.startingPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-light text-muted" style={{ fontFamily: 'Jost' }}>Penawaran Tertinggi</span>
                  <span className="font-light text-indigo-brand text-lg" style={{ fontFamily: 'Jost' }}>
                    {format(currentBid)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-light text-muted" style={{ fontFamily: 'Jost' }}>
                  <span>Kelipatan Penawaran Min.</span>
                  <span className="text-charcoal">{format(property.minimumIncrement)}</span>
                </div>
              </div>

              {/* Countdown box */}
              <div className="flex items-center gap-2.5 py-3 px-4 mb-6 bg-bg border border-line">
                <Clock size={16} strokeWidth={1.5} color="var(--indigo-brand)" />
                <div>
                  <span className="nav-label text-[9px] text-muted block" style={{ letterSpacing: '0.12em' }}>
                    {isAuctionEnded ? 'LELANG DITUTUP' : 'WAKTU PENAWARAN TERSISA'}
                  </span>
                  <span className="nav-label text-sm text-charcoal font-medium" style={{ letterSpacing: '0.06em' }}>
                    {isAuctionEnded ? '00h 00m 00s (Berakhir)' : countdown}
                  </span>
                </div>
              </div>

              {/* Status & Bidding Form */}
              {property.status === 'ditempati' ? (
                <div className="py-4 px-4 text-center border border-occupied bg-occupied/5">
                  <p className="nav-label text-occupied text-[10px]" style={{ letterSpacing: '0.14em' }}>
                    PROPERTI SUDAH DITEMPATI
                  </p>
                  <p className="text-xs font-light text-muted mt-2" style={{ fontFamily: 'Jost' }}>
                    Aset ini telah diserahterimakan dan tidak menerima penawaran baru.
                  </p>
                </div>
              ) : property.status === 'dp' ? (
                <div className="py-4 px-4 text-center border border-deposit bg-deposit/5">
                  <p className="nav-label text-deposit text-[10px]" style={{ letterSpacing: '0.14em' }}>
                    PROSES PELUNASAN DP
                  </p>
                  <p className="text-xs font-light text-muted mt-2" style={{ fontFamily: 'Jost' }}>
                    Penawaran telah ditutup dan dalam tahap verifikasi administrasi pemenang.
                  </p>
                </div>
              ) : isAuctionEnded ? (
                <div className="py-4 px-4 text-center border border-line bg-bg">
                  <p className="nav-label text-charcoal text-[10px]" style={{ letterSpacing: '0.14em' }}>
                    MASA LELANG TELAH BERAKHIR
                  </p>
                  <p className="text-xs font-light text-muted mt-2" style={{ fontFamily: 'Jost' }}>
                    Penawaran tertinggi saat ini sedang dalam proses verifikasi pihak kurator.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="nav-label mb-2 text-muted text-[9px]" style={{ letterSpacing: '0.12em' }}>
                      PENAWARAN MINIMAL: {format(minRequired)}
                    </p>
                    <input
                      type="text"
                      value={bidInput}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setBidInput(raw ? Number(raw).toLocaleString('id-ID') : '');
                        setBidError('');
                        setBidSuccess('');
                      }}
                      placeholder={`Contoh: ${minRequired.toLocaleString('id-ID')}`}
                      className="w-full border min-h-[44px] py-3 px-4 text-sm font-light mb-2 bg-bg outline-none focus:border-indigo-brand"
                      style={{ fontFamily: 'Jost', fontSize: '14px' }}
                    />
                    {bidError && (
                      <p className="text-xs text-occupied font-light mb-2" style={{ fontFamily: 'Jost' }}>{bidError}</p>
                    )}
                    {bidSuccess && (
                      <p className="text-xs text-available font-medium mb-2 flex items-center gap-1" style={{ fontFamily: 'Jost' }}>
                        <Check size={14} />
                        {bidSuccess}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleBid}
                    disabled={bidLoading}
                    className="w-full nav-label min-h-[44px] py-4 text-white transition-opacity duration-300 hover:opacity-85 disabled:opacity-50 focus-visible:outline-none mb-3"
                    style={{ fontSize: '11px', letterSpacing: '0.18em', backgroundColor: 'var(--indigo-brand)' }}
                  >
                    {bidLoading ? 'MEMPROSES PENAWARAN...' : user ? 'AJUKAN PENAWARAN' : 'MASUK UNTUK MENAWAR'}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted text-center font-light" style={{ fontFamily: 'Jost' }}>
                    <ShieldCheck size={13} color="var(--indigo-brand)" />
                    <span>Penawaran Anda dijamin legal & transparan</span>
                  </div>
                </>
              )}

              {/* Bid history */}
              {bids.length > 0 && (
                <div className="mt-6 pt-6 border-t border-line">
                  <p className="nav-label mb-4 text-muted text-[9px]" style={{ letterSpacing: '0.14em' }}>
                    RIWAYAT PENAWARAN TERAKHIR ({bids.length})
                  </p>
                  <ul className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {bids.map((bid) => (
                      <li key={bid.id} className="flex justify-between items-center text-xs font-light" style={{ fontFamily: 'Jost' }}>
                        <div>
                          <span className="nav-label text-charcoal text-[10px]" style={{ letterSpacing: '0.08em' }}>
                            {bid.bidderName}
                          </span>
                          <span className="ml-2 text-muted text-[11px]">
                            {formatTime(bid.timestamp)}
                          </span>
                        </div>
                        <span className="text-indigo-brand font-medium">
                          {format(bid.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      <ScheduleVisitModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        property={property}
      />
    </>
  );
}
