import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { BRAND } from '../config/brand';
import { MessageCircle, MapPin, Mail, Phone, Clock } from 'lucide-react';

export const KontakPage: React.FC = () => {
  const { settings } = useAdmin();

  const directWaUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Halo Layanan Tamu ${BRAND.name}, saya ingin menyampaikan pertanyaan.`
  )}`;

  return (
    <div className="w-full bg-surface">
      <section className="py-20 site-container max-w-4xl text-center space-y-4">
        <span className="label-editorial text-muted block">Layanan Tamu & Komunikasi</span>
        <h1 className="font-section-title text-charcoal">
          Hubungi {BRAND.name} Studio
        </h1>
        <p className="text-ink text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto">
          Kami siap menyambut Anda untuk pertanyaan busana, kost eksklusif wanita, atau konsultasi katering.
        </p>
      </section>

      <section className="site-container pb-24 max-w-4xl">
        <div className="bg-white border border-line p-8 md:p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Direct WhatsApp Box */}
            <div className="bg-surface p-6 border border-line flex flex-col justify-between space-y-6">
              <div>
                <div className="w-10 h-10 bg-white border border-line flex items-center justify-center text-charcoal mb-4">
                  <MessageCircle size={20} className="stroke-[1.25]" />
                </div>
                <h3 className="font-serif text-charcoal text-2xl font-light mb-2">
                  Layanan Tamu via WhatsApp
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  Hubungi kami untuk pertanyaan koleksi busana, kost wanita, atau katering.
                </p>
              </div>

              <div>
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center justify-center gap-2"
                  style={{ borderRadius: '2px' }}
                >
                  <MessageCircle size={15} className="stroke-[1.25]" />
                  Hubungi via WhatsApp
                </a>
                <span className="text-[11px] text-muted block text-center mt-2 font-sans">
                  Nomor Resmi: +{settings.whatsappNumber}
                </span>
              </div>
            </div>

            {/* Studio Address Box */}
            <div className="bg-surface p-6 border border-line flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white border border-line flex items-center justify-center text-charcoal">
                  <MapPin size={20} className="stroke-[1.25]" />
                </div>
                <div>
                  <h3 className="font-serif text-charcoal text-2xl font-light mb-1">
                    Galeri & Kantor Pusat
                  </h3>
                  <p className="text-xs text-ink leading-relaxed font-sans">
                    {settings.officeAddress}
                  </p>
                </div>

                <div className="pt-2 border-t border-line text-xs font-sans space-y-2">
                  <div className="flex items-center gap-2 text-muted">
                    <Clock size={14} />
                    <span>Senin – Sabtu: 09.00 – 18.00 WIB</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Mail size={14} />
                    <span>{settings.companyEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Phone size={14} />
                    <span>(021) 720-2009</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-muted font-sans border-t border-line pt-3">
                Kunjungan butik Senopati tanpa reservasi dipersilakan selama jam operasional.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
