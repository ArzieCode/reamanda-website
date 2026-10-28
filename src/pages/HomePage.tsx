import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand';

const businessLines = [
  {
    name: 'Busana Muslimah',
    title: 'Busana Rheamanda',
    description: 'Jelajahi koleksi busana muslimah untuk keseharian dan momen istimewa.',
    logo: '/rheamanda-fashion-logo.png',
    alt: 'Logo Busana Rheamanda',
    path: '/busana',
    action: 'Jelajahi Busana',
  },
  {
    name: 'Kost Eksklusif Wanita',
    title: 'D’Rhea Syariah Guest House',
    description: 'Kenali hunian khusus wanita dan informasi kost D’Rhea Syariah.',
    logo: '/d-rhea-syariah-logo.png',
    alt: 'Logo D’Rhea Syariah Guest House',
    path: '/kost-wanita',
    action: 'Kenali Kost Wanita',
  },
  {
    name: 'Katering',
    title: 'Katering Rheamanda',
    description: 'Temukan layanan katering, pilihan paket, dan menu hidangan untuk acara Anda.',
    logo: '/rheamanda-mark.png',
    alt: 'Logo monogram R terbalik Katering Rheamanda',
    path: '/katering',
    action: 'Jelajahi Katering',
  },
] as const;

export const HomePage: React.FC = () => (
  <div className="w-full bg-surface">
    <section className="bg-charcoal text-white py-20 sm:py-28 lg:py-36">
      <div className="site-container max-w-4xl text-center space-y-7">
        <span className="label-editorial text-caramel block">Busana · Kost Wanita · Katering</span>
        <h1 className="font-display text-white font-light">Selamat Datang di {BRAND.name}</h1>
        <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          {BRAND.name} menaungi tiga lini usaha dengan identitasnya masing-masing. Kenali kami dan pilih layanan yang ingin Anda jelajahi.
        </p>
        <a href="#lini-usaha" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-charcoal text-xs uppercase tracking-[0.16em] hover:bg-caramel transition-colors">
          Pilih Lini Usaha <ArrowRight size={15} />
        </a>
      </div>
    </section>

    <section id="lini-usaha" className="section-padding site-container scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="label-editorial text-muted block mb-2">Tiga Lini Usaha</span>
        <h2 className="font-section-title text-charcoal">Temukan yang Anda Cari</h2>
        <p className="text-muted text-sm mt-4">Setiap lini memiliki halaman dan identitasnya sendiri.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {businessLines.map((line) => (
          <article key={line.path} className="bg-white border border-line p-6 flex flex-col group hover:border-charcoal transition-colors">
            <div className="aspect-[4/3] bg-white flex items-center justify-center mb-6 overflow-hidden">
              <img src={line.logo} alt={line.alt} className="max-w-full max-h-full h-auto w-auto object-contain p-4" />
            </div>
            <span className="label-editorial text-muted block mb-2">{line.name}</span>
            <h3 className="font-serif text-charcoal text-2xl font-light mb-3">{line.title}</h3>
            <p className="text-muted text-sm leading-relaxed mb-6 flex-1">{line.description}</p>
            <Link to={line.path} className="inline-flex items-center gap-2 border-t border-line pt-4 text-xs uppercase tracking-[0.16em] text-charcoal group-hover:text-caramel-deep font-medium transition-colors">
              {line.action} <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-white border-y border-line section-padding">
      <div className="site-container max-w-3xl text-center space-y-5">
        <span className="label-editorial text-muted block">Tentang {BRAND.name}</span>
        <h2 className="font-section-title text-charcoal">Tiga lini usaha, satu rumah</h2>
        <p className="text-ink text-base leading-relaxed">
          {BRAND.name} memperkenalkan busana muslimah, kost khusus wanita D’Rhea Syariah Guest House, dan layanan katering dalam satu tempat. Setiap lini dapat Anda kunjungi melalui halaman tersendiri.
        </p>
        <Link to="/tentang-kami" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-charcoal hover:text-caramel-deep">
          Kenali Rheamanda <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  </div>
);
