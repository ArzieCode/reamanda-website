// ============================================================
// Modal — Size Guide (Panduan Ukuran)
// Measurement tables for Scarves, Tops, Tunics, Dresses
// ============================================================
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
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

  if (!isOpen) return null;

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
        aria-label="Panduan Ukuran Produk"
      >
        <div
          className="pointer-events-auto w-full max-w-2xl bg-bg border border-line p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
            <div>
              <p className="nav-label text-muted" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>
                STANDAR UKURAN RIAMIRANDA
              </p>
              <h2 className="font-cormorant font-light text-2xl text-charcoal">
                Panduan Ukuran Busana {category ? `(${category})` : ''}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
              aria-label="Tutup panduan ukuran"
            >
              <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
            </button>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th className="p-3 nav-label font-medium" style={{ fontSize: '10px' }}>UKURAN</th>
                  <th className="p-3 nav-label font-medium" style={{ fontSize: '10px' }}>LINGKAR DADA (CM)</th>
                  <th className="p-3 nav-label font-medium" style={{ fontSize: '10px' }}>PANJANG BADAN (CM)</th>
                  <th className="p-3 nav-label font-medium" style={{ fontSize: '10px' }}>PANJANG LENGAN (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="p-3 font-medium text-charcoal">XS</td>
                  <td className="p-3 text-muted">88 – 92</td>
                  <td className="p-3 text-muted">135</td>
                  <td className="p-3 text-muted">56</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-charcoal">S</td>
                  <td className="p-3 text-muted">92 – 96</td>
                  <td className="p-3 text-muted">138</td>
                  <td className="p-3 text-muted">57</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-charcoal">M</td>
                  <td className="p-3 text-muted">96 – 100</td>
                  <td className="p-3 text-muted">140</td>
                  <td className="p-3 text-muted">58</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-charcoal">L</td>
                  <td className="p-3 text-muted">100 – 104</td>
                  <td className="p-3 text-muted">142</td>
                  <td className="p-3 text-muted">59</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-charcoal">XL</td>
                  <td className="p-3 text-muted">104 – 110</td>
                  <td className="p-3 text-muted">142</td>
                  <td className="p-3 text-muted">60</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-charcoal">All Size</td>
                  <td className="p-3 text-muted">96 – 108 (Fit to L/XL)</td>
                  <td className="p-3 text-muted">115 – 120 (Scarves 120x120)</td>
                  <td className="p-3 text-muted">Fleksibel</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-line pt-4 text-xs font-light text-muted space-y-2 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
            <p><strong>Tips Pengukuran:</strong> Gunakan meteran kain yang lentur. Ukur lingkar dada pada titik paling menonjol dengan posisi santai.</p>
            <p>Jika ukuran Anda berada di antara dua opsi, kami sarankan memilih ukuran yang lebih besar untuk siluet busana muslimah yang lebih syar'i dan leluasa bergerak.</p>
          </div>
        </div>
      </div>
    </>
  );
}
