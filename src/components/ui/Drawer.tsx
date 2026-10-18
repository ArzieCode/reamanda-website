import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useOverlay } from '../../context/OverlayContext';

export interface DrawerProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  side?: 'right' | 'left';
  isDirty?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // default sm:max-w-[420px]
}

export const Drawer: React.FC<DrawerProps> = ({
  id,
  isOpen,
  onClose,
  title,
  eyebrow,
  side = 'right',
  isDirty = false,
  children,
  footer,
  maxWidth = 'sm:max-w-[420px]',
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

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableSelectors =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusableElements = panel.querySelectorAll<HTMLElement>(focusableSelectors);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
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

  const isLeft = side === 'left';

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-drawer flex ${isLeft ? 'justify-start' : 'justify-end'} transition-opacity duration-250 ease-out`}
      style={{ backgroundColor: 'var(--overlay)' }}
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          requestClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`w-full ${maxWidth} bg-white h-full flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out ${
          isLeft ? 'border-r' : 'border-l'
        } border-line`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between shrink-0 bg-white">
          <div className="pr-4">
            {eyebrow && (
              <span className="label-editorial text-muted block mb-0.5">
                {eyebrow}
              </span>
            )}
            {title && (
              <h3 className="font-serif text-charcoal text-xl font-normal">
                {title}
              </h3>
            )}
          </div>

          {/* 44x44px Touch Close (X) Button */}
          <button
            type="button"
            onClick={requestClose}
            className="w-11 h-11 flex items-center justify-center text-charcoal hover:text-caramel-deep transition-colors shrink-0 focus:outline-none focus:ring-1 focus:ring-charcoal"
            aria-label="Tutup"
            style={{ borderRadius: '2px' }}
          >
            <X size={20} className="stroke-[1.5]" />
          </button>
        </div>

        {/* Dirty Form Confirmation Prompt */}
        {showDirtyConfirm && (
          <div
            role="alert"
            className="m-4 p-4 bg-surface border border-line text-xs font-sans space-y-3"
            style={{ borderRadius: '2px' }}
          >
            <div className="flex items-center gap-2 text-charcoal font-medium">
              <AlertTriangle size={18} className="text-caramel-deep shrink-0 stroke-[1.5]" />
              <span>Tutup tanpa mengirim? Data yang sudah diisi belum disimpan.</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={cancelDiscard}
                className="px-3 py-1.5 border border-line text-ink hover:text-charcoal bg-white transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDiscardAndClose}
                className="px-3 py-1.5 bg-charcoal text-white hover:bg-caramel-deep transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Sticky Footer Actions */}
        {footer && (
          <div className="p-5 sm:p-6 border-t border-line bg-white sticky bottom-0 z-10 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
