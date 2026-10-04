// ============================================================
// Floating Elements — Wishlist tab, Rewards pill, Chat Us pill
// ============================================================
import React from 'react';
import { MessageCircle, Gift } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../../services/katering';

export default function FloatingElements() {
  return (
    <>
      {/* Wishlist — vertical tab on right edge */}
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30"
        style={{ transform: 'translateY(-50%)' }}
      >
        <button
          className="nav-label px-2 py-4 text-white transition-opacity duration-400 hover:opacity-80"
          style={{
            fontSize: '9px',
            letterSpacing: '0.18em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            backgroundColor: 'var(--charcoal)',
            borderRadius: '4px 0 0 4px',
          }}
          aria-label="Wishlist"
        >
          WISHLIST
        </button>
      </div>

      {/* Rewards — pill bottom-left */}
      <div className="fixed bottom-6 left-4 z-30">
        <button
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-full shadow-none transition-opacity duration-400 hover:opacity-80"
          style={{
            backgroundColor: 'var(--caramel)',
            fontSize: '10px',
            fontFamily: 'Jost, sans-serif',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
          aria-label="Program Rewards"
        >
          <Gift size={13} strokeWidth={1.25} color="#fff" />
          Rewards
        </button>
      </div>

      {/* Chat Us — pill bottom-right */}
      <div className="fixed bottom-6 right-6 z-30">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-full transition-opacity duration-400 hover:opacity-80"
          style={{
            backgroundColor: 'var(--charcoal)',
            fontSize: '10px',
            fontFamily: 'Jost, sans-serif',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
          aria-label="Chat Us via WhatsApp"
        >
          <MessageCircle size={13} strokeWidth={1.25} color="#fff" />
          Chat Us!
        </a>
      </div>
    </>
  );
}
