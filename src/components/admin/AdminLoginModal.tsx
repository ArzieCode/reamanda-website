import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useOverlay } from '../../context/OverlayContext';
import { Modal } from '../ui/Modal';
import { Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAdmin();
  const { showToast } = useOverlay();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('reamanda2025');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      setError(false);
      showToast('Berhasil masuk mode administrator.');
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <Modal
      id="admin-login-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      hideHeader
    >
      <div>
        <div className="flex items-center gap-2 mb-2 pr-12">
          <ShieldCheck size={20} className="text-indigo stroke-[1.25]" />
          <span className="label-editorial text-indigo">Portal Administrator</span>
        </div>

        <h3 className="font-serif text-charcoal text-2xl font-light mb-2">
          Masuk Administrator
        </h3>
        <p className="text-xs text-muted font-sans mb-6">
          Akses dasbor pesanan dan mode penyuntingan langsung konten editorial.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-status-occupied/10 border border-status-occupied/30 text-status-occupied text-xs flex items-center gap-2 font-sans">
            <AlertCircle size={14} />
            <span>Kredensial tidak valid. Silakan periksa kembali.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full pl-9 pr-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
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
                className="w-full pl-9 pr-3 py-2.5 border border-line text-sm text-ink focus:border-indigo focus:outline-none bg-white"
                style={{ borderRadius: '2px' }}
              />
              <Lock size={15} className="absolute left-3 text-muted" />
            </div>
          </div>

          <div className="p-3 bg-surface border border-line text-[11px] text-muted space-y-0.5 font-sans" style={{ borderRadius: '2px' }}>
            <p className="m-0">Kredensial Default Uji Coba:</p>
            <p className="m-0 text-charcoal font-medium">Username: <code>admin</code> · Password: <code>reamanda2025</code></p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 border border-line text-xs uppercase tracking-[0.16em] font-sans text-muted hover:text-charcoal transition-colors order-2 sm:order-1"
              style={{ borderRadius: '2px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo text-white hover:opacity-90 text-xs uppercase tracking-[0.18em] font-sans transition-opacity font-medium order-1 sm:order-2"
              style={{ borderRadius: '2px' }}
            >
              Masuk ke Dasbor
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
