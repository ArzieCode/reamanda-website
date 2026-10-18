import React from 'react';
import { useOverlay } from '../../context/OverlayContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useOverlay();

  if (!toast.visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-toast max-w-sm w-[calc(100vw-48px)] bg-charcoal text-white px-5 py-4 border border-line shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ borderRadius: '2px' }}
    >
      <div className="flex items-center gap-2.5">
        <CheckCircle2 size={18} className="text-status-available shrink-0 stroke-[1.5]" />
        <span className="text-xs font-sans tracking-wide leading-relaxed">
          {toast.message}
        </span>
      </div>
      <button
        type="button"
        onClick={hideToast}
        className="text-white/70 hover:text-white p-1 shrink-0"
        aria-label="Tutup notifikasi"
      >
        <X size={16} className="stroke-[1.5]" />
      </button>
    </div>
  );
};
