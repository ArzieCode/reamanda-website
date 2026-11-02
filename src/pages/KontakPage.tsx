import React from 'react';
import { MapPin } from 'lucide-react';

export const KontakPage: React.FC = () => (
  <div className="w-full bg-surface">
    <section className="py-20 site-container max-w-4xl text-center space-y-4">
      <span className="label-editorial text-caramel-deep block">Informasi lokasi</span>
      <h1 className="font-section-title text-charcoal">Rheamanda Group</h1>
      <p className="text-ink text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">Berawal dari hunian syariah, berkembang menjadi ekosistem layanan akomodasi, fashion muslim, dan kuliner.</p>
    </section>
    <section className="site-container pb-24 max-w-4xl">
      <div className="bg-white border border-line p-8 md:p-12">
        <MapPin size={26} className="text-caramel-deep mb-5" aria-hidden="true" />
        <h2 className="font-serif text-charcoal text-3xl">Lokasi akomodasi syariah</h2>
        <p className="text-ink leading-relaxed mt-4">Jl. Jatipadang Utara No. 63, Pasar Minggu, Jakarta Selatan.</p>
        <p className="text-muted text-sm mt-6 border-t border-line pt-5">Alamat ini adalah alamat akomodasi, bukan alamat kantor pusat. Nomor telepon, email, media sosial, alamat kantor pusat, dan legalitas perusahaan belum tercantum dalam profil perusahaan yang diterima.</p>
      </div>
    </section>
  </div>
);