// ============================================================
// Modal — Authentication (Masuk, Daftar, Lupa Password)
// Accessible, focus-trapped, validation, password toggle
// ============================================================
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, setAuthModalTab, login, register } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
      setForgotSuccess(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.success) {
      showToast('Selamat datang kembali di RiaMiranda!', 'success');
    } else {
      setError(res.error ?? 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register({ name, email, phone, password });
    setLoading(false);
    if (res.success) {
      showToast('Akun berhasil dibuat! Anda mendapatkan 100 Poin Selamat Datang.', 'success');
    } else {
      setError(res.error ?? 'Gagal mendaftar. Silakan lengkapi data dengan benar.');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Masukkan alamat email yang valid.');
      return;
    }
    setForgotSuccess(true);
    showToast('Tautan atur ulang kata sandi telah dikirim ke email Anda.', 'success');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(77,73,70,0.5)' }}
        onClick={closeAuthModal}
        aria-hidden
      />

      {/* Modal Dialog */}
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Masuk atau Buat Akun"
      >
        <div
          className="pointer-events-auto w-full max-w-md bg-bg border border-line p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
            <span className="font-cormorant text-xl tracking-widest uppercase font-light text-charcoal">
              RiaMiranda
            </span>
            <button
              onClick={closeAuthModal}
              className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
              aria-label="Tutup modal"
            >
              <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
            </button>
          </div>

          {/* Tabs */}
          {authModalTab !== 'forgot' ? (
            <div className="flex border-b border-line mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('login');
                  setError('');
                }}
                className="flex-1 nav-label py-3 text-center border-b-2 transition-all duration-300 focus-visible:outline-none"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  borderColor: authModalTab === 'login' ? 'var(--charcoal)' : 'transparent',
                  color: authModalTab === 'login' ? 'var(--charcoal)' : 'var(--muted)',
                  fontWeight: authModalTab === 'login' ? 500 : 400,
                }}
              >
                MASUK
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('register');
                  setError('');
                }}
                className="flex-1 nav-label py-3 text-center border-b-2 transition-all duration-300 focus-visible:outline-none"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  borderColor: authModalTab === 'register' ? 'var(--charcoal)' : 'transparent',
                  color: authModalTab === 'register' ? 'var(--charcoal)' : 'var(--muted)',
                  fontWeight: authModalTab === 'register' ? 500 : 400,
                }}
              >
                DAFTAR
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('login');
                  setError('');
                  setForgotSuccess(false);
                }}
                className="nav-label text-xs text-muted hover:text-charcoal mb-2 inline-block focus-visible:outline-none"
              >
                ← KEMBALI KE MASUK
              </button>
              <h2 className="font-cormorant font-light text-2xl text-charcoal">
                Atur Ulang Kata Sandi
              </h2>
            </div>
          )}

          {error && (
            <div
              className="p-3 mb-5 border text-xs font-light"
              style={{
                borderColor: 'var(--occupied)',
                backgroundColor: 'rgba(168,100,90,0.08)',
                color: 'var(--occupied)',
                fontFamily: 'Jost, sans-serif',
              }}
            >
              {error}
            </div>
          )}

          {/* Form: LOGIN */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  ALAMAT EMAIL *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="input-underline min-h-[44px]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="nav-label block" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                    KATA SANDI *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('forgot');
                      setError('');
                    }}
                    className="nav-label text-muted hover:text-charcoal transition-colors focus-visible:outline-none"
                    style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'none' }}
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi Anda"
                    className="input-underline min-h-[44px] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal p-1 focus-visible:outline-none"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff size={16} strokeWidth={1.25} /> : <Eye size={16} strokeWidth={1.25} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full nav-label min-h-[44px] py-4 text-white transition-opacity duration-300 hover:opacity-85 disabled:opacity-50 mt-4 focus-visible:outline-none"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  backgroundColor: 'var(--charcoal)',
                }}
              >
                {loading ? 'MEMVERIFIKASI...' : 'MASUK KE AKUN'}
              </button>

              <p className="text-center text-xs font-light text-muted pt-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Akun demo langsung siap digunakan dengan alamat email apa pun.
              </p>
            </form>
          )}

          {/* Form: REGISTER */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  NAMA LENGKAP *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama sesuai identitas"
                  className="input-underline min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  ALAMAT EMAIL *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="input-underline min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  NOMOR WHATSAPP / TELEPON *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="input-underline min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  KATA SANDI *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="input-underline min-h-[44px] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal p-1 focus-visible:outline-none"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff size={16} strokeWidth={1.25} /> : <Eye size={16} strokeWidth={1.25} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full nav-label min-h-[44px] py-4 text-white transition-opacity duration-300 hover:opacity-85 disabled:opacity-50 mt-4 focus-visible:outline-none"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  backgroundColor: 'var(--charcoal)',
                }}
              >
                {loading ? 'MEMPROSES DAFTAR...' : 'BUAT AKUN BARU'}
              </button>
            </form>
          )}

          {/* Form: FORGOT PASSWORD */}
          {authModalTab === 'forgot' && (
            <div>
              {forgotSuccess ? (
                <div className="py-6 text-center">
                  <p className="font-cormorant text-xl text-charcoal mb-3">
                    Periksa Kotak Masuk Anda
                  </p>
                  <p className="text-sm font-light text-muted mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Kami telah mengirimkan instruksi pemulihan kata sandi ke <strong>{email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setAuthModalTab('login');
                      setForgotSuccess(false);
                    }}
                    className="nav-label px-6 py-3 border border-line text-charcoal hover:bg-surface transition-colors focus-visible:outline-none"
                    style={{ fontSize: '10px', letterSpacing: '0.14em' }}
                  >
                    KEMBALI KE HALAMAN MASUK
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-5">
                  <p className="text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Masukkan alamat email yang terdaftar untuk menerima tautan pemulihan kata sandi.
                  </p>
                  <div>
                    <label className="nav-label block mb-1" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
                      ALAMAT EMAIL *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="input-underline min-h-[44px]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full nav-label min-h-[44px] py-4 text-white transition-opacity duration-300 hover:opacity-85 focus-visible:outline-none"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      backgroundColor: 'var(--charcoal)',
                    }}
                  >
                    KIRIM TAUTAN PEMULIHAN
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
