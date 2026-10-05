// ============================================================
// UI Component — Toast Container
// Stacked at top-center/right with standard z-index 70
// ============================================================
import { useToast } from '../../context/ToastContext';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-24 right-5 sm:right-8 z-[70] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifikasi sistem"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 border shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2"
            style={{
              backgroundColor: 'var(--bg)',
              borderColor: isError ? 'var(--occupied)' : isInfo ? 'var(--indigo-brand)' : 'var(--available)',
              borderLeftWidth: 4,
            }}
          >
            <div className="flex items-center gap-3">
              {isError ? (
                <AlertCircle size={18} color="var(--occupied)" strokeWidth={1.5} className="flex-shrink-0" />
              ) : isInfo ? (
                <Info size={18} color="var(--indigo-brand)" strokeWidth={1.5} className="flex-shrink-0" />
              ) : (
                <CheckCircle2 size={18} color="var(--available)" strokeWidth={1.5} className="flex-shrink-0" />
              )}
              <p
                className="text-xs font-light"
                style={{
                  color: 'var(--charcoal)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
              aria-label="Tutup notifikasi"
            >
              <X size={14} strokeWidth={1.5} color="var(--muted)" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
