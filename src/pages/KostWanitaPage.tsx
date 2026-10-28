import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand';

export const KostWanitaPage: React.FC = () => (
  <div className="w-full bg-surface">
    <section className="site-container section-padding grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="space-y-6">
        <span className="label-editorial text-indigo block">Lini Hunian {BRAND.name}</span>
        <h1 className="font-display text-charcoal">Kost Eksklusif Wanita</h1>
        <p className="text-ink text-base sm:text-lg leading-relaxed max-w-lg">
          D’Rhea Syariah Guest House adalah nama tempat untuk lini kost eksklusif wanita {BRAND.name}.
          Informasi resmi kamar, fasilitas, dan tarif akan ditambahkan setelah dikonfirmasi pengelola.
        </p>
        <a
          href="#informasi-kost"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-charcoal text-white text-xs uppercase tracking-[0.16em] font-sans hover:bg-indigo transition-colors"
        >
          Informasi Kost <ArrowDown size={15} />
        </a>
      </div>
      <div className="flex items-center justify-center">
        <img
          src="/d-rhea-syariah-logo.png"
          alt="Logo D’Rhea Syariah Guest House"
          className="w-full max-w-[560px] h-auto object-contain"
        />
      </div>
    </section>

    <section id="informasi-kost" className="bg-white border-y border-line section-padding scroll-mt-20">
      <div className="site-container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        <div>
          <span className="label-editorial text-indigo block mb-3">D’Rhea Syariah Guest House</span>
          <h2 className="font-section-title text-charcoal mb-5">Satu tempat, satu identitas</h2>
          <p className="text-ink text-base leading-relaxed">
            Nama D’Rhea Syariah Guest House pada logo merujuk pada tempat yang sama dengan
            Kost Eksklusif Wanita di website ini. Logo tersebut khusus untuk lini kost.
            Identitas utama website tetap {BRAND.name}.
          </p>
        </div>
        <div className="border border-line bg-surface p-6 sm:p-8 space-y-5">
          <h3 className="font-serif text-charcoal text-2xl">Informasi kamar</h3>
          <p className="text-sm text-ink leading-relaxed">
            Tarif, alamat, fasilitas, dan ketersediaan kamar belum dicantumkan karena detailnya
            perlu dikonfirmasi terlebih dahulu kepada pengelola.
          </p>
          <p className="text-xs text-muted leading-relaxed border-t border-line pt-5">
            Setelah informasi resmi tersedia, bagian ini dapat dilengkapi dengan rincian kamar
            dan cara menghubungi pengelola.
          </p>
        </div>
      </div>
    </section>

    <section className="site-container py-16 text-center">
      <span className="label-editorial text-muted block mb-2">Jelajahi Rheamanda</span>
      <Link to="/katering" className="inline-flex items-center gap-2 text-charcoal hover:text-indigo text-sm font-sans">
        Lihat layanan katering <ArrowRight size={16} />
      </Link>
    </section>
  </div>
);
