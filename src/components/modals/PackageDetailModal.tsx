// ============================================================
// Modal — Detail Paket Katering
// Full menu inclusions, pricing, WhatsApp prefilled CTA
// ============================================================
import React, { useEffect } from 'react';
import { X, MessageCircle, Check } from 'lucide-react';
import type { CateringPackage } from '../../data/katering';
import { WHATSAPP_NUMBER } from '../../services/katering';
import { formatRupiah } from '../../utils/format';

interface PackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: CateringPackage | null;
  onSelectInquiry: (pkg: CateringPackage) => void;
}

export default function PackageDetailModal({ isOpen, onClose, pkg, onSelectInquiry }: PackageDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !pkg) return null;

  const waText = encodeURIComponent(
    `Halo RiaMiranda Katering, saya tertarik untuk konsultasi pemesanan ${pkg.name} (mulai ${formatRupiah(pkg.price)}/${pkg.unit}, min. ${pkg.minOrder} ${pkg.minUnit}). Mohon informasi ketersediaan tanggal dan penawaran resminya.`
  );

  return (
    <>
      <div
        className="fixed inset-0 z-[70] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(77,73,70,0.5)' }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label={`Detail Paket ${pkg.name}`}
      >
        <div
          className="pointer-events-auto w-full max-w-xl bg-bg border border-line p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
            <div>
              <p className="nav-label text-caramel-deep" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                SPESIFIKASI PAKET
              </p>
              <h2 className="font-cormorant font-light text-2xl sm:text-3xl text-charcoal">
                {pkg.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
              aria-label="Tutup detail paket"
            >
              <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-surface border border-line flex items-baseline justify-between">
            <div>
              <span className="font-light text-caramel-deep text-2xl" style={{ fontFamily: 'Jost, sans-serif' }}>
                {formatRupiah(pkg.price)}
              </span>
              <span className="text-sm font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                /{pkg.unit}
              </span>
            </div>
            <span className="nav-label text-muted" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>
              Min. {pkg.minOrder} {pkg.minUnit}
            </span>
          </div>

          <p className="text-sm font-light text-muted leading-relaxed mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
            {pkg.description}
          </p>

          <div className="border-t border-line pt-5 mb-8">
            <p className="nav-label text-charcoal mb-4" style={{ fontSize: '11px', letterSpacing: '0.16em' }}>
              KOMPOSISI & FASILITAS TERMASUK
            </p>
            <ul className="space-y-3">
              {pkg.inclusions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-light text-ink" style={{ fontFamily: 'Jost, sans-serif' }}>
                  <Check size={16} color="var(--caramel-deep)" strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 nav-label py-3 px-4 text-white hover:opacity-85 transition-opacity"
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                backgroundColor: 'var(--charcoal)',
              }}
            >
              <MessageCircle size={15} />
              CHAT VIA WHATSAPP
            </a>
            <button
              onClick={() => {
                onClose();
                onSelectInquiry(pkg);
              }}
              className="flex-1 min-h-[44px] nav-label py-3 px-4 border border-line hover:border-charcoal text-charcoal hover:bg-surface transition-colors focus-visible:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
              }}
            >
              ISI FORM KONSULTASI
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
