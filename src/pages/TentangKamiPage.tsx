// ============================================================
// Page — Tentang Kami (/tentang-kami)
// Founder story, timeline, filosofi desain
// ============================================================
import Placeholder from '../components/ui/Placeholder';

export default function TentangKamiPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 pb-28 md:pb-36">
      {/* Eyebrow & Title */}
      <div className="max-w-2xl mb-12">
        <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          TENTANG KAMI
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal leading-tight">
          Perjalanan Menghadirkan Keanggunan yang Tulus
        </h1>
      </div>

      {/* Main Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
        <div>
          <Placeholder ratio="3/4" label="Indria Miranda — Founder & Creative Director" className="w-full max-w-md mx-auto" />
        </div>
        <div className="space-y-6 text-sm font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', lineHeight: 1.9 }}>
          <p>
            Didirikan di Jakarta pada tahun 2009 oleh <strong>Indria Miranda</strong>, brand RiaMiranda lahir dari sebuah keyakinan bahwa kesederhanaan adalah bentuk tertinggi dari keanggunan. Bermula dari kreasi hijab pastel yang membawa angin segar bagi mode muslimah tanah air, kini RiaMiranda telah berkembang menjadi ekosistem gaya hidup terpadu.
          </p>
          <p>
            Setiap rancangan busana, properti peristirahatan, hingga sajian kuliner katering kami didasari oleh filosofi yang sama: ketulusan rasa, kehalalan, kelembutan warna bumi, dan dedikasi pada detail kualitas tertinggi.
          </p>
          <div className="pt-4 border-t border-line grid grid-cols-3 gap-6">
            <div>
              <p className="font-cormorant text-3xl text-charcoal">2009</p>
              <p className="nav-label text-[10px] text-muted">BERDIRI</p>
            </div>
            <div>
              <p className="font-cormorant text-3xl text-charcoal">3</p>
              <p className="nav-label text-[10px] text-muted">LINI BISNIS</p>
            </div>
            <div>
              <p className="font-cormorant text-3xl text-charcoal">15+</p>
              <p className="nav-label text-[10px] text-muted">TAHUN KARYA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nilai Inti */}
      <div className="border-t border-line pt-16">
        <p className="nav-label text-center text-muted mb-12" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          TIGA PILAR NILAI UTAMA
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border border-line bg-surface" style={{ '--tw-divide-opacity': 1 } as any}>
          <div className="p-8">
            <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>01. KEHALALAN & INTEGRITAS</p>
            <p className="text-xs font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
              Memastikan seluruh proses rancang busana memenuhi kaidah syar'i, transaksi properti yang transparan dan amanah, serta sertifikasi halal penuh pada setiap menu katering.
            </p>
          </div>
          <div className="p-8">
            <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>02. KETELITIAN CRAFTSMANSHIP</p>
            <p className="text-xs font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
              Bahan kain voal dan tenun berkualitas tinggi yang tidak mudah kusut, konstruksi bangunan properti yang kokoh, dan bumbu rempah pilihan racikan dapur profesional.
            </p>
          </div>
          <div className="p-8">
            <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>03. KEBERLANJUTAN KOMUNITAS</p>
            <p className="text-xs font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
              Mendukung pengrajin kain lokal Indonesia dan menciptakan ruang silaturahmi yang hangat melalui komunitas RiaMiranda Loyal Customer di seluruh nusantara.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
