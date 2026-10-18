import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useOverlay } from '../../context/OverlayContext';

export interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  ariaLabelledBy?: string;
  isDirty?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '720px';
  children: React.ReactNode;
  hideHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  id,
  isOpen,
  onClose,
  title,
  eyebrow,
  ariaLabelledBy,
  isDirty = false,
  maxWidth = '720px',
  children,
  hideHeader = false,
}) => {
  const { openOverlay, closeOverlay, isTopOverlay } = useOverlay();
  const [showDirtyConfirm, setShowDirtyConfirm] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync with OverlayContext
  useEffect(() => {
    if (isOpen) {
      openOverlay(id);
    } else {
      closeOverlay(id);
      setShowDirtyConfirm(false);
    }
    return () => {
      closeOverlay(id);
    };
  }, [isOpen, id, openOverlay, closeOverlay]);

  // Request close with dirty check
  const requestClose = useCallback(() => {
    if (isDirty) {
      setShowDirtyConfirm(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  const confirmDiscardAndClose = useCallback(() => {
    setShowDirtyConfirm(false);
    onClose();
  }, [onClose]);

  const cancelDiscard = useCallback(() => {
    setShowDirtyConfirm(false);
  }, []);

  // Escape key handler: only closes if this is the TOP-MOST overlay
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTopOverlay(id)) {
          e.preventDefault();
          e.stopPropagation();
          if (showDirtyConfirm) {
            setShowDirtyConfirm(false);
          } else {
            requestClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, id, isTopOverlay, showDirtyConfirm, requestClose]);

  // Focus trap & initial focus
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableSelectors =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusableElements = panel.querySelectorAll<HTMLElement>(focusableSelectors);
    if (focusableElements.length > 0) {
      // Focus first input or button
      const firstInput = panel.querySelector<HTMLElement>('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
      if (firstInput) {
        firstInput.focus();
      } else {
        focusableElements[0].focus();
      }
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const elements = panel.querySelectorAll<HTMLElement>(focusableSelectors);
      if (elements.length === 0) return;

      const firstEl = elements[0];
      const lastEl = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    panel.addEventListener('keydown', handleTabKey);
    return () => panel.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass =
    maxWidth === '720px'
      ? 'max-w-[720px]'
      : maxWidth === '4xl'
      ? 'max-w-4xl'
      : maxWidth === '3xl'
      ? 'max-w-3xl'
      : maxWidth === '2xl'
      ? 'max-w-2xl'
      : maxWidth === 'xl'
      ? 'max-w-xl'
      : maxWidth === 'lg'
      ? 'max-w-lg'
      : maxWidth === 'md'
      ? 'max-w-md'
      : maxWidth === 'sm'
      ? 'max-w-sm'
      : 'max-w-[720px]';

  const headingId = ariaLabelledBy || (title ? `${id}-title` : undefined);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-modal flex items-center justify-center p-4 sm:p-6 transition-opacity duration-250 ease-out"
      style={{ backgroundColor: 'var(--overlay)' }}
      onClick={(e) => {
        // Only close if clicking directly on the overlay backdrop
        if (e.target === overlayRef.current) {
          requestClose();
        }
      }}
    >
      {/* Modal Dialog Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className={`relative w-full ${maxWidthClass} max-h-[calc(100dvh-32px)] overflow-y-auto bg-white border border-line p-5 sm:p-8 rounded-[4px] shadow-2xl transition-all duration-350 ease-out translate-y-0 motion-reduce:transition-none`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 44x44px Accessible Touch Close (X) Button */}
        <button
          type="button"
          onClick={requestClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-11 h-11 flex items-center justify-center text-charcoal hover:text-caramel-deep transition-colors z-20 focus:outline-none focus:ring-1 focus:ring-charcoal"
          style={{ borderRadius: '2px' }}
          aria-label="Tutup"
        >
          <X size={20} className="stroke-[1.5]" />
        </button>

        {/* Dirty Form Confirmation Prompt */}
        {showDirtyConfirm && (
          <div
            role="alert"
            className="mb-6 p-4 bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans animate-in fade-in duration-150"
            style={{ borderRadius: '2px' }}
          >
            <div className="flex items-center gap-2 text-charcoal font-medium">
              <AlertTriangle size={18} className="text-caramel-deep shrink-0 stroke-[1.5]" />
              <span>Tutup tanpa mengirim? Data yang sudah diisi belum dikirim.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={cancelDiscard}
                className="px-3 py-1.5 border border-line text-ink hover:text-charcoal bg-white transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Lanjutkan Mengisi
              </button>
              <button
                type="button"
                onClick={confirmDiscardAndClose}
                className="px-3 py-1.5 bg-charcoal text-white hover:bg-caramel-deep transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Ya, Tutup
              </button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        {!hideHeader && (title || eyebrow) && (
          <div className="mb-6 pr-10">
            {eyebrow && (
              <span className="label-editorial text-muted block mb-1.5">
                {eyebrow}
              </span>
            )}
            {title && (
              <h3
                id={headingId}
                className="font-serif text-charcoal text-2xl sm:text-3xl font-light tracking-tight"
              >
                {title}
              </h3>
            )}
          </div>
        )}

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};
