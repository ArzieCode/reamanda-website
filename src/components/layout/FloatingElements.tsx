// ============================================================
// Floating Elements — Wishlist tab, Rewards, Chat Us
// Standardized z-index 50, collapsed to 44px icon circles under 768px
// Unclipped vertical Wishlist tab (hidden under 768px)
// ============================================================
import { MessageCircle, Gift } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../../services/katering';

export default function FloatingElements() {
  return (
    <>
      {/* Wishlist — vertical tab on right edge (desktop only, >= 768px) */}
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[50] hidden md:block"
        style={{ transform: 'translateY(-50%)' }}
      >
        <button
          className="nav-label px-2.5 py-4 text-white transition-opacity duration-400 hover:opacity-85 focus-visible:outline-none flex items-center justify-center"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            backgroundColor: 'var(--charcoal)',
            borderRadius: '4px 0 0 4px',
            width: '34px',
            boxSizing: 'border-box',
          }}
          aria-label="Daftar Keinginan (Wishlist)"
        >
          WISHLIST
        </button>
      </div>

      {/* Rewards — bottom-left: 44px circle on mobile, pill on desktop */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-[50]">
        <button
          className="flex items-center justify-center text-white rounded-full transition-opacity duration-400 hover:opacity-85 focus-visible:outline-none w-11 h-11 md:w-auto md:h-11 md:px-4 md:gap-2"
          style={{
            backgroundColor: 'var(--caramel)',
            fontFamily: 'Jost, sans-serif',
          }}
          aria-label="Program Hadiah (Rewards)"
        >
          <Gift size={16} strokeWidth={1.25} color="#ffffff" className="flex-shrink-0" />
          <span
            className="hidden md:inline"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.06em',
            }}
          >
            Hadiah
          </span>
        </button>
      </div>

      {/* Chat Us — bottom-right: 44px circle on mobile, pill on desktop */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[50]">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-white rounded-full transition-opacity duration-400 hover:opacity-85 focus-visible:outline-none w-11 h-11 md:w-auto md:h-11 md:px-4 md:gap-2"
          style={{
            backgroundColor: 'var(--charcoal)',
            fontFamily: 'Jost, sans-serif',
          }}
          aria-label="Tanya Kami via WhatsApp"
        >
          <MessageCircle size={16} strokeWidth={1.25} color="#ffffff" className="flex-shrink-0" />
          <span
            className="hidden md:inline"
            style={{
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0.06em',
            }}
          >
            Tanya Kami
          </span>
        </a>
      </div>
    </>
  );
}
