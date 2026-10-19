import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export interface ToastState {
  visible: boolean;
  message: string;
}

interface OverlayContextType {
  activeOverlays: string[];
  openOverlay: (id: string, payload?: any, triggerElement?: HTMLElement | null) => void;
  closeOverlay: (id: string) => void;
  closeTopOverlay: () => boolean;
  closeAllOverlays: () => void;
  isOverlayOpen: (id: string) => boolean;
  isTopOverlay: (id: string) => boolean;
  getOverlayData: <T = any>(id: string) => T | undefined;
  registerTrigger: (id: string, el: HTMLElement | null) => void;
  toast: ToastState;
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOverlays, setActiveOverlays] = useState<string[]>([]);
  const [overlayData, setOverlayData] = useState<Record<string, any>>({});
  const triggersRef = useRef<Map<string, HTMLElement>>(new Map());
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });
  const toastTimeoutRef = useRef<any>(null);
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);

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
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      setActiveOverlays([]);
      setOverlayData({});
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
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

  const openOverlay = useCallback((id: string, payload?: any, triggerElement?: HTMLElement | null) => {
    if (triggerElement) {
      triggersRef.current.set(id, triggerElement);
    } else if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      triggersRef.current.set(id, document.activeElement);
    }

    if (payload !== undefined) {
      setOverlayData((prev) => ({ ...prev, [id]: payload }));
    }

    setActiveOverlays((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const closeOverlay = useCallback((id: string) => {
    setActiveOverlays((prev) => prev.filter((item) => item !== id));
    setOverlayData((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    // Return focus to the trigger element
    const trigger = triggersRef.current.get(id);
    if (trigger && typeof trigger.focus === 'function') {
      setTimeout(() => {
        try {
          trigger.focus();
        } catch {
          // ignore if unmounted
        }
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

  const closeAllOverlays = useCallback(() => {
    setActiveOverlays([]);
    setOverlayData({});
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

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

  const getOverlayData = useCallback(
    <T = any,>(id: string): T | undefined => {
      return overlayData[id] as T | undefined;
    },
    [overlayData]
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
        closeAllOverlays,
        isOverlayOpen,
        isTopOverlay,
        getOverlayData,
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
