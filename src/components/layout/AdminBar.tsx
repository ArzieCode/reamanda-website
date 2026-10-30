import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { BRAND } from '../../config/brand';
import { ShieldCheck, Edit3, LayoutDashboard, LogOut } from 'lucide-react';

export const AdminBar: React.FC = () => {
  const { isAdmin, isEditMode, toggleEditMode, openDashboard, logout } = useAdmin();

  if (!isAdmin) return null;

  return (
    <aside aria-label="Bilah Administrator" className="w-full bg-indigo text-white border-b border-line/20 text-xs tracking-wider z-header">
      <div className="site-container min-h-10 py-2 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
          <span className="flex items-center gap-1.5 font-medium uppercase text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] whitespace-nowrap">
            <ShieldCheck size={14} className="stroke-[1.25]" />
            <span className="sm:hidden">Admin</span><span className="hidden sm:inline">Mode Admin {BRAND.name}</span>
          </span>
          <button
            onClick={toggleEditMode}
            className={`flex min-h-9 items-center gap-1.5 px-2.5 text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest whitespace-nowrap transition-colors ${
              isEditMode ? 'bg-white text-indigo font-medium' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            style={{ borderRadius: '2px' }}
          >
            <Edit3 size={12} className="stroke-[1.25]" />
            <span className="sm:hidden">Edit: {isEditMode ? 'ON' : 'OFF'}</span>
            <span className="hidden sm:inline">Edit Langsung: {isEditMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 border-t border-white/20 sm:border-0">
          <button
            onClick={openDashboard}
            className="flex min-h-9 items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest whitespace-nowrap hover:text-white/80 transition-colors"
          >
            <LayoutDashboard size={13} className="stroke-[1.25]" />
            Dasbor<span className="hidden md:inline"> Pesanan</span>
          </button>
          <button
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
