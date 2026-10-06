// ============================================================
// Floating Elements — Wishlist tab, Rewards, Chat Us
// Standardized z-index 50, collapsed to 44px icon circles under 768px
// Wired to global drawers and chat panel — theme-aware surfaces
// ============================================================
import { MessageCircle, Gift } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useRewards } from '../../context/RewardsContext';
import { useChat } from '../../context/ChatContext';

export default function FloatingElements() {
  const { toggleWishlistDrawer, items: wishlistItems } = useWishlist();
  const { toggleRewardsDrawer, points } = useRewards();
  const { toggleChat } = useChat();

  return (
    <>
      {/* Wishlist — vertical tab on right edge (desktop only, >= 768px) */}
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[50] hidden md:block"
        style={{ transform: 'translateY(-50%)' }}
      >
        <button
          onClick={() => toggleWishlistDrawer(true)}
          className="nav-label px-2.5 py-4 text-charcoal bg-surface border border-line border-r-0 rounded-l transition-opacity duration-400 hover:opacity-85 focus-visible:outline-none flex flex-col items-center justify-center gap-2 relative shadow-lg"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            width: '36px',
            boxSizing: 'border-box',
          }}
          aria-label={`Daftar Keinginan (${wishlistItems.length} produk tersimpan)`}
        >
          <span>WISHLIST</span>
          {wishlistItems.length > 0 && (
            <span
              className="w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-semibold"
              style={{ writingMode: 'horizontal-tb', backgroundColor: 'var(--sale)' }}
            >
              {wishlistItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Rewards — bottom-left: 44px circle on mobile, pill on desktop */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-[50]">
        <button
          onClick={() => toggleRewardsDrawer(true)}
          className="flex items-center justify-center text-charcoal bg-surface border border-line rounded-full transition-all duration-300 hover:opacity-90 focus-visible:outline-none w-11 h-11 md:w-auto md:h-11 md:px-4 md:gap-2 shadow-xl"
          style={{
            fontFamily: 'Jost, sans-serif',
          }}
          aria-label={`Program Hadiah (${points} poin)`}
        >
          <Gift size={16} strokeWidth={1.25} color="var(--caramel-deep)" className="flex-shrink-0" />
          <span
            className="hidden md:inline text-xs font-medium text-charcoal"
            style={{
              letterSpacing: '0.08em',
            }}
          >
            Hadiah ({points} Poin)
          </span>
        </button>
      </div>

      {/* Chat Us — bottom-right: 44px circle on mobile, pill on desktop */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[50]">
        <button
          onClick={() => toggleChat(true)}
          className="flex items-center justify-center text-charcoal bg-surface border border-line rounded-full transition-all duration-300 hover:opacity-90 focus-visible:outline-none w-11 h-11 md:w-auto md:h-11 md:px-4 md:gap-2 shadow-xl"
          style={{
            fontFamily: 'Jost, sans-serif',
          }}
          aria-label="Buka Obrolan Layanan Konsultan"
        >
          <MessageCircle size={16} strokeWidth={1.25} color="var(--color-accent)" className="flex-shrink-0" />
          <span
            className="hidden md:inline text-xs font-normal text-charcoal"
            style={{
              letterSpacing: '0.08em',
            }}
          >
            Tanya Kami
          </span>
        </button>
      </div>
    </>
  );
}
