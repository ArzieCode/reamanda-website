// ============================================================
// Component — Customer & Staff Auth Modal (Login, Register, Reset)
// ============================================================
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { Modal } from '../ui/Modal';
import { evaluatePasswordStrength } from '../../services/crypto';
import { authService } from '../../services/auth';
import {
  User,
  Lock,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  KeyRound,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
}) => {
  const { login, register } = useAuth();
  const { showToast } = useOverlay();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(initialTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot password flow
  const [resetCodeOnScreen, setResetCodeOnScreen] = useState<string | null>(null);
  const [enteredResetCode, setEnteredResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & error states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength for registration
  const strength = evaluatePasswordStrength(password);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password, rememberMe);
      if (res.success) {
        showToast(`Selamat datang kembali, ${res.user?.name}!`);
        onClose();
      } else {
        setErrorMessage(res.errorMessage || 'Gagal masuk akun.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreePolicy) {
      setErrorMessage('Anda wajib menyetujui kebijakan privasi dan syarat ketentuan.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Kata sandi minimal 8 karakter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name,
        email,
        phone,
        password,
        agreePolicy,
      });

      if (res.success) {
        showToast(`Pendaftaran berhasil! Selamat datang, ${res.user?.name}.`);
        onClose();
      } else {
        setErrorMessage(res.errorMessage || 'Pendaftaran gagal.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage('Masukkan alamat surel Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.requestPasswordReset(email);
      if (res.success && res.resetCode) {
        setResetCodeOnScreen(res.resetCode);
        showToast('Kode verifikasi reset dibuat (Mode Demo).');
      } else {
        setErrorMessage(res.errorMessage || 'Surel tidak ditemukan.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal meminta reset sandi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!enteredResetCode.trim() || !newPassword) {
      setErrorMessage('Isi kode dan kata sandi baru.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.resetPasswordWithCode(email, enteredResetCode, newPassword);
      if (res.success) {
        showToast('Kata sandi berhasil diperbarui. Silakan masuk.');
        setResetCodeOnScreen(null);
        setActiveTab('login');
      } else {
        setErrorMessage(res.errorMessage || 'Gagal mengatur ulang kata sandi.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memperbarui sandi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo account quick filler
  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <Modal
      id="customer-auth-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={
        activeTab === 'login'
          ? 'Masuk ke Akun'
          : activeTab === 'register'
          ? 'Pendaftaran Akun Baru'
          : 'Lupa Kata Sandi'
      }
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Notice of Demo Mode */}
        <div className="p-3 bg-surface border border-line flex items-start gap-2.5 text-xs text-muted font-sans rounded-[2px]">
          <Info size={16} className="text-caramel shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-charcoal m-0 mb-0.5">Mode demo: akun tersimpan di browser ini.</p>
            <p className="m-0 text-[11px]">
              Kata sandi dienkripsi Web Crypto PBKDF2 + salt unik. Hubungkan backend untuk produksi.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        {activeTab !== 'forgot' && (
          <div className="flex border-b border-line">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-center text-xs uppercase tracking-wider font-sans border-b-2 transition-colors ${
                activeTab === 'login' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-center text-xs uppercase tracking-wider font-sans border-b-2 transition-colors ${
                activeTab === 'register' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
              }`}
            >
              Daftar Baru
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-status-occupied/10 border border-status-occupied/30 text-status-occupied text-xs flex items-center gap-2 rounded-[2px]">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Alamat Surel
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@domain.com"
                  className="w-full pl-9 pr-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
                <Mail size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs uppercase tracking-wider text-muted font-sans">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    setErrorMessage(null);
                  }}
                  className="text-[11px] text-caramel-deep hover:underline font-sans"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-9 pr-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
                <Lock size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-ink">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-line text-charcoal focus:ring-0"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans transition-colors rounded-[2px] disabled:opacity-50 font-medium"
            >
              {isSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}
            </button>

            {/* Quick Demo Accounts Selection */}
            <div className="pt-3 border-t border-line/60">
              <span className="text-[11px] text-muted block mb-1.5 uppercase font-sans tracking-wider">
                Pilih Akun Demo Cepat:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => handleFillDemo('owner@reamanda.com', 'Owner123!')}
                  className="p-1.5 border border-line bg-surface hover:bg-surface-2 text-left rounded-[2px]"
                >
                  <span className="font-medium text-charcoal block">Owner (Penuh)</span>
                  <span className="text-[10px] text-muted">owner@reamanda.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin@reamanda.com', 'Admin123!')}
                  className="p-1.5 border border-line bg-surface hover:bg-surface-2 text-left rounded-[2px]"
                >
                  <span className="font-medium text-charcoal block">Admin (Produk & CMS)</span>
                  <span className="text-[10px] text-muted">admin@reamanda.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('staf@reamanda.com', 'Staf123!')}
                  className="p-1.5 border border-line bg-surface hover:bg-surface-2 text-left rounded-[2px]"
                >
                  <span className="font-medium text-charcoal block">Staf (Pesanan)</span>
                  <span className="text-[10px] text-muted">staf@reamanda.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('aisyah@example.com', 'Aisyah123!')}
                  className="p-1.5 border border-line bg-surface hover:bg-surface-2 text-left rounded-[2px]"
                >
                  <span className="font-medium text-charcoal block">Pelanggan</span>
                  <span className="text-[10px] text-muted">aisyah@example.com</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Aisyah Putri"
                  className="w-full pl-9 pr-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
                <User size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Alamat Surel
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@domain.com"
                  className="w-full pl-9 pr-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
                <Mail size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Nomor WhatsApp / HP
              </label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812..."
                  className="w-full pl-9 pr-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
                <Phone size={15} className="absolute left-3 text-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-9 pr-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                />
                <Lock size={15} className="absolute left-3 text-muted" />
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted">Kekuatan:</span>
                    <span className="font-medium" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-line h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(strength.score / 4) * 100}%`,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  {strength.feedback.length > 0 && (
                    <span className="text-[10px] text-muted block font-sans">
                      {strength.feedback.join(' · ')}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs font-sans text-ink">
                <input
                  type="checkbox"
                  required
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                  className="mt-0.5 rounded border-line text-charcoal focus:ring-0"
                />
                <span>
                  Saya menyetujui kebijakan privasi, tata tertib santun, dan syarat layanan Rea Manda.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans transition-colors rounded-[2px] disabled:opacity-50 font-medium"
            >
              {isSubmitting ? 'Mendaftarkan...' : 'Daftar Akun'}
            </button>
          </form>
        )}

        {/* 3. Forgot Password Form */}
        {activeTab === 'forgot' && (
          <div className="space-y-4">
            {!resetCodeOnScreen ? (
              <form onSubmit={handleRequestResetCode} className="space-y-3">
                <p className="text-xs text-muted font-sans m-0">
                  Masukkan alamat surel yang terdaftar. Dalam mode demo, kode reset akan ditampilkan langsung di layar.
                </p>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                    Alamat Surel
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="px-4 py-2 border border-line text-xs uppercase tracking-wider font-sans rounded-[2px]"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px]"
                  >
                    Dapatkan Kode Reset
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                {/* Reset code display card */}
                <div className="p-4 bg-status-available/10 border border-status-available/30 text-charcoal text-center rounded-[2px] space-y-1">
                  <span className="text-[11px] uppercase font-sans tracking-wider text-status-available block font-medium">
                    Kode Reset Demo Anda:
                  </span>
                  <span className="font-mono text-2xl font-bold tracking-widest text-charcoal">
                    {resetCodeOnScreen}
                  </span>
                  <span className="text-[10px] text-muted block">
                    (Disimulasikan di layar tanpa pengiriman surel pihak ketiga)
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                    Masukkan Kode Verifikasi
                  </label>
                  <input
                    type="text"
                    required
                    value={enteredResetCode}
                    onChange={(e) => setEnteredResetCode(e.target.value)}
                    placeholder="Masukkan 6 digit kode di atas"
                    className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted mb-1 font-sans">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3 py-2 border border-line text-sm text-ink focus:border-charcoal focus:outline-none bg-white rounded-[2px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px]"
                >
                  Ubah Kata Sandi Sekarang
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
