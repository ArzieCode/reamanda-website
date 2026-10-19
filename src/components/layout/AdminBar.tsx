import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { BRAND } from '../../config/brand';
import { ShieldCheck, Edit3, LayoutDashboard, LogOut } from 'lucide-react';

export const AdminBar: React.FC = () => {
  const { isAdmin, isEditMode, toggleEditMode, openDashboard, logout } = useAdmin();

  if (!isAdmin) return null;

  return (
    <aside aria-label="Bilah Administrator" className="w-full bg-indigo text-white h-10 border-b border-line/20 text-xs tracking-wider z-header">
      <div className="site-container h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium uppercase text-[11px] tracking-[0.18em]">
            <ShieldCheck size={14} className="stroke-[1.25]" />
            Mode Admin {BRAND.name}
          </span>
          <span className="text-white/40">|</span>
          <button
            onClick={toggleEditMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-widest transition-colors ${
              isEditMode ? 'bg-white text-indigo font-medium' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            style={{ borderRadius: '2px' }}
          >
            <Edit3 size={12} className="stroke-[1.25]" />
            Edit Langsung: {isEditMode ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openDashboard}
            className="flex items-center gap-1 text-[11px] uppercase tracking-widest hover:text-white/80 transition-colors"
          >
            <LayoutDashboard size={13} className="stroke-[1.25]" />
            Dasbor Pesanan
          </button>
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
