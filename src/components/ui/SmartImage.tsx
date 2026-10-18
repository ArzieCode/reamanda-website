import React, { useState } from 'react';
import { IMAGE_MANIFEST } from '../../data/images';
import { BRAND } from '../../config/brand';

export interface SmartImageProps {
  slot?: string;
  src?: string;
  alt?: string;
  category?: string;
  label?: string;
  aspectRatio?: '3:4' | '16:9' | '1:1' | '4:3' | 'custom';
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  slot,
  src: customSrc,
  alt: customAlt,
  category: customCategory,
  label: customLabel,
  aspectRatio = '3:4',
  className = '',
  priority = false,
  onLoad,
}) => {
  const [hasError, setHasError] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const manifestItem = slot ? IMAGE_MANIFEST[slot] : undefined;

  // Determine initial source: customSrc -> local manifest filename -> fallbackUrl
  const primarySrc = customSrc || manifestItem?.filename || manifestItem?.fallbackUrl || '';
  const fallbackSrc = manifestItem?.fallbackUrl;
  const currentSrc = usedFallback ? fallbackSrc : primarySrc;

  const resolvedAlt = customAlt || manifestItem?.alt || `Foto ${BRAND.name}`;
  const resolvedCategory = customCategory || manifestItem?.category || BRAND.name;
  const resolvedLabel = customLabel || manifestItem?.alt || slot || 'Arsip Visual';

  const aspectClass =
    aspectRatio === '3:4'
      ? 'aspect-[3/4]'
      : aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : aspectRatio === '1:1'
      ? 'aspect-square'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : '';

  const handleError = () => {
    // If we haven't tried the high-res fallback yet, try it
    if (!usedFallback && fallbackSrc && primarySrc !== fallbackSrc) {
      setUsedFallback(true);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div
        className={`w-full ${aspectClass} bg-surface-2 border border-line flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
        style={{ borderRadius: '2px' }}
      >
        <span className="label-editorial text-muted mb-2 tracking-[0.2em]">
          {resolvedCategory}
        </span>
        <h4 className="font-serif text-charcoal text-lg sm:text-xl font-light italic max-w-[240px] leading-tight">
          {resolvedLabel}
        </h4>
        <span className="mt-4 text-[11px] font-sans tracking-[0.14em] uppercase text-muted">
          {BRAND.name} Editorial
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden bg-surface-2 ${className}`}>
      <img
        src={currentSrc}
        alt={resolvedAlt}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleError}
        onLoad={onLoad}
        className="w-full h-full object-cover transition-opacity duration-500 ease-out"
        style={{ borderRadius: '2px' }}
      />
    </div>
  );
};
