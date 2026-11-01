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
    <aside aria-label="Bilah Administrator" className="w-full bg-indigo text-white border-b border-line/20 text-xs tracking-wider z-header">
      <div className="site-container min-h-10 py-2 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
          <span className="flex items-center gap-1.5 font-medium uppercase text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] whitespace-nowrap">
            <ShieldCheck size={14} className="stroke-[1.25]" />
            <span className="sm:hidden">Admin ({currentUser.role})</span>
            <span className="hidden sm:inline">Admin {BRAND.name} ({currentUser.role})</span>
          </span>
          {hasPermission('EDIT_CONTENT') && (
            <button
              type="button"
              onClick={toggleEditMode}
              className={`flex min-h-9 items-center gap-1.5 px-2.5 text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest whitespace-nowrap transition-colors rounded-[2px] ${
                isEditMode ? 'bg-white text-indigo font-medium' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Edit3 size={12} className="stroke-[1.25]" />
              <span className="sm:hidden">Edit: {isEditMode ? 'ON' : 'OFF'}</span>
              <span className="hidden sm:inline">Edit Langsung: {isEditMode ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 border-t border-white/20 sm:border-0">
          <button
            type="button"
            onClick={toggleVisitorPreview}
            className="flex min-h-9 items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest whitespace-nowrap hover:text-white/80 transition-colors"
            title="Sembunyikan semua kendali admin untuk melihat tampilan seperti pengunjung biasa"
          >
            <Eye size={13} />
            <span className="sm:hidden">Pratinjau</span>
            <span className="hidden sm:inline">Pratinjau Pengunjung</span>
          </button>
          <Link
            to="/admin"
            className="flex min-h-9 items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest whitespace-nowrap hover:text-white/80 transition-colors"
          >
            <LayoutDashboard size={13} className="stroke-[1.25]" />
            Dasbor<span className="hidden md:inline"> Back-Office</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex min-h-9 items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest whitespace-nowrap hover:text-white/80 transition-colors"
          >
            <LogOut size={13} className="stroke-[1.25]" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
};
