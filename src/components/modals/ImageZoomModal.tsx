// ============================================================
// Modal — Image Lightbox Zoom
// Full-screen viewer for product photography
// ============================================================
import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import Placeholder from '../ui/Placeholder';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function ImageZoomModal({ isOpen, onClose, title }: ImageZoomModalProps) {
  const [scale, setScale] = React.useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setScale(1);
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
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Perbesar Gambar ${title}`}
      onClick={onClose}
    >
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.25))}
          className="p-2.5 bg-bg/20 hover:bg-bg/40 text-white rounded-full transition-colors focus-visible:outline-none"
          aria-label="Perbesar gambar"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(1, s - 0.25))}
          className="p-2.5 bg-bg/20 hover:bg-bg/40 text-white rounded-full transition-colors focus-visible:outline-none"
          aria-label="Perkecil gambar"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={onClose}
          className="p-2.5 bg-bg/20 hover:bg-bg/40 text-white rounded-full transition-colors focus-visible:outline-none"
          aria-label="Tutup penampil gambar"
        >
          <X size={18} />
        </button>
      </div>

      <div
        className="max-w-2xl w-full max-h-[85vh] transition-transform duration-300 flex items-center justify-center overflow-hidden"
        style={{ transform: `scale(${scale})` }}
        onClick={(e) => e.stopPropagation()}
      >
        <Placeholder ratio="3/4" label={`${title} (Resolusi Tinggi)`} className="w-full max-h-[85vh] shadow-2xl" />
      </div>
    </div>
  );
}
