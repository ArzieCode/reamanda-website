import React from 'react';
import { Modal } from './Modal';

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
  alt?: string;
  title?: string;
  caption?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  src,
  alt = 'Pratinjau Foto',
  title,
  caption,
}) => {
  if (!src) return null;

  return (
    <Modal
      id="lightbox-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={title}
      eyebrow="Arsip Visual"
    >
      <div className="space-y-3">
        <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-surface-2 border border-line overflow-hidden rounded-[2px]">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain bg-charcoal/5"
          />
        </div>
        {caption && (
          <p className="text-xs text-muted font-sans text-center m-0">
            {caption}
          </p>
        )}
      </div>
    </Modal>
  );
};
