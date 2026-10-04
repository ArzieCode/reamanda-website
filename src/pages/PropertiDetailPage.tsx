// ============================================================
// Properti Detail Page (/properti/:id)
// Sticky bid panel, countdown, live bid simulation
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Placeholder from '../components/ui/Placeholder';
import { getListing, getBids, placeBid, simulateLiveBid } from '../services/properti';
import type { Property, Bid } from '../types/properti';
import { formatRupiah, formatTime, getCountdown } from '../utils/format';
import { Clock, ChevronDown } from 'lucide-react';

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
        className="w-full flex items-center justify-between py-4 text-left transition-opacity duration-400 hover:opacity-70"
      >
        <span className="nav-label" style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>{title.toUpperCase()}</span>
        <ChevronDown size={16} strokeWidth={1.25} color="var(--charcoal)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 300ms ease' }} />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

export default function PropertiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidInput, setBidInput] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [activeThumb, setActiveThumb] = useState(0);

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
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!property) return;
    const tick = () => setCountdown(getCountdown(property.auctionEnd));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [property]);

  // Live bid simulation (only for tersedia)
  useEffect(() => {
    if (!property || property.status !== 'tersedia') return;
    const cleanup = simulateLiveBid(property.id, (newAmount) => {
      setCurrentBid(newAmount);
      setBids((prev) => [
        {
          id: `live-${Date.now()}`,
          propertyId: property.id,
          bidderName: ['H***i', 'R***a', 'D***o'][Math.floor(Math.random() * 3)],
          amount: newAmount,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });
    return cleanup;
  }, [property]);

  const handleBid = async () => {
    if (!property) return;
    setBidError('');
    setBidSuccess('');
    const amount = Number(bidInput.replace(/\D/g, ''));
    if (!amount) {
      setBidError('Masukkan jumlah penawaran yang valid.');
      return;
    }
    setBidLoading(true);
    const result = await placeBid(property.id, amount);
    setBidLoading(false);
    if (result.success && result.newBid) {
      setCurrentBid(result.newBid.amount);
      setBids((prev) => [result.newBid!, ...prev]);
      setBidInput('');
      setBidSuccess('Penawaran berhasil diajukan!');
    } else {
      setBidError(result.error ?? 'Penawaran gagal.');
    }
  };

  if (loading) {
    return <div className="max-w-screen-xl mx-auto px-6 py-20"><Placeholder ratio="16/9" /></div>;
  }

  if (!property) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-20 text-center">
        <p className="font-cormorant text-2xl font-light mb-4" style={{ color: 'var(--charcoal)' }}>Properti tidak ditemukan</p>
        <Link to="/properti" className="nav-label" style={{ fontSize: '11px', color: 'var(--indigo-brand)' }}>← Kembali ke Properti</Link>
      </div>
    );
  }

  const status = statusConfig[property.status];
  const minRequired = currentBid + property.minimumIncrement;

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-6 pb-20">
        {/* Breadcrumb */}
        <div className="flex gap-2 py-4 border-b mb-8" style={{ borderColor: 'var(--line)' }}>
          <Link to="/properti" className="nav-label hover:opacity-60 transition-opacity" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em' }}>PROPERTI</Link>
          <span className="nav-label" style={{ fontSize: '10px', color: 'var(--muted)' }}>/</span>
          <span className="nav-label" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.14em' }}>{property.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: gallery + details */}
          <div className="lg:col-span-2">
            <div className="mb-3">
              <Placeholder ratio="16/9" label={`${property.name} — ${activeThumb + 1}`} className="w-full" />
            </div>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <button key={i} onClick={() => setActiveThumb(i)} className="transition-opacity duration-400" style={{ opacity: activeThumb === i ? 1 : 0.5 }}>
                  <Placeholder ratio="16/9" label={`${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <p className="nav-label" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>{property.type.toUpperCase()}</p>
                <span
                  className="flex items-center gap-1.5 nav-label px-3 py-1"
                  style={{ fontSize: '9px', letterSpacing: '0.12em', color: status.color, border: `1px solid ${status.color}` }}
                >
                  <span className="rounded-full" style={{ width: 6, height: 6, backgroundColor: status.color }} />
                  {status.label.toUpperCase()}
                </span>
              </div>
              <h1 className="font-cormorant font-light mb-2" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'var(--charcoal)' }}>
                {property.name}
              </h1>
              <p className="font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '14px' }}>
                {property.location}
              </p>
            </div>

            {/* Spec table */}
            <div className="border-t border-b py-6 mb-8" style={{ borderColor: 'var(--line)' }}>
              <p className="nav-label mb-5" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>SPESIFIKASI</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(property.specs).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="nav-label mb-0.5" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.12em' }}>{k.toUpperCase()}</span>
                    <span className="font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '13px' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <p className="nav-label mb-3" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}>LOKASI</p>
              <p className="font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '14px' }}>{property.location}</p>
            </div>

            {/* Description */}
            <Accordion title="Deskripsi Properti">
              <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '14px', lineHeight: 1.85 }}>
                {property.description}
              </p>
            </Accordion>
          </div>

          {/* Right: Sticky bid panel */}
          <div>
            <div className="sticky top-[136px] border p-6" style={{ borderColor: 'var(--line)' }}>
              <p className="nav-label mb-6" style={{ fontSize: '10px', color: 'var(--indigo-brand)', letterSpacing: '0.16em' }}>PANEL PENAWARAN</p>

              {/* Prices */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-xs font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost' }}>Harga Awal</span>
                  <span className="text-sm font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost' }}>{formatRupiah(property.startingPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost' }}>Penawaran Tertinggi</span>
                  <span className="font-light transition-all duration-400" style={{ color: 'var(--indigo-brand)', fontFamily: 'Jost', fontSize: '17px' }}>
                    {formatRupiah(currentBid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost' }}>Kelipatan Min.</span>
                  <span className="text-sm font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost' }}>{formatRupiah(property.minimumIncrement)}</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2 py-3 px-4 mb-6" style={{ backgroundColor: 'var(--surface)' }}>
                <Clock size={14} strokeWidth={1.25} color="var(--muted)" />
                <div>
                  <span className="nav-label" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.12em' }}>WAKTU TERSISA: </span>
                  <span className="nav-label" style={{ fontSize: '13px', color: property.status === 'tersedia' ? 'var(--charcoal)' : 'var(--muted)', letterSpacing: '0.06em' }}>
                    {countdown}
                  </span>
                </div>
              </div>

              {/* Status-based content */}
              {property.status === 'ditempati' ? (
                <div className="py-4 px-4 text-center border" style={{ borderColor: 'var(--occupied)', backgroundColor: 'rgba(168,100,90,0.05)' }}>
                  <p className="nav-label" style={{ fontSize: '10px', color: 'var(--occupied)', letterSpacing: '0.14em' }}>
                    PROPERTI SUDAH DITEMPATI
                  </p>
                  <p className="text-xs font-light mt-2" style={{ color: 'var(--muted)', fontFamily: 'Jost' }}>
                    Penawaran tidak tersedia untuk properti ini.
                  </p>
                </div>
              ) : property.status === 'dp' ? (
                <div className="py-4 px-4 text-center border" style={{ borderColor: 'var(--deposit)', backgroundColor: 'rgba(199,154,75,0.05)' }}>
                  <p className="nav-label" style={{ fontSize: '10px', color: 'var(--deposit)', letterSpacing: '0.14em' }}>
                    MENUNGGU PELUNASAN DP
                  </p>
                  <p className="text-xs font-light mt-2" style={{ color: 'var(--muted)', fontFamily: 'Jost' }}>
                    Penawaran telah ditutup dan sedang dalam proses pelunasan uang muka.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <p className="nav-label mb-2" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.12em' }}>
                      MIN. PENAWARAN: {formatRupiah(minRequired)}
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
                      placeholder={`min. ${formatRupiah(minRequired)}`}
                      className="w-full border py-3 px-4 text-sm font-light mb-3 transition-colors duration-400 focus:outline-none"
                      style={{
                        borderColor: bidError ? 'var(--occupied)' : 'var(--line)',
                        color: 'var(--ink)',
                        fontFamily: 'Jost',
                        fontSize: '13px',
                        backgroundColor: 'var(--bg)',
                      }}
                    />
                    {bidError && (
                      <p className="text-xs font-light mb-3" style={{ color: 'var(--occupied)', fontFamily: 'Jost' }}>{bidError}</p>
                    )}
                    {bidSuccess && (
                      <p className="text-xs font-light mb-3" style={{ color: 'var(--available)', fontFamily: 'Jost' }}>{bidSuccess}</p>
                    )}
                  </div>
                  <button
                    onClick={handleBid}
                    disabled={bidLoading}
                    className="w-full nav-label py-4 text-white transition-opacity duration-400 hover:opacity-80 disabled:opacity-50"
                    style={{ fontSize: '11px', letterSpacing: '0.18em', backgroundColor: 'var(--indigo-brand)' }}
                  >
                    {bidLoading ? 'MEMPROSES...' : 'AJUKAN PENAWARAN'}
                  </button>
                </>
              )}

              {/* Bid history */}
              {bids.length > 0 && (
                <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--line)' }}>
                  <p className="nav-label mb-4" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    RIWAYAT PENAWARAN
                  </p>
                  <ul className="space-y-3 max-h-48 overflow-y-auto">
                    {bids.map((bid) => (
                      <li key={bid.id} className="flex justify-between items-center">
                        <div>
                          <span className="nav-label" style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.1em' }}>
                            {bid.bidderName}
                          </span>
                          <span className="ml-2 text-xs" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '11px' }}>
                            {formatTime(bid.timestamp)}
                          </span>
                        </div>
                        <span className="text-sm font-light" style={{ color: 'var(--indigo-brand)', fontFamily: 'Jost', fontSize: '13px' }}>
                          {formatRupiah(bid.amount)}
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
    </>
  );
}
