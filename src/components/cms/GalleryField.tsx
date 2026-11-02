// ============================================================
// Component — GalleryField (Multiple Photos, Reorder, Cover, Undo)
// ============================================================
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { ImageField } from './ImageField';
import { ArrowLeft, ArrowRight, Star, Trash2, Plus, RotateCcw } from 'lucide-react';

interface GalleryFieldProps {
  images: string[];
  maxImages?: number;
  editable?: boolean;
  onChange: (images: string[]) => void;
}

export const GalleryField: React.FC<GalleryFieldProps> = ({
  images = [],
  maxImages = 8,
  editable = false,
  onChange,
}) => {
  const { isEditMode, isVisitorPreview } = useAdmin();
  const { hasPermission } = useAuth();
  const { showToast } = useOverlay();

  const [lastDeleted, setLastDeleted] = useState<{ url: string; index: number } | null>(null);

  const canEdit = (isEditMode || editable) && !isVisitorPreview && hasPermission('EDIT_CONTENT');

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [cover] = updated.splice(index, 1);
    updated.unshift(cover);
    onChange(updated);
    showToast('Foto sampul utama berhasil diatur.');
  };

  const handleDelete = (index: number) => {
    const deletedUrl = images[index];
    setLastDeleted({ url: deletedUrl, index });

    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
    showToast('Foto dihapus. Klik Urungkan untuk mengembalikan.');
  };

  const handleUndo = () => {
    if (!lastDeleted) return;
    const updated = [...images];
    updated.splice(lastDeleted.index, 0, lastDeleted.url);
    onChange(updated);
    setLastDeleted(null);
    showToast('Foto berhasil dikembalikan.');
  };

  const handleAddImage = (newVal: { url: string }) => {
    if (!newVal.url) return;
    const updated = [...images, newVal.url];
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Undo bar if a photo was deleted */}
      {lastDeleted && (
        <div className="p-2.5 bg-surface border border-line flex items-center justify-between text-xs font-sans rounded-[2px]">
          <span className="text-muted">1 foto baru saja dihapus.</span>
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-1 text-charcoal font-medium hover:text-caramel-deep"
          >
            <RotateCcw size={12} /> Urungkan
          </button>
        </div>
      )}

      {/* Grid of gallery thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((imgUrl, idx) => (
          <div key={`${imgUrl}-${idx}`} className="relative group border border-line bg-surface rounded-[2px] overflow-hidden">
            <ImageField
              value={imgUrl}
              editable={editable}
              aspectRatio="1:1"
              onChange={(res) => {
                if (!res.url) onChange(images.filter((_, index) => index !== idx));
                else {
                  const updated = [...images];
                  updated[idx] = res.url;
                  onChange(updated);
                }
              }}
            />

            {/* Cover badge */}
            {idx === 0 && (
              <span className="absolute top-1.5 left-1.5 bg-charcoal text-white text-[9px] uppercase font-sans tracking-wider px-1.5 py-0.5 rounded-[2px] z-10">
                Sampul
              </span>
            )}

            {/* Overlay reorder and actions */}
            {canEdit && (
              <div className="absolute bottom-0 inset-x-0 bg-charcoal/80 p-1 flex items-center justify-between text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'left')}
                    className="p-1 hover:text-caramel disabled:opacity-30"
                    title="Pindah ke kiri"
                  >
                    <ArrowLeft size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMove(idx, 'right')}
                    className="p-1 hover:text-caramel disabled:opacity-30"
                    title="Pindah ke kanan"
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className="p-1 hover:text-caramel"
                      title="Jadikan Foto Sampul"
                    >
                      <Star size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="p-1 hover:text-status-occupied"
                    title="Hapus foto"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add photo card if under max */}
        {canEdit && images.length < maxImages && (
          <div className="border-2 border-dashed border-line hover:border-caramel-deep aspect-square flex flex-col items-center justify-center p-3 text-center bg-surface/30 rounded-[2px] transition-colors">
            <ImageField
              value=""
              editable={editable}
              aspectRatio="1:1"
              label="+ Tambah Foto"
              onChange={handleAddImage}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted font-sans">
        <span>Foto 1 otomatis dijadikan foto sampul utama.</span>
        <span>{images.length} dari {maxImages} foto</span>
      </div>
    </div>
  );
};
