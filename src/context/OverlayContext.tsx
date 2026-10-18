import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export interface ToastState {
  visible: boolean;
  message: string;
}

interface OverlayContextType {
  activeOverlays: string[];
  openOverlay: (id: string, triggerElement?: HTMLElement | null) => void;
  closeOverlay: (id: string) => void;
  closeTopOverlay: () => boolean;
  isOverlayOpen: (id: string) => boolean;
  isTopOverlay: (id: string) => boolean;
  registerTrigger: (id: string, el: HTMLElement | null) => void;
  toast: ToastState;
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOverlays, setActiveOverlays] = useState<string[]>([]);
  const triggersRef = useRef<Map<string, HTMLElement>>(new Map());
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });
  const toastTimeoutRef = useRef<any>(null);
  const location = useLocation();

  // Scroll lock manager
  useEffect(() => {
    if (activeOverlays.length > 0) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow || '';
        document.body.style.paddingRight = originalPaddingRight || '';
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [activeOverlays.length]);

  // ALWAYS release scroll lock and close all overlays on route change
  useEffect(() => {
    if (activeOverlays.length > 0) {
      setActiveOverlays([]);
    }
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, [location.pathname]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  const registerTrigger = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      triggersRef.current.set(id, el);
    }
  }, []);

  const openOverlay = useCallback((id: string, triggerElement?: HTMLElement | null) => {
    if (triggerElement) {
      triggersRef.current.set(id, triggerElement);
    } else if (document.activeElement instanceof HTMLElement) {
      triggersRef.current.set(id, document.activeElement);
    }

    setActiveOverlays((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const closeOverlay = useCallback((id: string) => {
    setActiveOverlays((prev) => prev.filter((item) => item !== id));

    // Return focus to the trigger element
    const trigger = triggersRef.current.get(id);
    if (trigger && typeof trigger.focus === 'function') {
      setTimeout(() => {
        trigger.focus();
      }, 50);
      triggersRef.current.delete(id);
    }
  }, []);

  const closeTopOverlay = useCallback(() => {
    if (activeOverlays.length === 0) return false;
    const topId = activeOverlays[activeOverlays.length - 1];
    closeOverlay(topId);
    return true;
  }, [activeOverlays, closeOverlay]);

  const isOverlayOpen = useCallback(
    (id: string) => activeOverlays.includes(id),
    [activeOverlays]
  );

  const isTopOverlay = useCallback(
    (id: string) => {
      if (activeOverlays.length === 0) return false;
      return activeOverlays[activeOverlays.length - 1] === id;
    },
    [activeOverlays]
  );

  const showToast = useCallback((message: string, duration = 3000) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ visible: true, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ visible: false, message: '' });
  }, []);

  return (
    <OverlayContext.Provider
      value={{
        activeOverlays,
        openOverlay,
        closeOverlay,
        closeTopOverlay,
        isOverlayOpen,
        isTopOverlay,
        registerTrigger,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};
