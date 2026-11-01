// ============================================================
// Component — AddSectionCard (+ Tambah Card for Lists & Grids)
// ============================================================
import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

interface AddSectionCardProps {
  label: string;
  onClick: () => void;
  className?: string;
  minHeight?: string;
}

export const AddSectionCard: React.FC<AddSectionCardProps> = ({
  label,
  onClick,
  className = '',
  minHeight = 'min-h-[220px]',
}) => {
  const { isEditMode, isVisitorPreview } = useAdmin();
  const { hasPermission } = useAuth();

  if (!isEditMode || isVisitorPreview || !hasPermission('EDIT_CONTENT')) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full ${minHeight} border-2 border-dashed border-caramel/60 hover:border-caramel-deep bg-surface/30 hover:bg-surface flex flex-col items-center justify-center p-6 text-center transition-all group rounded-[2px] ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-white border border-caramel/40 group-hover:bg-caramel-deep group-hover:text-white flex items-center justify-center text-caramel-deep transition-colors mb-3">
        <Plus size={20} className="stroke-[1.5]" />
      </div>
      <span className="font-serif text-charcoal text-base font-normal group-hover:text-caramel-deep transition-colors">
        {label}
      </span>
      <span className="text-[11px] font-sans uppercase tracking-wider text-muted mt-1">
        Klik untuk menambahkan
      </span>
    </button>
  );
};
