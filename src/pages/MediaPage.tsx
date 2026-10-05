// ============================================================
// Page — Media & Siaran Pers (/media)
// Publications, fashion week coverage, press contacts
// ============================================================
import Placeholder from '../components/ui/Placeholder';

const PRESS_RELEASES = [
  {
    date: '18 September 2024',
    title: 'RiaMiranda Meluncurkan Koleksi Eksklusif Luminara 2024 di Jakarta Fashion Week',
    source: 'Press Release Resmi',
    summary: 'Mengusung keindahan fajar nusantara dengan siluet anggun dan palet warna bumi, koleksi Luminara sukses memukau panggung pagelaran mode terakbar.',
  },
  {
    date: '04 Agustus 2024',
    title: 'Ekspansi Bisnis: RiaMiranda Resmikan Portofolio Peristirahatan Vila Butik di Ubud, Bali',
    source: 'Warta Bisnis Properti',
    summary: 'Memperluas lini bisnis hospitality dengan menghadirkan hunian lelang eksklusif bernuansa asri dan arsitektur tropis modern.',
  },
  {
    date: '12 Mei 2024',
    title: 'RiaMiranda Katering Raih Penghargaan Best Modest Catering Service 2024',
    source: 'Culinary Lifestyle Awards',
    summary: 'Apresiasi atas komitmen konsisten menyajikan olahan kuliner halal bersertifikasi dengan estetika tata saji premium.',
  },
];

export default function MediaPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 pb-28 md:pb-36">
      <div className="max-w-2xl mb-12">
        <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          RUANG MEDIA & BERITA
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal leading-tight">
          Sorotan Publikasi & Siaran Pers
        </h1>
        <p className="text-sm font-light text-muted mt-3" style={{ fontFamily: 'Jost, sans-serif' }}>
          Informasi resmi seputar peluncuran koleksi, pagelaran fashion week, ekspansi properti, dan kiprah industri RiaMiranda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-16">
        <div className="lg:col-span-2 space-y-8">
          {PRESS_RELEASES.map((pr, idx) => (
            <article key={idx} className="p-6 border border-line bg-bg hover:border-charcoal transition-all">
              <div className="flex items-center gap-3 text-xs text-muted font-light mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                <span className="nav-label text-caramel-deep text-[10px]">{pr.source.toUpperCase()}</span>
                <span>·</span>
                <span>{pr.date}</span>
              </div>
              <h3 className="font-cormorant font-light text-2xl text-charcoal mb-3 leading-snug">
                {pr.title}
              </h3>
              <p className="text-xs text-muted font-light leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
                {pr.summary}
              </p>
            </article>
          ))}
        </div>

        {/* Media Kit & PR Contact */}
        <div className="p-6 bg-surface border border-line space-y-6">
          <p className="nav-label text-charcoal" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
            KONTAK HUMAS & MEDIA
          </p>
          <div className="space-y-3 text-xs font-light text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
            <p>Untuk wawancara media, permintaan press kit beresolusi tinggi, atau kerjasama sponsorship:</p>
            <p className="text-charcoal font-medium">pr@riamiranda.com</p>
            <p className="text-charcoal font-medium">+62 (21) 7234-8899 (Ext. 402)</p>
          </div>
          <div className="pt-4 border-t border-line">
            <Placeholder ratio="16/9" label="Press Kit & Foto Resmi" />
          </div>
        </div>
      </div>
    </div>
  );
}
