import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const milestones = [
  { year: '2019', title: 'Awal perjalanan', description: 'Properti & akomodasi syariah: hotel dan kost eksklusif khusus wanita, dengan 14 kamar dalam bangunan 3 lantai.' },
  { year: '2022', title: 'Ekspansi fashion', description: 'Merambah fashion muslim & mukena untuk menjawab kebutuhan busana muslim yang nyaman dan fungsional.' },
  { year: '2024', title: 'Diversifikasi kuliner', description: 'Mengembangkan catering berupa nasi box, frozen food, dan snack box untuk kebutuhan personal, keluarga, komunitas, dan acara.' },
];

const values = [
  { title: 'Amanah', description: 'Menjaga kepercayaan pelanggan dan mitra melalui sikap jujur serta bertanggung jawab.' },
  { title: 'Kualitas', description: 'Mengupayakan standar produk dan layanan yang konsisten di setiap lini usaha.' },
  { title: 'Kenyamanan', description: 'Memahami kebutuhan pelanggan dan menghadirkan pengalaman yang menyenangkan.' },
  { title: 'Adaptif', description: 'Terbuka terhadap perubahan, inovasi, dan peluang pengembangan usaha baru.' },
  { title: 'Kebermanfaatan', description: 'Menjadikan pertumbuhan bisnis sebagai jalan untuk memberi nilai bagi banyak pihak.' },
];

const coreValues = [
  { title: 'Innovation', description: 'Terus berkembang, kreatif, dan adaptif terhadap kebutuhan pelanggan.' },
  { title: 'Barakah', description: 'Membangun usaha yang membawa kebaikan dan keberkahan bagi semua.' },
  { title: 'Amanah', description: 'Menjalankan bisnis dengan kejujuran, kepercayaan, dan tanggung jawab.' },
  { title: 'Quality', description: 'Mengutamakan kualitas produk dan pelayanan terbaik di setiap lini usaha.' },
  { title: 'Service', description: 'Melayani dengan sepenuh hati, ramah, dan profesional.' },
];

const pillars = [
  { number: '01', title: 'Properti & Akomodasi Syariah', description: 'Hunian eksklusif syariah khusus wanita yang mengutamakan kenyamanan, keamanan, dan privasi. Berlokasi di Jl. Jatipadang Utara No. 63, Pasar Minggu, Jakarta Selatan; 14 kamar dalam bangunan 3 lantai. Unit akomodasi dirancang tertata, aman, dan kondusif bagi penghuni wanita.', path: '/kost-wanita', action: 'Lihat akomodasi' },
  { number: '02', title: 'Fashion Muslim & Mukena', description: 'Pilihan fashion muslim dan mukena yang mendukung kenyamanan beribadah dan aktivitas sehari-hari. Rheamanda Fashion menghadirkan busana muslim modern dengan desain elegan dan syar’i, bahan berkualitas, serta nyaman untuk kegiatan harian hingga acara spesial bagi keluarga.', path: '/busana', action: 'Lihat fashion' },
  { number: '03', title: 'Catering & Produk Kuliner', description: 'Nasi box, frozen food, dan snack box untuk konsumsi harian maupun acara komunitas dan korporat. Rheamanda Catering menghadirkan nasi box modern dengan menu variatif, penyajian elegan, standar kebersihan tinggi, dan pengantaran tepat waktu.', path: '/katering', action: 'Lihat catering' },
];

const directions = ['Memperkuat fondasi operasional', 'Membangun sinergi antarlini', 'Menjaga konsistensi kualitas', 'Memperluas jangkauan pemasaran'];

export const TentangKamiPage: React.FC = () => (
  <div className="w-full bg-surface">
    <section className="site-container py-20 lg:py-28 border-b border-line">
      <span className="label-editorial text-caramel-deep">Tentang Rheamanda Group · Berdiri sejak 2019</span>
      <h1 className="font-display !text-[clamp(3.1rem,6vw,5.8rem)] text-charcoal mt-6 max-w-4xl">Growing with{' '}<br /><em>Purpose,</em>{' '}<span className="block !text-[clamp(2.55rem,4.4vw,4.6rem)] mt-2">Serving with Heart</span></h1>
      <p className="text-ink text-lg leading-relaxed max-w-2xl mt-8">Berawal dari hunian syariah, berkembang menjadi ekosistem layanan gaya hidup.</p>
    </section>

    <section className="site-container section-padding grid lg:grid-cols-12 gap-10 lg:gap-20 border-b border-line">
      <div className="lg:col-span-4"><span className="label-editorial text-caramel-deep">Tentang perusahaan</span><h2 className="font-section-title mt-3">Perjalanan yang bertumbuh.</h2></div>
      <div className="lg:col-span-8 space-y-5 text-ink text-base leading-relaxed">
        <p>Rheamanda Group adalah kelompok usaha yang dibangun dengan semangat kemandirian, pelayanan, dan pengembangan peluang bisnis secara bertahap. Berdiri sejak 2019, perjalanan Rheamanda dimulai dari sektor properti dan akomodasi melalui hotel serta kost eksklusif syariah khusus wanita.</p>
        <p>Seiring waktu, Rheamanda membaca kebutuhan pasar dan memperluas lini usahanya ke fashion muslim & mukena pada 2022, lalu catering & produk kuliner pada 2024. Pertumbuhan ini mencerminkan komitmen untuk bertumbuh secara adaptif demi relevansi bagi pelanggan.</p>
      </div>
    </section>

    <section className="bg-white border-b border-line section-padding">
      <div className="site-container grid md:grid-cols-2 gap-12 lg:gap-24">
        <div><span className="label-editorial text-caramel-deep">Visi</span><h2 className="font-section-title mt-3">Terpercaya, unggul, inspiratif.</h2><p className="text-ink leading-relaxed mt-5">Menjadi grup usaha yang terpercaya, unggul, dan inspiratif dalam bidang hospitality, muslim wear, dan catering dengan mengedepankan kualitas, pelayanan, serta nilai-nilai islami untuk memberikan manfaat dan keberkahan bagi masyarakat.</p><p className="font-serif text-2xl text-caramel-deep mt-6 italic">Tumbuh dengan tujuan. Melayani dengan hati.</p></div>
        <div><span className="label-editorial text-caramel-deep">Misi</span><h2 className="font-section-title mt-3">Komitmen di setiap lini.</h2><ul className="mt-5 space-y-4 text-ink leading-relaxed list-disc pl-5"><li>Memberikan pelayanan terbaik melalui bisnis hospitality yang profesional, mengutamakan kenyamanan, kualitas, dan kepuasan pelanggan.</li><li>Menghadirkan muslim wear yang nyaman, berkualitas, indah, sopan, dan selaras dengan nilai-nilai islami.</li><li>Menyediakan layanan catering dengan cita rasa berkualitas, kebersihan, kehalalan, dan pelayanan yang memuaskan.</li><li>Membangun bisnis dengan kejujuran, amanah, inovasi, dan pertumbuhan berkelanjutan yang memberi manfaat bagi pelanggan, karyawan, mitra, dan masyarakat.</li></ul></div>
      </div>
    </section>

    <section className="bg-charcoal text-white section-padding border-b border-caramel/30">
      <div className="site-container">
        <span className="label-editorial text-[#DEC893]">DNA Perusahaan · Core Values</span>
        <h2 className="font-section-title !text-white mt-3 mb-10">Nilai yang kami bawa.</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {coreValues.map((item, index) => <article key={item.title} className="min-w-0 border-t border-[#DEC893]/50 pt-5"><span className="text-sm text-[#DEC893]">0{index + 1}</span><h3 className="font-serif text-3xl !text-white mt-3">{item.title}</h3><p className="text-white/85 text-base leading-relaxed mt-3">{item.description}</p></article>)}
        </div>
      </div>
    </section>

    <section className="site-container section-padding border-b border-line">
      <span className="label-editorial text-caramel-deep">Perjalanan & tonggak perkembangan</span><h2 className="font-section-title mt-3 mb-10">Dari satu langkah, menjadi tiga lini.</h2>
      <div className="grid md:grid-cols-3 gap-5">{milestones.map((item) => <article key={item.year} className="bg-white border border-line p-7"><span className="font-serif text-5xl text-caramel-deep">{item.year}</span><h3 className="font-serif text-2xl text-charcoal mt-5">{item.title}</h3><p className="text-ink leading-relaxed mt-3">{item.description}</p></article>)}</div>
    </section>

    <section className="bg-white border-b border-line section-padding"><div className="site-container"><span className="label-editorial text-caramel-deep">Nilai-nilai utama</span><h2 className="font-section-title mt-3 mb-10">Fondasi di setiap lini.</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{values.map((item) => <article key={item.title} className="border border-line bg-surface p-7"><h3 className="font-serif text-2xl text-charcoal">{item.title}</h3><p className="text-ink leading-relaxed mt-3">{item.description}</p></article>)}</div></div></section>

    <section className="site-container section-padding border-b border-line"><span className="label-editorial text-caramel-deep">Tiga pilar usaha</span><h2 className="font-section-title mt-3 mb-10">Ekosistem yang saling mendukung.</h2><div className="grid lg:grid-cols-3 gap-5">{pillars.map((item) => <article key={item.number} className="bg-white border border-line p-7 flex flex-col"><span className="label-editorial text-caramel-deep">{item.number} / 03</span><h3 className="font-serif text-2xl text-charcoal mt-5">{item.title}</h3><p className="text-ink leading-relaxed mt-4 mb-8">{item.description}</p><Link to={item.path} className="mt-auto inline-flex items-center gap-2 text-charcoal border-b border-charcoal w-fit py-2 hover:text-caramel-deep">{item.action}<ArrowUpRight size={16} /></Link></article>)}</div></section>

    <section className="bg-white border-b border-line section-padding"><div className="site-container"><span className="label-editorial text-caramel-deep">Arah pengembangan</span><h2 className="font-section-title mt-3 mb-8">Tumbuh dalam kualitas dan manfaat.</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{directions.map((item, index) => <div key={item} className="border-t border-charcoal pt-5"><span className="label-editorial text-caramel-deep">0{index + 1}</span><h3 className="font-serif text-xl mt-3 text-charcoal">{item}</h3></div>)}</div><p className="max-w-3xl text-ink leading-relaxed mt-10">Dengan pengalaman di bidang akomodasi, fashion muslim, dan kuliner sebagai modal, Rheamanda Group membangun ekosistem usaha yang saling mendukung. Ekspansi dilakukan berdasarkan kebutuhan pasar yang nyata, dengan semangat pelayanan dan manfaat bagi pelanggan, mitra, serta komunitas sekitar.</p></div></section>
  </div>
);