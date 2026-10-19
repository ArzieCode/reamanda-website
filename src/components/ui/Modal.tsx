import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  maxWidth?: string; // e.g. "min(720px, 100%)", "3xl", "4xl"
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
  maxWidth,
  children,
  hideHeader = false,
}) => {
  const { openOverlay, closeOverlay, isTopOverlay } = useOverlay();
  const [showDirtyConfirm, setShowDirtyConfirm] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync with OverlayContext stack
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

  // Request close: overlay clicks and Escape prompt if isDirty; explicit X/Batal dismiss directly
  const handleBackdropOrEscapeClose = useCallback(() => {
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
            handleBackdropOrEscapeClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, id, isTopOverlay, showDirtyConfirm, handleBackdropOrEscapeClose]);

  // Focus trap & initial focus to first field
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableSelectors =
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

    // Delay slightly to ensure children are mounted
    const focusTimer = setTimeout(() => {
      const firstInput = panel.querySelector<HTMLElement>('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
      if (firstInput) {
        firstInput.focus();
      } else {
        const firstFocusable = panel.querySelector<HTMLElement>(focusableSelectors);
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    }, 50);

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
    return () => {
      clearTimeout(focusTimer);
      panel.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const headingId = ariaLabelledBy || (title ? `${id}-title` : undefined);

  // Width classes
  const panelWidthStyle: React.CSSProperties = maxWidth
    ? maxWidth.startsWith('min(') || maxWidth.endsWith('px') || maxWidth.endsWith('%')
      ? { width: maxWidth }
      : {}
    : { width: 'min(720px, 100%)' };

  const maxWidthClass =
    maxWidth === '4xl'
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

  const modalNode = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-modal flex items-center justify-center p-4 overflow-y-auto animate-modal-overlay"
      style={{
        backgroundColor: 'var(--overlay)',
      }}
      onClick={(e) => {
        // Only close if clicking directly on the overlay backdrop
        if (e.target === overlayRef.current) {
          handleBackdropOrEscapeClose();
        }
      }}
    >
      {/* Modal Dialog Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        style={{
          ...panelWidthStyle,
          maxHeight: 'calc(100dvh - 32px)',
        }}
        className={`relative w-full ${maxWidthClass} overflow-y-auto bg-white border border-line p-[20px] sm:p-[32px] rounded-[4px] shadow-2xl my-auto box-border focus:outline-none animate-modal-panel`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 44x44px Accessible Touch Close (X) Button */}
        <button
          type="button"
          onClick={() => {
            setShowDirtyConfirm(false);
            onClose();
          }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-[44px] h-[44px] flex items-center justify-center text-charcoal hover:text-caramel-deep transition-colors z-50 cursor-pointer touch-manipulation focus:outline-none focus:ring-1 focus:ring-charcoal"
          style={{ borderRadius: '2px' }}
          aria-label="Tutup"
        >
          <X size={20} className="stroke-[1.5]" />
        </button>

        {/* Dirty Form Confirmation Prompt */}
        {showDirtyConfirm && (
          <div
            role="alert"
            className="mb-4 sm:mb-6 p-4 bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans rounded-[2px]"
          >
            <div className="flex items-center gap-2 text-charcoal font-medium">
              <AlertTriangle size={18} className="text-caramel-deep shrink-0 stroke-[1.5]" />
              <span>Tutup tanpa mengirim? Data yang sudah diisi belum dikirim.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={cancelDiscard}
                className="px-3.5 py-1.5 border border-line text-ink hover:text-charcoal bg-white transition-colors rounded-[2px]"
              >
                Lanjutkan Mengisi
              </button>
              <button
                type="button"
                onClick={confirmDiscardAndClose}
                className="px-3.5 py-1.5 bg-charcoal text-white hover:bg-caramel-deep transition-colors rounded-[2px]"
              >
                Ya, Tutup
              </button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        {!hideHeader && (title || eyebrow) && (
          <div className="mb-6 pr-12">
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

  return createPortal(modalNode, document.body);
};
