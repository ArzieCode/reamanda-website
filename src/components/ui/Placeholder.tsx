// ============================================================
// UI Component: Placeholder
// Warm neutral placeholder div with correct aspect ratio.
// Use everywhere real photography would appear.
// ============================================================
import React from 'react';

interface PlaceholderProps {
  /** Aspect ratio, e.g. "3/4", "16/9", "1/1" */
  ratio?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
}

const ratioMap: Record<string, string> = {
  '3/4': 'aspect-[3/4]',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '1/1': 'aspect-square',
  '2/3': 'aspect-[2/3]',
};

export default function Placeholder({ ratio = '3/4', label, className = '', style, dark = false }: PlaceholderProps) {
  const aspectClass = ratioMap[ratio] ?? 'aspect-[3/4]';
  return (
    <div
      className={`${aspectClass} w-full ${dark ? 'bg-surface-hero' : 'bg-surface'} flex items-center justify-center overflow-hidden ${className}`}
      style={style}
      aria-label={label ?? 'Gambar'}
      role="img"
    >
      {label && (
        <span
          className={`nav-label select-none ${dark ? 'text-white/60' : 'text-muted'}`}
          style={{ fontSize: '10px', letterSpacing: '0.14em' }}
        >
          {label.toUpperCase()}
        </span>
      )}
    </div>
  );
}
