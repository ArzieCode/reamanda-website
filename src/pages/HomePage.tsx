import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Plus, Quote } from 'lucide-react';
import { SmartImage } from '../components/ui/SmartImage';
import { QuickViewModal } from '../components/busana/QuickViewModal';
import { EditableText } from '../components/cms/EditableText';
import { CardActionToolbar } from '../components/cms/CardActionToolbar';
import { AddSectionCard } from '../components/cms/AddSectionCard';
import { Modal } from '../components/ui/Modal';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext';
import { contentService } from '../services/content';
import { productService } from '../services/products';
import type { Product } from '../types/busana';
import type { SectionEntity } from '../types/content';

const businessLines = [
  {
    contentNumber: '2',
    name: 'Properti & Akomodasi Syariah',
    title: 'D’Rhea Syariah Guest House',
    description: 'Hunian eksklusif syariah khusus wanita di Jatipadang, Jakarta Selatan.',
    logo: '/d-rhea-syariah-logo.png',
    alt: 'Logo D’Rhea Syariah Guest House',
    path: '/kost-wanita',
    action: 'Kenali akomodasi',
    toneClass: 'home-line-visual--kost',
  },
  {
    contentNumber: '1',
    name: 'Fashion Muslim & Mukena',
    title: 'Rheamanda Fashion',
    description: 'Busana muslim modern dan mukena yang nyaman untuk ibadah dan aktivitas harian.',
    logo: '/rheamanda-fashion-logo.png',
    alt: 'Logo Rheamanda Fashion',
    path: '/busana',
    action: 'Kenali fashion',
    toneClass: 'home-line-visual--fashion',
  },
  {
    contentNumber: '3',
    name: 'Catering & Produk Kuliner',
    title: 'Rheamanda Catering',
    description: 'Meal box, snack box, kudapan manis dan gurih, serta sajian untuk acara.',
    logo: '/catering-logo.png',
    alt: 'Logo Katering Rheamanda',
    path: '/katering',
    action: 'Jelajahi katering',
    toneClass: 'home-line-visual--katering',
  },
] as const;

export const HomePage: React.FC = () => {
  const { products, isEditMode, isVisitorPreview } = useAdmin();
  const { hasPermission } = useAuth();
  const { showToast } = useOverlay();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sections (Testimonials & FAQs)
  const [testimonials, setTestimonials] = useState<SectionEntity[]>(() => contentService.getSections('testimonial'));
  const [faqs, setFaqs] = useState<SectionEntity[]>(() => contentService.getSections('faq'));

  // Section Add / Edit Modal
  const [activeSectionModal, setActiveSectionModal] = useState<'testimonial' | 'faq' | null>(null);
  const [editingSection, setEditingSection] = useState<SectionEntity | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');
  const [sectionContent, setSectionContent] = useState('');

  const canEdit = isEditMode && !isVisitorPreview && hasPermission('EDIT_CONTENT');

  const featuredProducts = products.filter((product) => product.isPublished).slice(0, 4);

  // Handle open add / edit modal
  const handleOpenAddModal = (type: 'testimonial' | 'faq') => {
    setEditingSection(null);
    setSectionTitle('');
    setSectionSubtitle('');
    setSectionContent('');
    setActiveSectionModal(type);
  };

  const handleOpenEditModal = (item: SectionEntity) => {
    setEditingSection(item);
    setSectionTitle(item.title);
    setSectionSubtitle(item.subtitle || '');
    setSectionContent(item.content || '');
    setActiveSectionModal(item.type as 'testimonial' | 'faq');
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSectionModal) return;

    contentService.saveSection({
      id: editingSection ? editingSection.id : undefined,
      type: activeSectionModal,
      title: sectionTitle.trim() || (activeSectionModal === 'testimonial' ? 'Nama Pelanggan' : 'Pertanyaan'),
      subtitle: sectionSubtitle.trim(),
      content: sectionContent.trim(),
      sortOrder: editingSection ? editingSection.sortOrder : 99,
      isVisible: editingSection ? editingSection.isVisible : true,
    });

    if (activeSectionModal === 'testimonial') {
      setTestimonials(contentService.getSections('testimonial'));
    } else {
      setFaqs(contentService.getSections('faq'));
    }

    showToast(`${activeSectionModal === 'testimonial' ? 'Testimoni' : 'FAQ'} berhasil disimpan.`);
    setActiveSectionModal(null);
  };

  const handleDeleteSection = (item: SectionEntity) => {
    contentService.deleteSection(item.id);
    if (item.type === 'testimonial') {
      setTestimonials(contentService.getSections('testimonial'));
    } else {
      setFaqs(contentService.getSections('faq'));
    }
    showToast(
      `${item.type === 'testimonial' ? 'Testimoni' : 'FAQ'} dihapus.`,
      () => {
        contentService.restoreSection(item);
        if (item.type === 'testimonial') {
          setTestimonials(contentService.getSections('testimonial'));
        } else {
          setFaqs(contentService.getSections('faq'));
        }
      },
      'Urungkan'
    );
  };

  const handleToggleVisibility = (item: SectionEntity) => {
    contentService.toggleSectionVisibility(item.id);
    if (item.type === 'testimonial') {
      setTestimonials(contentService.getSections('testimonial'));
    } else {
      setFaqs(contentService.getSections('faq'));
    }
    showToast(`Visibilitas ${item.title} diperbarui.`);
  };

  return (
  <div className="w-full bg-surface">
    <section className="site-container grid lg:grid-cols-[1.1fr_0.9fr] min-h-[500px] lg:min-h-[580px] border-b border-line">
      <div className="flex flex-col justify-center py-16 sm:py-20 lg:py-24 lg:pr-16 editorial-enter">
        <span className="label-editorial text-caramel-deep"><EditableText contentKey="home.editorial.hero.tag" defaultText="Selamat datang di Rheamanda Group" /></span>
        <h1 className="font-display !text-[clamp(3.1rem,6vw,5.8rem)] mt-6 mb-6 max-w-[820px] text-charcoal">
          Growing with{' '}<br /><em className="font-light"><EditableText contentKey="home.editorial.hero.ivory-gold.title" defaultText="Purpose," /></em>{' '}
          <span className="block !text-[clamp(2.55rem,4.4vw,4.6rem)] mt-2">Serving with Heart</span>
        </h1>
        <p className="text-base sm:text-lg text-ink leading-relaxed max-w-md">
          <EditableText contentKey="home.editorial.hero.subtitle" defaultText="Berawal dari hunian syariah, berkembang menjadi ekosistem layanan gaya hidup: akomodasi, fashion muslim, dan kuliner." multiline />
        </p>
        <a href="#lini-usaha" className="mt-8 inline-flex w-fit min-h-12 items-center gap-3 bg-charcoal px-6 text-sm font-medium tracking-wide text-white hover:bg-caramel-deep transition-colors">
          Mulai jelajahi <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="relative min-h-[360px] lg:min-h-0 bg-charcoal text-white overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-14 editorial-enter editorial-delay">
        <span className="label-editorial text-white/70">Akomodasi · Fashion · Kuliner</span>
        <div className="flex flex-1 items-center justify-center py-4">
          <img src="/group-monogram-gold.png" alt="Monogram R terbalik Rheamanda Group" className="w-24 sm:w-32 lg:w-44 h-auto object-contain" />
        </div>
        <div className="relative max-w-sm">
          <div className="h-px w-16 bg-caramel mb-6" />
          <p className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white m-0">
            Tiga pilar usaha.
          </p>
          <p className="text-base text-white/85 mt-5 mb-0"><EditableText contentKey="home.editorial.statement" defaultText="Bertumbuh sejak 2019 dengan semangat pelayanan dan kebermanfaatan." /></p>
        </div>
      </div>
    </section>

    <section id="lini-usaha" className="site-container section-padding scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-9 lg:mb-12">
        <div>
          <span className="label-editorial text-caramel-deep">Jelajahi Rheamanda</span>
          <h2 className="font-section-title mt-3"><EditableText contentKey="home.lines.title" defaultText="Kenali tiga lini usaha kami." /></h2>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {businessLines.map((line) => (
          <article key={line.path} className="group min-w-0 bg-white border border-line hover:border-charcoal transition-colors flex flex-col">
            <Link to={line.path} aria-label={line.action} className={`home-line-visual ${line.toneClass} h-48 sm:h-56 flex items-center justify-center p-9 overflow-hidden`}>
              <img src={line.logo} alt={line.alt} className="w-full h-full max-w-[230px] max-h-[160px] object-contain" />
            </Link>
            <div className="p-5 sm:p-7 flex flex-1 flex-col">
              <span className="label-editorial text-caramel-deep">{line.name}</span>
              <h3 className="font-serif text-3xl leading-[1.08] mt-4 mb-3"><EditableText contentKey={`home.tile${line.contentNumber}.title`} defaultText={line.title} /></h3>
              <p className="text-ink text-base leading-relaxed mb-5"><EditableText contentKey={`home.tile${line.contentNumber}.desc`} defaultText={line.description} multiline /></p>
              <Link to={line.path} className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 border-b border-charcoal text-sm tracking-wide font-medium text-charcoal hover:text-caramel-deep hover:border-caramel-deep transition-colors">
                {line.action} <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-white border-y border-line section-padding">
      <div className="site-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="label-editorial text-caramel-deep">Busana terpilih</span>
            <h2 className="font-section-title mt-3">Pilihan untuk Anda.</h2>
          </div>
          <Link to="/busana" className="inline-flex min-h-11 w-fit items-center gap-3 border-b border-charcoal text-sm tracking-wide font-medium text-charcoal hover:text-caramel-deep hover:border-caramel-deep transition-colors">
            Lihat koleksi <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product) => {
            const price = product.isSale && product.salePrice ? product.salePrice : product.price;
            const stock = productService.getProductTotalStock(product);
            return (
              <button key={product.id} type="button" onClick={() => setSelectedProduct(product)} className="group text-left bg-surface border border-line p-3 hover:border-charcoal transition-colors" aria-label={`Lihat ${product.name}`}>
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <SmartImage src={product.images[0]} alt={product.name} aspectRatio="3:4" className="w-full h-full" />
                  {product.isSale && <span className="absolute top-2 left-2 bg-sale text-white px-2 py-1 text-xs font-medium tracking-wide">SALE</span>}
                  {stock <= 5 && <span className="absolute top-2 right-2 bg-charcoal text-white px-2 py-1 text-xs font-medium tracking-wide">{stock === 0 ? 'HABIS' : `SISA ${stock}`}</span>}
                </div>
                <span className="label-editorial text-muted block mb-2">{product.category} · {product.collection}</span>
                <span className="font-serif text-charcoal text-2xl leading-tight block group-hover:text-caramel-deep">{product.name}</span>
                <span className="text-base font-medium text-ink mt-2 block">Rp {price.toLocaleString('id-ID')}</span>
                {product.isSale && product.salePrice && <span className="text-sm text-muted line-through">Rp {product.price.toLocaleString('id-ID')}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>

      {/* CMS testimonials and FAQs */}
      <section className="bg-surface-2 border-b border-line section-padding">
        <div className="site-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="label-editorial text-caramel-deep block mb-2">Ulasan Tamu & Pelanggan</span>
              <h2 className="font-section-title mt-3">
                <EditableText contentKey="home.testi.title" defaultText="Cerita pelanggan" as="span" />
              </h2>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => handleOpenAddModal('testimonial')}
                className="px-3.5 py-1.5 bg-caramel-deep text-white text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 rounded-[2px]"
              >
                <Plus size={13} /> Tambah Testimoni
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials
              .filter((t) => (canEdit ? true : t.isVisible))
              .slice(0, canEdit ? undefined : 3)
              .map((t) => (
                <div
                  key={t.id}
                  className={`bg-white border p-6 flex flex-col justify-between relative transition-all rounded-[2px] ${
                    !t.isVisible ? 'opacity-50 border-dashed border-line' : 'border-line hover:border-charcoal'
                  }`}
                >
                  <CardActionToolbar
                    onEdit={() => handleOpenEditModal(t)}
                    onToggleVisibility={() => handleToggleVisibility(t)}
                    onDelete={() => handleDeleteSection(t)}
                    isVisible={t.isVisible}
                  />

                  <div>
                    <Quote className="text-caramel/40 mb-3" size={28} />
                    <p className="text-base font-sans text-ink leading-relaxed italic mb-6">
                      “{t.content}”
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-4">
                    <div className="font-serif text-charcoal text-base">{t.title}</div>
                    {t.subtitle && <div className="text-sm text-muted font-sans">{t.subtitle}</div>}
                  </div>
                </div>
              ))}

            {canEdit && (
              <AddSectionCard
                label="Tambah Testimoni"
                minHeight="min-h-[220px]"
                onClick={() => handleOpenAddModal('testimonial')}
              />
            )}
          </div>
        </div>
      </section>


      <section className="bg-surface border-b border-line section-padding">
        <div className="site-container max-w-4xl">
          <div className="text-center mb-12">
            <span className="label-editorial text-caramel-deep block mb-2">Tanya Jawab</span>
            <h2 className="font-section-title mt-3">
              <EditableText contentKey="home.faq.title" defaultText="Sering ditanyakan" as="span" />
            </h2>
            <div className="w-12 h-[1px] bg-charcoal mx-auto mt-4" />
          </div>

          <div className="space-y-4">
            {faqs
              .filter((f) => (canEdit ? true : f.isVisible))
              .slice(0, canEdit ? undefined : 5)
              .map((f) => (
                <div
                  key={f.id}
                  className={`border relative bg-white rounded-[2px] transition-colors ${
                    !f.isVisible ? 'opacity-50 border-dashed border-line' : 'border-line hover:border-charcoal'
                  }`}
                >
                  <CardActionToolbar
                    onEdit={() => handleOpenEditModal(f)}
                    onToggleVisibility={() => handleToggleVisibility(f)}
                    onDelete={() => handleDeleteSection(f)}
                    isVisible={f.isVisible}
                  />

                  <details className="group/faq">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 pr-16 sm:pr-32 [&::-webkit-details-marker]:hidden">
                      <span className="font-serif text-charcoal text-xl leading-tight">{f.title}</span>
                      <Plus size={17} className="shrink-0 text-caramel-deep transition-transform group-open/faq:rotate-45" aria-hidden="true" />
                    </summary>
                    <p className="px-5 pb-5 pr-16 sm:pr-20 text-base font-sans text-muted leading-relaxed m-0">{f.content}</p>
                  </details>
                </div>
              ))}

            {canEdit && (
              <AddSectionCard
                label="Tambah Pertanyaan FAQ"
                minHeight="min-h-[100px]"
                onClick={() => handleOpenAddModal('faq')}
              />
            )}
          </div>
        </div>
      </section>

    <section className="bg-charcoal py-16 lg:py-20">
      <div className="site-container flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <span className="label-editorial text-caramel">Lebih dekat</span>
          <h2 className="font-section-title mt-3 !text-white"><EditableText contentKey="home.about.headline" defaultText="Kenali Rheamanda Group lebih dekat." /></h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-white leading-relaxed">
            <EditableText contentKey="home.about.paragraph1" defaultText="Rheamanda Group berdiri sejak 2019 dari usaha properti dan akomodasi syariah khusus wanita." multiline />
          </p>
          <details className="mt-3 text-sm text-white/75">
            <summary className="w-fit cursor-pointer underline underline-offset-4 text-caramel hover:text-white">Tentang tiga lini</summary>
            <p className="mt-3 max-w-xl leading-relaxed text-white">
              <EditableText contentKey="home.about.paragraph2" defaultText="Pada 2022 berkembang ke fashion muslim & mukena, lalu pada 2024 ke catering & produk kuliner." multiline />
            </p>
          </details>
        </div>
        <Link to="/tentang-kami" className="inline-flex min-h-12 w-fit shrink-0 items-center gap-3 bg-white px-6 text-xs uppercase tracking-[0.12em] font-medium text-charcoal hover:bg-caramel transition-colors">
          Cerita kami <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
    <QuickViewModal key={selectedProduct?.id || 'closed'} product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      {/* Section Entity Add/Edit Modal */}
      <Modal
        id="section-entity-modal"
        isOpen={Boolean(activeSectionModal)}
        onClose={() => setActiveSectionModal(null)}
        title={
          editingSection
            ? `Sunting ${activeSectionModal === 'testimonial' ? 'Testimoni' : 'FAQ'}`
            : `Tambah ${activeSectionModal === 'testimonial' ? 'Testimoni' : 'FAQ'} Baru`
        }
        maxWidth="lg"
      >
        <form onSubmit={handleSaveSection} className="space-y-4">
          <div>
            <label htmlFor={activeSectionModal === 'testimonial' ? 'home-section-name' : 'home-section-question'} className="block text-xs uppercase tracking-wider text-muted font-sans mb-1">
              {activeSectionModal === 'testimonial' ? 'Nama Pelanggan / Tamu' : 'Judul Pertanyaan'} *
            </label>
            <input
              id={activeSectionModal === 'testimonial' ? 'home-section-name' : 'home-section-question'}
              type="text"
              required
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line bg-surface rounded-[2px]"
              placeholder={activeSectionModal === 'testimonial' ? 'Ibu Hj. Aminah' : 'Bagaimana tata cara pemesanan?'}
            />
          </div>

          {activeSectionModal === 'testimonial' && (
            <div>
              <label htmlFor="home-section-subtitle" className="block text-xs uppercase tracking-wider text-muted font-sans mb-1">
                Kota / Keterangan
              </label>
              <input
                id="home-section-subtitle"
                type="text"
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-line bg-surface rounded-[2px]"
                placeholder="Jakarta Selatan"
              />
            </div>
          )}

          <div>
            <label htmlFor="home-section-content" className="block text-xs uppercase tracking-wider text-muted font-sans mb-1">
              {activeSectionModal === 'testimonial' ? 'Isi Ulasan Testimoni' : 'Jawaban Penjelasan'} *
            </label>
            <textarea
              id="home-section-content"
              required
              rows={4}
              value={sectionContent}
              onChange={(e) => setSectionContent(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line bg-surface rounded-[2px]"
              placeholder={
                activeSectionModal === 'testimonial'
                  ? 'Kualitas bahan dan jahitan luar biasa rapi...'
                  : 'Pesanan dapat dilakukan secara langsung di situs atau melalui...'
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setActiveSectionModal(null)}
              className="px-4 py-2 border border-line text-xs uppercase tracking-wider font-sans rounded-[2px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px]"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
  </div>
  );
};