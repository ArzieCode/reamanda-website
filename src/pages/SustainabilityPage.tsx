// ============================================================
// Page — Sustainability / Keberlanjutan (/sustainability)
// Eco-friendly textile, ethical production, artisan empowerment
// ============================================================
import Placeholder from '../components/ui/Placeholder';

export default function SustainabilityPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20 pb-28 md:pb-36">
      <div className="max-w-2xl mb-12">
        <p className="nav-label text-caramel-deep mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          KOMITMEN KEBERLANJUTAN
        </p>
        <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-charcoal leading-tight">
          Menjaga Kelestarian Bumi, Menghormati Manusia
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
        <div>
          <Placeholder ratio="16/9" label="Pemberdayaan Pengrajin Kain Lokal" className="w-full" />
        </div>
        <div className="space-y-5 text-sm font-light text-ink leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', lineHeight: 1.9 }}>
          <p>
            Bagi RiaMiranda, mode yang bermakna bukan hanya tentang apa yang tampak di atas panggung peragaan, tetapi bagaimana pakaian itu dibuat. Kami percaya bahwa keindahan sejati harus berakar dari kebaikan bagi lingkungan dan kesejahteraan para pengrajin.
          </p>
          <p>
            Melalui program <em>RiaMiranda Conscious</em>, kami secara bertahap mentransformasikan rantai pasok kami menuju material yang lebih ramah lingkungan, pewarna alami bebas racun, dan pengelolaan sisa kain tanpa limbah (*zero fabric waste*).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-12">
        <div className="border border-line p-6 bg-surface">
          <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px' }}>01. MATERIAL BERKELANJUTAN</p>
          <h3 className="font-cormorant font-light text-xl text-charcoal mb-2">Serat Ramah Lingkungan</h3>
          <p className="text-xs text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
            Mengutamakan serat katun organik bersertifikat, TENCEL™ Lyocell yang dapat terurai alami, dan voal tenun yang tahan lama untuk siklus pakai bertahun-tahun.
          </p>
        </div>

        <div className="border border-line p-6 bg-surface">
          <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px' }}>02. PENGRAJIN LOKAL</p>
          <h3 className="font-cormorant font-light text-xl text-charcoal mb-2">Upah Layak & Etika Kerja</h3>
          <p className="text-xs text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
            Bekerja sama erat dengan bengkel tenun tradisional dan penjahit di Padang, Pekalongan, dan Jawa Barat dengan standar lingkungan kerja yang aman dan upah yang adil.
          </p>
        </div>

        <div className="border border-line p-6 bg-surface">
          <p className="nav-label text-caramel-deep mb-2" style={{ fontSize: '10px' }}>03. KEMASAN BIODEGRADABLE</p>
          <h3 className="font-cormorant font-light text-xl text-charcoal mb-2">Bebas Plastik Sekali Pakai</h3>
          <p className="text-xs text-muted leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
            Kotak kemasan pengiriman menggunakan kertas daur ulang bersertifikat FSC dan kantong pelindung singkong (*cassava bag*) yang dapat terurai alami di dalam tanah.
          </p>
        </div>
      </div>
    </div>
  );
}
