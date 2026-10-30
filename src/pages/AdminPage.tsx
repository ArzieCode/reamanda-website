import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ShieldCheck, User, Lock, AlertCircle, LayoutDashboard } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { isAdmin, login, openDashboard } = useAdmin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('reamanda2025');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username.trim(), password.trim());
    if (ok) {
      setError(false);
      openDashboard();
    } else {
      setError(true);
    }
  };

  return (
    <div className="section-padding site-container max-w-xl">
      <div className="bg-white border border-line p-5 sm:p-8 md:p-10" style={{ borderRadius: '2px' }}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={20} className="text-indigo stroke-[1.25]" />
          <span className="label-editorial text-indigo">Portal Administrator</span>
        </div>

        <h1 className="font-serif text-charcoal text-2xl sm:text-3xl font-light mb-2">
          {isAdmin ? 'Mode Administrator Aktif' : 'Masuk Administrator'}
        </h1>

        <p className="text-xs text-muted font-sans mb-8">
          Sistem manajemen pesanan terpusat dan penyuntingan langsung.
        </p>

        {isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 bg-surface border border-line text-xs font-sans space-y-1">
              <p className="m-0 text-charcoal font-medium">Status: Sesi Administrator Aktif</p>
              <p className="m-0 text-muted">Anda memiliki izin untuk menyunting teks harga, status properti, menu katering, dan mengelola pesanan masuk.</p>
            </div>
            <button
              onClick={openDashboard}
              className="w-full py-3 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.18em] font-sans transition-opacity flex items-center justify-center gap-2"
              style={{ borderRadius: '2px' }}
            >
              <LayoutDashboard size={15} />
              <span>Buka Dasbor Pesanan & Pengaturan</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-status-occupied/10 border border-status-occupied/30 text-status-occupied text-xs flex items-center gap-2 font-sans">
                <AlertCircle size={14} />
                <span>Kredensial tidak valid. Silakan coba lagi.</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                Username
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none"
                  style={{ borderRadius: '2px' }}
                />
                <User size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1 font-sans">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none"
                  style={{ borderRadius: '2px' }}
                />
                <Lock size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            <div className="p-3 bg-surface border border-line text-[11px] text-muted space-y-0.5 font-sans break-words">
              <p className="m-0">Kredensial Default:</p>
              <p className="m-0 text-charcoal font-medium">Username: <code>admin</code> · Password: <code>reamanda2025</code></p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.18em] font-sans transition-opacity"
              style={{ borderRadius: '2px' }}
            >
              Masuk ke Dasbor
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
