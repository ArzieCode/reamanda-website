// ============================================================
// Component — AdminBar (Back-Office Switcher & Visitor Preview)
// ============================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../config/brand';
import { ShieldCheck, Edit3, LayoutDashboard, LogOut, Eye, EyeOff } from 'lucide-react';

export const AdminBar: React.FC = () => {
  const { isStaff, currentUser, logout, hasPermission } = useAuth();
  const { isEditMode, toggleEditMode, isVisitorPreview, toggleVisitorPreview } = useAdmin();

  if (!isStaff || !currentUser) return null;

  // If visitor preview is active, show small floating exit pill in corner
  if (isVisitorPreview) {
    return (
      <div className="fixed bottom-4 right-4 z-header">
        <button
          type="button"
          onClick={toggleVisitorPreview}
          className="px-3.5 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs font-sans uppercase tracking-wider rounded-[2px] shadow-lg flex items-center gap-2 border border-line"
        >
          <EyeOff size={14} />
          <span>Keluar dari Pratinjau Pengunjung</span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Bilah Administrator" className="w-full bg-indigo text-white h-10 border-b border-line/20 text-xs tracking-wider z-header">
      <div className="site-container h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium uppercase text-[11px] tracking-[0.18em]">
            <ShieldCheck size={14} className="stroke-[1.25]" />
            Admin {BRAND.name} ({currentUser.role})
          </span>

          <span className="text-white/40">|</span>

          {hasPermission('EDIT_CONTENT') && (
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-widest transition-colors rounded-[2px] ${
                isEditMode ? 'bg-white text-indigo font-medium' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Edit3 size={12} className="stroke-[1.25]" />
              Edit Langsung: {isEditMode ? 'ON' : 'OFF'}
            </button>
          )}

          <button
            onClick={toggleVisitorPreview}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white rounded-[2px] transition-colors"
            title="Sembunyikan semua kendali admin untuk melihat tampilan seperti pengunjung biasa"
          >
            <Eye size={12} />
            <span>Pratinjau Pengunjung</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-1 text-[11px] uppercase tracking-widest hover:text-white/80 transition-colors"
          >
            <LayoutDashboard size={13} className="stroke-[1.25]" />
            Dasbor Back-Office
          </Link>

          <span className="text-white/40">|</span>

          <button
            onClick={logout}
            className="flex items-center gap-1 text-[11px] uppercase tracking-widest hover:text-white/80 transition-colors"
          >
            <LogOut size={13} className="stroke-[1.25]" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
};
