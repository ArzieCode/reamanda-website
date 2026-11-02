import React, { useRef, useState } from 'react';
import { clientGalleryService, type ClientGalleryKind } from '../../services/client-gallery';
import type { ClientPhoto } from '../../data/client-photos';
import { useOverlay } from '../../context/OverlayContext';
import { GalleryField } from '../cms/GalleryField';

export const CateringGalleryManagementView: React.FC = () => {
  const { showToast } = useOverlay();
  const [kind, setKind] = useState<ClientGalleryKind>('kost');
  const [photosByKind, setPhotosByKind] = useState<Record<ClientGalleryKind, ClientPhoto[]>>(() => ({
    kost: clientGalleryService.getPhotos('kost'),
    lunchBox: clientGalleryService.getPhotos('lunchBox'),
    snackBox: clientGalleryService.getPhotos('snackBox'),
  }));
  const altCache = useRef(new Map<string, ClientPhoto>());
  const photos = photosByKind[kind];

  const save = (updated: ClientPhoto[]) => {
    try {
      clientGalleryService.savePhotos(kind, updated);
      setPhotosByKind((previous) => ({ ...previous, [kind]: updated }));
      showToast('Galeri katering tersimpan di browser ini.');
    } catch {
      showToast('Gagal menyimpan galeri. Periksa kapasitas penyimpanan browser.');
    }
  };

  const handleImagesChange = (images: string[]) => {
    photos.forEach((photo) => altCache.current.set(photo.src, photo));
    save(images.map((src, index) => altCache.current.get(src) || {
      src,
      alt: `Dokumentasi ${kind === 'kost' ? 'akomodasi' : kind === 'lunchBox' ? 'meal box' : 'snack dan sajian pendamping'} Rheamanda, foto ${index + 1}`,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="font-serif text-charcoal text-2xl font-light">Galeri Foto Situs</h2>
        <p className="text-xs text-muted font-sans mt-2 max-w-2xl">
          Tambah, ganti, susun, atau hapus dokumentasi akomodasi dan katering. Perubahan tersimpan langsung di browser ini;
          belum disinkronkan ke server maupun perangkat pengunjung lain.
        </p>
      </div>
      <div className="flex gap-2 border-b border-line font-sans text-xs uppercase tracking-wider">
        {(['kost', 'lunchBox', 'snackBox'] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => setKind(tab)}
            className={`px-4 py-3 border-b-2 ${kind === tab ? 'border-charcoal text-charcoal' : 'border-transparent text-muted'}`}>
            {tab === 'kost' ? 'Akomodasi' : tab === 'lunchBox' ? 'Meal Box' : 'Snack & Pendamping'} ({photosByKind[tab].length})
          </button>
        ))}
      </div>
      <GalleryField key={kind} images={photos.map((photo) => photo.src)} editable maxImages={60} onChange={handleImagesChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {photos.map((photo, index) => (
          <label key={`${photo.src}-${index}`} className="block text-xs text-muted font-sans">
            Keterangan foto {index + 1}
            <input aria-label={`Keterangan foto ${index + 1}`} value={photo.alt}
              onChange={(event) => save(photos.map((entry, i) => i === index ? { ...entry, alt: event.target.value } : entry))}
              className="block w-full mt-1 px-3 py-2 border border-line bg-white text-ink rounded-[2px]" />
          </label>
        ))}
      </div>
    </div>
  );
};
