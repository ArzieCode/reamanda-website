import React from 'react';
import { SmartImage } from '../components/ui/SmartImage';
import { BRAND } from '../config/brand';

export const TentangKamiPage: React.FC = () => {
  return (
    <div className="w-full bg-surface">
      {/* Editorial Header */}
      <section className="py-20 site-container max-w-4xl text-center space-y-4">
        <span className="label-editorial text-muted block">Tentang Brand {BRAND.name}</span>
        <h1 className="font-section-title text-charcoal">
          Merawat Nilai Luhur Nusantara dalam Keanggunan Masa Kini
        </h1>
        <p className="text-ink text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Didirikan di Jakarta, kami mendedikasikan karya pada kesantunan yang memuliakan martabat wanita.
        </p>
      </section>

      {/* Main Content & Portrait */}
      <section className="site-container pb-24 max-w-4xl">
        <div className="bg-white border border-line p-8 md:p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5">
              <div className="border border-line p-2 bg-surface">
                <SmartImage
                  slot="about-portrait"
                  alt={`Studio dan Ruang Karya ${BRAND.name}`}
                  aspectRatio="3:4"
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-4 font-sans text-sm text-ink leading-relaxed">
              <span className="label-editorial text-charcoal block">Perjalanan Santun</span>
              <h2 className="font-serif text-2xl text-charcoal font-light">
                Dimulai dari Sketsa Teduh di Sudut Jakarta
              </h2>
              <p>
                {BRAND.name} lahir dari sebuah kegelisahan: sulitnya menemukan busana muslimah yang mengutamakan kenyamanan, siluet longgar santun, namun tetap berkarakter mode kontemporer.
              </p>
              <p>
                Dengan menggali kekayaan motif songket Pandai Sikek dan filosofi adat Minangkabau "Adat basandi syarak, syarak basandi Kitabullah", kami menghadirkan cetakan monogram eksklusif yang lembut, elegan, dan abadi.
              </p>
            </div>
          </div>

          <div className="border-t border-line pt-10 space-y-6">
            <span className="label-editorial text-charcoal block">Tiga Pilar Kehidupan</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface p-5 border border-line space-y-2">
                <h3 className="font-serif text-charcoal text-lg font-normal">Busana Muslimah</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Menjaga aurat dengan serat alami yang sejuk, lipit arsitektural, dan palet warna bumi yang menenangkan.
                </p>
              </div>

              <div className="bg-surface p-5 border border-line space-y-2">
                <h3 className="font-serif text-indigo text-lg font-normal">Kost Eksklusif Wanita</h3>
                <p className="text-xs text-muted leading-relaxed">
                  D’Rhea Syariah Guest House, hunian khusus wanita dalam keluarga Rheamanda.
                </p>
              </div>

              <div className="bg-surface p-5 border border-line space-y-2">
                <h3 className="font-serif text-caramel-deep text-lg font-normal">Katering Nusantara</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Kekayaan bumbu rempah autentik Nusantara yang disajikan dengan tata meja perjamuan beradat luhur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
