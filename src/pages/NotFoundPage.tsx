import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="section-padding site-container max-w-xl text-center">
      <div className="bg-white border border-line p-12 space-y-6">
        <span className="label-editorial text-muted block">Halaman Tidak Ditemukan</span>
        <h1 className="font-display text-charcoal text-5xl font-light">404</h1>
        <p className="text-muted text-sm font-sans max-w-md mx-auto leading-relaxed">
          Halaman yang Anda tuju mungkin telah dipindahkan atau tautan yang dimasukkan kurang tepat.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="px-6 py-3 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2"
            style={{ borderRadius: '2px' }}
          >
            <ArrowLeft size={14} className="stroke-[1.25]" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
