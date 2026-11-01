// ============================================================
// Component — Inline Editable Text with 20-Version History
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { contentService } from '../../services/content';
import type { ContentVersion } from '../../types/content';
import { Edit2, History, RotateCcw, Check, X, CornerDownLeft } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface EditableTextProps {
  contentKey: string;
  defaultText: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultText,
  className = '',
  as = 'span',
  multiline = false,
}) => {
  const { isEditMode, isVisitorPreview } = useAdmin();
  const { currentUser, hasPermission } = useAuth();
  const { showToast } = useOverlay();

  const [text, setText] = useState<string>(() => contentService.getContentValue(contentKey, defaultText));
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(text);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [versions, setVersions] = useState<ContentVersion[]>([]);

  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  const canEdit = isEditMode && !isVisitorPreview && hasPermission('EDIT_CONTENT');

  // Keep synced if content updates
  useEffect(() => {
    setText(contentService.getContentValue(contentKey, defaultText));
  }, [contentKey, defaultText]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    if (!canEdit) return;
    e.stopPropagation();
    setDraftText(text);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (draftText.trim() === '') return;
    setIsEditing(false);
    if (draftText !== text) {
      const userName = currentUser?.name || 'Admin';
      contentService.updateContent(contentKey, draftText, userName);
      setText(draftText);
      showToast('Perubahan teks berhasil disimpan.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraftText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const insertLineBreak = () => {
    setDraftText((prev) => prev + '\n');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const openHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    const list = contentService.getContentList();
    const item = list.find((c) => c.key === contentKey);
    setVersions(item?.versions || []);
    setShowHistoryModal(true);
  };

  const handleRevertVersion = (versionId: string) => {
    try {
      const updated = contentService.revertVersion(contentKey, versionId, currentUser?.name || 'Admin');
      setText(updated.value);
      setDraftText(updated.value);
      setShowHistoryModal(false);
      showToast('Versi teks sebelumnya berhasil dikembalikan.');
    } catch {
      showToast('Gagal mengembalikan versi.');
    }
  };

  // If in active edit state
  if (isEditing) {
    return (
      <span className="inline-block relative w-full z-20">
        <div className="relative border-2 border-dashed border-caramel bg-white p-1 rounded-sm shadow-sm">
          {multiline ? (
            <textarea
              ref={inputRef as any}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              rows={3}
              className="w-full text-sm text-ink bg-transparent border-0 p-1 outline-none resize-y font-sans"
            />
          ) : (
            <input
              ref={inputRef as any}
              type="text"
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="w-full text-sm text-ink bg-transparent border-0 p-1 outline-none font-sans"
            />
          )}

          {/* Inline save & line-break toolbar */}
          <div
            className="flex items-center gap-1.5 pt-1.5 border-t border-line/40 text-[11px] font-sans"
            onMouseDown={(e) => e.preventDefault()} // prevent premature blur
          >
            <button
              type="button"
              onClick={handleSave}
              className="px-2 py-0.5 bg-caramel-deep text-white flex items-center gap-1 hover:opacity-90 rounded-[2px]"
            >
              <Check size={11} /> Simpan
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-2 py-0.5 bg-surface text-ink hover:bg-surface-2 flex items-center gap-1 border border-line rounded-[2px]"
            >
              <X size={11} /> Batal
            </button>
            {multiline && (
              <button
                type="button"
                onClick={insertLineBreak}
                className="px-2 py-0.5 text-muted hover:text-charcoal flex items-center gap-1 ml-auto"
                title="Sisipkan baris baru"
              >
                <CornerDownLeft size={11} /> Baris Baru
              </button>
            )}
          </div>
        </div>
      </span>
    );
  }

  const Tag = as;

  return (
    <>
      <Tag
        className={`${className} ${
          canEdit
            ? 'group/edit cursor-pointer transition-all hover:outline hover:outline-1 hover:outline-dashed hover:outline-caramel rounded-[2px] relative'
            : ''
        }`}
        onClick={handleStartEdit}
      >
        {text}

        {/* Small floating toolbar on hover when edit mode is ON */}
        {canEdit && (
          <span
            className="hidden group-hover/edit:inline-flex items-center gap-1 absolute -top-5 right-0 bg-charcoal text-white text-[10px] px-1.5 py-0.5 shadow-sm rounded-[2px] z-20 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleStartEdit}
              className="hover:text-caramel flex items-center gap-0.5"
              title="Sunting Teks"
            >
              <Edit2 size={10} /> Sunting
            </button>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={openHistory}
              className="hover:text-caramel flex items-center gap-0.5"
              title="Riwayat Versi (20 terakhir)"
            >
              <History size={10} /> Versi
            </button>
          </span>
        )}
      </Tag>

      {/* Version History Modal */}
      {showHistoryModal && (
        <Modal
          id={`modal-history-${contentKey}`}
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          title={`Riwayat Versi Teks — ${contentKey}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-xs text-muted font-sans m-0">
              Menampilkan hingga 20 versi terakhir. Anda dapat mengembalikan teks ke versi sebelumnya kapan saja.
            </p>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {versions.length === 0 ? (
                <div className="p-4 bg-surface text-center text-xs text-muted font-sans">
                  Belum ada riwayat suntingan untuk teks ini.
                </div>
              ) : (
                versions.map((ver, idx) => (
                  <div
                    key={ver.id}
                    className="p-3 border border-line bg-surface/40 rounded-[2px] flex items-start justify-between gap-4 text-xs font-sans"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-charcoal">
                          {idx === 0 ? 'Versi Saat Ini' : `Versi #${versions.length - idx}`}
                        </span>
                        <span className="text-muted text-[11px]">
                          {new Date(ver.updatedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-muted text-[10px]">oleh {ver.updatedBy}</span>
                      </div>
                      <p className="text-ink font-serif italic text-sm m-0 bg-white p-2 border border-line/60 rounded-[2px]">
                        "{ver.value}"
                      </p>
                    </div>

                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleRevertVersion(ver.id)}
                        className="shrink-0 px-2.5 py-1 text-[11px] bg-charcoal text-white hover:bg-caramel-deep flex items-center gap-1 rounded-[2px] transition-colors"
                      >
                        <RotateCcw size={11} /> Kembalikan
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
