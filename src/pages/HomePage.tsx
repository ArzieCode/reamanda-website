import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { BRAND } from '../config/brand';

const businessLines = [
  {
    number: '01',
    name: 'Busana Muslimah',
    title: 'Busana Rheamanda',
    description: 'Koleksi busana muslimah untuk keseharian dan momen istimewa. Temukan pilihan yang terasa dekat dengan gaya Anda.',
    logo: '/rheamanda-fashion-logo.png',
    alt: 'Logo Busana Rheamanda',
    path: '/busana',
    action: 'Jelajahi koleksi',
    toneClass: 'home-line-visual--fashion',
  },
  {
    number: '02',
    name: 'Kost Eksklusif Wanita',
    title: 'D’Rhea Syariah Guest House',
    description: 'Kenali lini hunian khusus wanita Rheamanda. Informasi kamar dan fasilitas akan dilengkapi setelah dikonfirmasi pengelola.',
    logo: '/d-rhea-syariah-logo.png',
    alt: 'Logo D’Rhea Syariah Guest House',
    path: '/kost-wanita',
    action: 'Kenali kost wanita',
    toneClass: 'home-line-visual--kost',
  },
  {
    number: '03',
    name: 'Katering',
    title: 'Katering Rheamanda',
    description: 'Lihat pilihan paket dan menu hidangan untuk acara Anda, lalu konsultasikan kebutuhan perjamuan bersama kami.',
    logo: '/rheamanda-mark.png',
    alt: 'Logo Katering Rheamanda',
    path: '/katering',
    action: 'Jelajahi katering',
    toneClass: 'home-line-visual--katering',
  },
] as const;

export const HomePage: React.FC = () => (
  <div className="w-full bg-surface">
    <section className="site-container grid lg:grid-cols-[1.2fr_0.8fr] min-h-[620px] lg:min-h-[680px] border-b border-line">
      <div className="flex flex-col justify-center py-20 lg:py-28 lg:pr-16 editorial-enter">
        <span className="label-editorial text-caramel-deep">Rheamanda · Tiga lini usaha</span>
        <h1 className="font-display mt-8 mb-8 max-w-[820px] text-charcoal">
          Satu rumah.<br /><em className="font-light">Tiga cerita.</em>
        </h1>
        <p className="text-base sm:text-lg text-ink leading-relaxed max-w-lg">
          {BRAND.name} mempertemukan busana muslimah, hunian khusus wanita, dan katering dalam satu tempat. Pilih cerita yang ingin Anda jelajahi.
        </p>
        <a href="#lini-usaha" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-charcoal pb-2 text-xs font-medium uppercase tracking-[0.16em] text-charcoal hover:text-caramel-deep hover:border-caramel-deep transition-colors">
          Temukan lini kami <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="relative min-h-[330px] lg:min-h-0 bg-charcoal text-white overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-14 editorial-enter editorial-delay">
        <span className="label-editorial text-white/70">Busana · Hunian · Perjamuan</span>
        <div className="space-y-8 max-w-sm">
          <div className="h-px w-16 bg-caramel" />
          <p className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white m-0">
            Setiap pilihan punya tempatnya sendiri.
          </p>
          <p className="text-sm text-white/75 m-0">Elegan, tulus, dan abadi.</p>
        </div>
        <span className="label-editorial text-white/50 self-end">Rheamanda</span>
      </div>
    </section>

    <section id="lini-usaha" className="site-container section-padding scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 lg:mb-16">
        <div>
          <span className="label-editorial text-caramel-deep">Jelajahi Rheamanda</span>
          <h2 className="font-section-title mt-3">Tiga lini, satu rumah.</h2>
        </div>
        <p className="text-sm text-muted md:text-right max-w-xs m-0">Setiap lini memiliki identitas dan halaman tersendiri.</p>
      </div>
      <div className="border-t border-line">
        {businessLines.map((line) => (
          <article key={line.path} className="grid lg:grid-cols-[80px_minmax(0,1fr)_minmax(300px,0.8fr)] gap-5 lg:gap-10 py-10 lg:py-14 border-b border-line items-center">
            <span className="label-editorial text-muted self-start lg:pt-4">{line.number} / 03</span>
            <div className="lg:py-8">
              <span className="label-editorial text-caramel-deep">{line.name}</span>
              <h3 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.06] mt-4 mb-5">{line.title}</h3>
              <p className="text-ink text-sm sm:text-base leading-relaxed max-w-md">{line.description}</p>
              <Link to={line.path} className="mt-7 inline-flex min-h-11 items-center gap-3 border-b border-charcoal text-xs uppercase tracking-[0.16em] font-medium text-charcoal hover:text-caramel-deep hover:border-caramel-deep transition-colors">
                {line.action} <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <Link to={line.path} aria-label={line.action} className={`home-line-visual ${line.toneClass} min-h-[270px] sm:min-h-[340px] flex items-center justify-center p-12 overflow-hidden`}>
              <img src={line.logo} alt={line.alt} className="w-full h-full max-w-[280px] max-h-[220px] object-contain" />
            </Link>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-white border-t border-line py-20 lg:py-24">
      <div className="site-container flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <span className="label-editorial text-caramel-deep">Tentang kami</span>
          <h2 className="font-section-title mt-3">Kenali rumah di balik tiga lini.</h2>
        </div>
        <Link to="/tentang-kami" className="inline-flex min-h-11 w-fit items-center gap-3 border-b border-charcoal text-xs uppercase tracking-[0.16em] font-medium text-charcoal hover:text-caramel-deep hover:border-caramel-deep transition-colors">
          Tentang Rheamanda <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  </div>
);