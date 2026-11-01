// ============================================================
// Component — Hover Toolbar & Touch Menu for CMS Cards
// ============================================================
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import {
  Edit3,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  GripVertical,
} from 'lucide-react';

interface CardActionToolbarProps {
  onEdit: () => void;
  onDuplicate?: () => void;
  onToggleVisibility?: () => void;
  onDelete: () => void;
  isVisible?: boolean;
  className?: string;
}

export const CardActionToolbar: React.FC<CardActionToolbarProps> = ({
  onEdit,
  onDuplicate,
  onToggleVisibility,
  onDelete,
  isVisible = true,
  className = '',
}) => {
  const { isEditMode, isVisitorPreview } = useAdmin();
  const { hasPermission } = useAuth();
  const [touchMenuOpen, setTouchMenuOpen] = useState(false);

  if (!isEditMode || isVisitorPreview || !hasPermission('EDIT_CONTENT')) {
    return null;
  }

  return (
    <div className={`absolute top-2 right-2 z-30 ${className}`}>
      {/* Desktop Hover Toolbar */}
      <div className="hidden sm:flex items-center gap-1 bg-white/95 backdrop-blur-sm p-1 border border-line rounded-[2px] shadow-sm">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1 text-ink hover:text-caramel-deep rounded-[2px]"
          title="Sunting"
        >
          <Edit3 size={13} />
        </button>

        {onDuplicate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 text-ink hover:text-caramel-deep rounded-[2px]"
            title="Duplikat"
          >
            <Copy size={13} />
          </button>
        )}

        {onToggleVisibility && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`p-1 rounded-[2px] ${isVisible ? 'text-ink hover:text-caramel-deep' : 'text-muted'}`}
            title={isVisible ? 'Sembunyikan' : 'Tampilkan'}
          >
            {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Yakin ingin menghapus item ini? Anda dapat mengurungkannya nanti.')) {
              onDelete();
            }
          }}
          className="p-1 text-muted hover:text-status-occupied rounded-[2px]"
          title="Hapus"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Mobile Touch "..." Menu */}
      <div className="sm:hidden relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTouchMenuOpen((prev) => !prev);
          }}
          className="p-1.5 bg-white border border-line rounded-[2px] shadow-sm text-charcoal"
        >
          <MoreVertical size={14} />
        </button>

        {touchMenuOpen && (
          <div
            className="absolute right-0 mt-1 w-36 bg-white border border-line rounded-[2px] shadow-lg py-1 text-xs font-sans z-40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setTouchMenuOpen(false);
                onEdit();
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-surface flex items-center gap-2 text-ink"
            >
              <Edit3 size={12} /> Sunting
            </button>
            {onDuplicate && (
              <button
                type="button"
                onClick={() => {
                  setTouchMenuOpen(false);
                  onDuplicate();
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-surface flex items-center gap-2 text-ink"
              >
                <Copy size={12} /> Duplikat
              </button>
            )}
            {onToggleVisibility && (
              <button
                type="button"
                onClick={() => {
                  setTouchMenuOpen(false);
                  onToggleVisibility();
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-surface flex items-center gap-2 text-ink"
              >
                {isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                {isVisible ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setTouchMenuOpen(false);
                if (window.confirm('Hapus item ini?')) {
                  onDelete();
                }
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-surface flex items-center gap-2 text-status-occupied border-t border-line/60"
            >
              <Trash2 size={12} /> Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
