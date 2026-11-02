import React, { useState } from 'react';
import type { ClientPhoto } from '../../data/client-photos';
import { Lightbox } from './Lightbox';
import { useImageSrc } from '../../hooks/useImageSrc';

interface ClientPhotoGalleryProps {
  photos: readonly ClientPhoto[];
  title: string;
}

const PhotoTile: React.FC<{ photo: ClientPhoto; onSelect: (photo: ClientPhoto) => void }> = ({ photo, onSelect }) => {
  const resolvedSrc = useImageSrc(photo.src);
  if (!resolvedSrc) return null;
  return (
    <button type="button" onClick={() => onSelect({ ...photo, src: resolvedSrc })}
      aria-label={`Perbesar: ${photo.alt}`}
      className="group relative aspect-[4/3] overflow-hidden bg-surface-2 border border-line hover:border-indigo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo rounded-[2px]">
      <img src={resolvedSrc} alt={photo.alt} loading="lazy" decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </button>
  );
};

export const ClientPhotoGallery: React.FC<ClientPhotoGalleryProps> = ({ photos, title }) => {
  const [selected, setSelected] = useState<ClientPhoto | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {photos.map((photo) => <PhotoTile key={photo.src} photo={photo} onSelect={setSelected} />)}
      </div>
      <Lightbox
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        src={selected?.src}
        alt={selected?.alt}
        title={title}
        caption={selected?.alt}
      />
    </>
  );
};
