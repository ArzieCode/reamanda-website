// ============================================================
// Component — Reusable ImageField with Upload, Focal Point & Crop
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { saveImageBlob, getImageUrl, deleteImageBlob } from '../../services/idb';
import { Modal } from '../ui/Modal';
import {
  Upload,
  Link as LinkIcon,
  Crosshair,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  Check,
  AlertCircle,
  FileText,
} from 'lucide-react';

export interface ImageFieldProps {
  value?: string; // image ID or URL
  altText?: string;
  focalPoint?: { x: number; y: number }; // 0-100%
  aspectRatio?: '3:4' | '16:9' | '1:1' | '4:3' | 'custom';
  className?: string;
  onChange?: (val: { url: string; altText: string; focalPoint: { x: number; y: number } }) => void;
  onRemove?: () => void;
  label?: string;
  editable?: boolean; // Allow editing from the back-office without enabling live page edits.
}

export const ImageField: React.FC<ImageFieldProps> = ({
  value = '',
  altText: initialAlt = '',
  focalPoint: initialFocal = { x: 50, y: 50 },
  aspectRatio = '3:4',
  className = '',
  onChange,
  onRemove,
  label,
  editable = false,
}) => {
  const { isEditMode, isVisitorPreview } = useAdmin();
  const { hasPermission } = useAuth();
  const { showToast } = useOverlay();

  const [displayUrl, setDisplayUrl] = useState<string>(value);
  const [altText, setAltText] = useState(initialAlt);
  const [focalPoint, setFocalPoint] = useState(initialFocal);

  // Upload modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocalModalOpen, setIsFocalModalOpen] = useState(false);
  const [isAltModalOpen, setIsAltModalOpen] = useState(false);

  // Upload dialog states
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canEdit = (isEditMode || editable) && !isVisitorPreview && hasPermission('EDIT_CONTENT');

  // Resolve IndexedDB blobs if value is an id
  useEffect(() => {
    let active = true;
    if (value && value.startsWith('img-')) {
      getImageUrl(value).then((url) => {
        if (active && url) setDisplayUrl(url);
      });
    } else {
      setDisplayUrl(value);
    }
    return () => {
      active = false;
    };
  }, [value]);

  // Client-side canvas resize (max 1800px) and compress to JPEG/WebP
  const processAndResizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX_DIM = 1800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failure'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failure'));
          },
          'image/webp',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar untuk kompresi'));
      img.src = objectUrl;
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);

    // Validate type (jpg, png, webp, avif)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Format gambar tidak didukung. Harap gunakan JPG, PNG, WebP, atau AVIF.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran gambar melebihi batas 10MB.');
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(25);

      // Simulate smooth progress
      const pTimer = setInterval(() => {
        setProgress((prev) => (prev < 80 ? prev + 15 : prev));
      }, 100);

      const compressedBlob = await processAndResizeImage(file);
      clearInterval(pTimer);
      setProgress(90);

      const imageId = `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const resolvedUrl = await saveImageBlob(imageId, compressedBlob);

      setProgress(100);
      setDisplayUrl(resolvedUrl);
      setIsProcessing(false);
      setIsModalOpen(false);

      if (onChange) {
        onChange({ url: imageId, altText, focalPoint });
      }
      showToast('Gambar berhasil diunggah dan disimpan.');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses gambar.');
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setDisplayUrl(urlInput.trim());
    setIsModalOpen(false);
    if (onChange) {
      onChange({ url: urlInput.trim(), altText, focalPoint });
    }
    showToast('Tautan gambar diperbarui.');
  };

  const handleFocalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const newFocal = { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    setFocalPoint(newFocal);
    if (onChange) {
      onChange({ url: value || displayUrl, altText, focalPoint: newFocal });
    }
  };

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

  return (
    <div className={`relative group/image ${aspectClass} overflow-hidden bg-surface-2 rounded-[2px] ${className}`}>
      {displayUrl ? (
        <img
          src={displayUrl}
          alt={altText}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
          }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-muted">
          <ImageIcon size={32} className="stroke-[1] mb-2 opacity-60" />
          <span className="text-xs uppercase font-sans tracking-wider">{label || 'Belum Ada Foto'}</span>
        </div>
      )}

      {/* Hover toolbar when edit mode is ON */}
      {canEdit && (
        <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center p-2 z-20">
          <div className="bg-white/95 backdrop-blur-sm p-1.5 rounded-[2px] shadow-lg flex items-center gap-1.5 text-xs font-sans">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-2 py-1 bg-charcoal text-white hover:bg-caramel-deep flex items-center gap-1 rounded-[2px] transition-colors"
              title="Ganti Foto"
            >
              <RefreshCw size={12} /> Ganti
            </button>

            {displayUrl && (
              <>
                <button
                  type="button"
                  onClick={() => setIsFocalModalOpen(true)}
                  className="px-2 py-1 bg-surface text-ink hover:bg-surface-2 flex items-center gap-1 border border-line rounded-[2px] transition-colors"
                  title="Atur Titik Fokus (Focal Point)"
                >
                  <Crosshair size={12} /> Fokus ({focalPoint.x}%, {focalPoint.y}%)
                </button>

                <button
                  type="button"
                  onClick={() => setIsAltModalOpen(true)}
                  className="px-2 py-1 bg-surface text-ink hover:bg-surface-2 flex items-center gap-1 border border-line rounded-[2px] transition-colors"
                  title="Sunting Teks Alternatif (Alt)"
                >
                  <FileText size={12} /> Alt
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDisplayUrl('');
                    if (onRemove) onRemove();
                    else if (onChange) onChange({ url: '', altText: '', focalPoint: { x: 50, y: 50 } });
                    showToast('Foto dihapus.');
                  }}
                  className="p-1 text-muted hover:text-status-occupied rounded-[2px] transition-colors"
                  title="Hapus Foto"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Dialog Modal */}
      {isModalOpen && (
        <Modal
          id="upload-image-modal"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Kelola & Unggah Foto"
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Tabs: Berkas / URL */}
            <div className="flex border-b border-line">
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                className={`py-2 px-4 text-xs uppercase tracking-wider font-sans border-b-2 flex items-center gap-1.5 ${
                  uploadTab === 'file' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
                }`}
              >
                <Upload size={13} /> Unggah Berkas
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('url')}
                className={`py-2 px-4 text-xs uppercase tracking-wider font-sans border-b-2 flex items-center gap-1.5 ${
                  uploadTab === 'url' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
                }`}
              >
                <LinkIcon size={13} /> Tautan URL
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-status-occupied/10 border border-status-occupied/30 text-status-occupied text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {uploadTab === 'file' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                className="border-2 border-dashed border-line hover:border-caramel-deep p-8 text-center bg-surface/50 rounded-[2px] transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <Upload size={28} className="mx-auto text-muted stroke-[1.25] mb-2" />
                <p className="text-xs font-sans text-charcoal font-medium m-0 mb-1">
                  Klik atau seret foto ke area ini
                </p>
                <p className="text-[11px] font-sans text-muted m-0">
                  Mendukung JPG, PNG, WebP, AVIF hingga 10MB. Otomatis dikompres & disimpan di IndexedDB.
                </p>

                {isProcessing && (
                  <div className="mt-4 space-y-2">
                    <div className="w-full bg-line h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-caramel-deep h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted font-sans">
                      Mengompresi dan menyimpan ({progress}%)...
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                    URL Gambar Langsung
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans transition-colors rounded-[2px]"
                >
                  Terapkan Gambar
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}

      {/* Focal Point Picker Modal */}
      {isFocalModalOpen && (
        <Modal
          id="focal-point-modal"
          isOpen={isFocalModalOpen}
          onClose={() => setIsFocalModalOpen(false)}
          title="Atur Titik Fokus (Focal Point)"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-xs text-muted font-sans m-0">
              Klik pada bagian gambar yang ingin dijadikan pusat tampilan utama ketika dipotong di berbagai rasio layar.
            </p>

            <div
              className="relative w-full max-h-[60vh] overflow-hidden bg-black flex items-center justify-center cursor-crosshair border border-line"
              onClick={handleFocalClick}
            >
              <img src={displayUrl} alt={altText} className="max-w-full max-h-[50vh] object-contain select-none" />
              {/* Focal crosshair indicator */}
              <div
                className="absolute w-8 h-8 -ml-4 -mt-4 border-2 border-white rounded-full flex items-center justify-center pointer-events-none shadow-md"
                style={{
                  left: `${focalPoint.x}%`,
                  top: `${focalPoint.y}%`,
                  backgroundColor: 'rgba(166, 124, 66, 0.4)',
                }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-sans text-muted">
              <span>Koordinat fokus: X: {focalPoint.x}%, Y: {focalPoint.y}%</span>
              <button
                type="button"
                onClick={() => {
                  setIsFocalModalOpen(false);
                  showToast('Titik fokus berhasil diperbarui.');
                }}
                className="px-4 py-2 bg-charcoal text-white hover:bg-caramel-deep rounded-[2px] text-xs uppercase tracking-wider flex items-center gap-1"
              >
                <Check size={12} /> Simpan Fokus
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Alt Text Modal */}
      {isAltModalOpen && (
        <Modal
          id="alt-text-modal"
          isOpen={isAltModalOpen}
          onClose={() => setIsAltModalOpen(false)}
          title="Teks Alternatif Gambar (SEO & Aksesibilitas)"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Deskripsi Gambar (Alt Text)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Misal: Model mengenakan Abaya Zaleha Noir di selasar butik"
                className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAltModalOpen(false);
                if (onChange) {
                  onChange({ url: value || displayUrl, altText, focalPoint });
                }
                showToast('Teks alternatif berhasil disimpan.');
              }}
              className="w-full py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px]"
            >
              Simpan Alt Text
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
