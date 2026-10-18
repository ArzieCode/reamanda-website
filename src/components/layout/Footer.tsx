import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { MessageCircle, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminModal }) => {
  const { settings, isAdmin, openDashboard } = useAdmin();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentYear = 2025;
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    'Halo RiaMiranda, saya ingin berkonsultasi mengenai koleksi busana, akomodasi, atau katering perjamuan.'
  )}`;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Mohon masukkan alamat surel yang valid.');
      return;
    }

    try {
      const stored = localStorage.getItem('riamiranda_newsletter_emails');
      const list = stored ? JSON.parse(stored) : [];
      if (!list.includes(email.toLowerCase())) {
        list.push(email.toLowerCase());
        localStorage.setItem('riamiranda_newsletter_emails', JSON.stringify(list));
      }
      setIsSubscribed(true);
      setEmail('');
    } catch {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-charcoal text-white select-none">
      {/* Top Hairline in Caramel */}
      <div className="w-full h-[1px] bg-caramel opacity-40" />

      <div className="site-container py-16 lg:py-24">
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-caramel/30">
          {/* Column 1: Brand & Founder Info */}
          <div className="space-y-4">
            <span className="font-serif text-white tracking-[0.22em] uppercase text-2xl block">
              RIAMIRANDA
            </span>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm font-sans font-light">
              Didirikan di Jakarta tahun 2009 oleh Indria Miranda. Menghadirkan siluet busana muslimah bersahaja, ruang inap berarsitektur teduh, dan perjamuan adat bercita rasa luhur.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-sans text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <MessageCircle size={14} className="stroke-[1.25]" />
                Hubungi via WhatsApp
              </a>
            </div>
          </div>

          {/* Column 2: Busana Muslimah */}
          <div className="space-y-3">
            <span className="label-editorial text-caramel block tracking-[0.18em]">
              Busana Muslimah
            </span>
            <div className="w-6 h-[1px] bg-caramel opacity-50 mb-3" />
            <ul className="space-y-2 text-sm text-white/80 font-sans font-light">
              <li>
                <Link to="/busana#terbaru" className="hover:text-white transition-colors">
                  Produk Terbaru 2025
                </Link>
              </li>
              <li>
                <Link to="/busana#koleksi" className="hover:text-white transition-colors">
                  Koleksi Senja Jakarta
                </Link>
              </li>
              <li>
                <Link to="/busana#koleksi" className="hover:text-white transition-colors">
                  Koleksi Warisan Minang
                </Link>
              </li>
              <li>
                <Link to="/busana?kategori=Hijab" className="hover:text-white transition-colors">
                  Hijab Voal Monogram
                </Link>
              </li>
              <li>
                <Link to="/busana?filter=sale" className="hover:text-sale transition-colors flex items-center gap-2">
                  <span>Koleksi Sale</span>
                  <span className="bg-sale text-white text-[9px] px-1.5 py-0.2 tracking-wider uppercase" style={{ borderRadius: '9999px' }}>
                    Sale
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Living & Perjamuan */}
          <div className="space-y-3">
            <span className="label-editorial text-caramel block tracking-[0.18em]">
              Living & Perjamuan
            </span>
            <div className="w-6 h-[1px] bg-caramel opacity-50 mb-3" />
            <ul className="space-y-2 text-sm text-white/80 font-sans font-light">
              <li>
                <Link to="/properti?kategori=Hotel" className="hover:text-white transition-colors">
                  Boutique Hotel Dharmawangsa
                </Link>
              </li>
              <li>
                <Link to="/properti?kategori=Rumah" className="hover:text-white transition-colors">
                  Villa Privat & Hunian Keluarga
                </Link>
              </li>
              <li>
                <Link to="/properti?kategori=Ruko" className="hover:text-white transition-colors">
                  Galeri Komersial & Tanah
                </Link>
              </li>
              <li>
                <Link to="/katering#paket" className="hover:text-white transition-colors">
                  Paket Pernikahan & Resepsi
                </Link>
              </li>
              <li>
                <Link to="/katering#menu" className="hover:text-white transition-colors">
                  Jamuan Nusantara & Tumpeng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription (Validate & Store Locally) */}
          <div className="space-y-3">
            <span className="label-editorial text-caramel block tracking-[0.18em]">
              Warta Editorial
            </span>
            <div className="w-6 h-[1px] bg-caramel opacity-50 mb-3" />
            <p className="text-white/80 text-xs font-sans leading-relaxed">
              Dapatkan kurasi koleksi busana teranyar, informasi akomodasi akhir pekan, dan menu istimewa perjamuan langsung ke kotak masuk Anda.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-white/10 border border-caramel/40 text-xs font-sans text-white flex items-center gap-2">
                <Check size={14} className="stroke-[1.5] text-caramel" />
                <span>Terima kasih telah bergabung dengan warta RiaMiranda.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Alamat surel Anda"
                    className="w-full bg-white/10 text-white placeholder-white/50 text-xs px-3 py-2.5 border border-white/20 focus:border-caramel focus:outline-none"
                    style={{ borderRadius: '2px 0 0 2px' }}
                    required
                  />
                  <button
                    type="submit"
                    className="px-3.5 bg-caramel text-white hover:bg-caramel-deep transition-colors shrink-0 flex items-center justify-center"
                    style={{ borderRadius: '0 2px 2px 0' }}
                    title="Daftar Warta"
                  >
                    <ArrowRight size={14} className="stroke-[1.25]" />
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-[11px] text-white/90 font-sans">{errorMessage}</p>
                )}
              </form>
            )}

            <div className="pt-2 text-[11px] text-white/60 font-sans">
              <p className="m-0">Privasi Anda senantiasa kami jaga dengan penuh amanah.</p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar with Caramel Hairline Accent */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70 font-sans">
          <p className="m-0">
            © {currentYear} RiaMiranda. Seluruh hak cipta dilindungi undang-undang. Jakarta, Indonesia.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/tentang-kami" className="hover:text-white transition-colors">
              Tentang Brand
            </Link>
            <Link to="/kontak" className="hover:text-white transition-colors">
              Kontak
            </Link>
            {isAdmin ? (
              <button
                onClick={openDashboard}
                className="flex items-center gap-1.5 text-caramel hover:text-white transition-colors font-medium"
              >
                <ShieldCheck size={13} />
                <span>Dasbor Admin</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="hover:text-white transition-colors flex items-center gap-1.5 text-white/60"
              >
                <ShieldCheck size={13} />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
