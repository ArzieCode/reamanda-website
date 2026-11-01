import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Plus, Quote, HelpCircle } from 'lucide-react';
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
    <section className="site-container grid lg:grid-cols-[1.2fr_0.8fr] min-h-[620px] lg:min-h-[680px] border-b border-line">
      <div className="flex flex-col justify-center py-20 lg:py-28 lg:pr-16 editorial-enter">
        <span className="label-editorial text-caramel-deep"><EditableText contentKey="home.editorial.hero.tag" defaultText="Rheamanda · Tiga lini usaha" /></span>
        <h1 className="font-display mt-8 mb-8 max-w-[820px] text-charcoal">
          Satu rumah.<br /><em className="font-light"><EditableText contentKey="home.editorial.hero.title" defaultText="Tiga cerita." /></em>
        </h1>
        <p className="text-base sm:text-lg text-ink leading-relaxed max-w-lg">
          <EditableText contentKey="home.editorial.hero.subtitle" defaultText={`${BRAND.name} mempertemukan busana muslimah, hunian khusus wanita, dan katering dalam satu tempat. Pilih cerita yang ingin Anda jelajahi.`} multiline />
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
          <p className="text-sm text-white/75 m-0"><EditableText contentKey="home.editorial.statement" defaultText="Elegan, tulus, dan abadi." /></p>
        </div>
        <span className="label-editorial text-white/50 self-end">Rheamanda</span>
      </div>
    </section>

    <section id="lini-usaha" className="site-container section-padding scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 lg:mb-16">
        <div>
          <span className="label-editorial text-caramel-deep">Jelajahi Rheamanda</span>
          <h2 className="font-section-title mt-3"><EditableText contentKey="home.lines.title" defaultText="Tiga lini, satu rumah." /></h2>
        </div>
        <p className="text-sm text-muted md:text-right max-w-xs m-0">Setiap lini memiliki identitas dan halaman tersendiri.</p>
      </div>
      <div className="border-t border-line">
        {businessLines.map((line) => (
          <article key={line.path} className="grid lg:grid-cols-[80px_minmax(0,1fr)_minmax(300px,0.8fr)] gap-5 lg:gap-10 py-10 lg:py-14 border-b border-line items-center">
            <span className="label-editorial text-muted self-start lg:pt-4">{line.number} / 03</span>
            <div className="lg:py-8">
              <span className="label-editorial text-caramel-deep">{line.name}</span>
              <h3 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.06] mt-4 mb-5"><EditableText contentKey={`home.tile${Number(line.number)}.title`} defaultText={line.title} /></h3>
              <p className="text-ink text-sm sm:text-base leading-relaxed max-w-md"><EditableText contentKey={`home.tile${Number(line.number)}.desc`} defaultText={line.description} multiline /></p>
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

    <section className="bg-white border-y border-line section-padding">
      <div className="site-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="label-editorial text-caramel-deep">Busana terpilih</span>
            <h2 className="font-section-title mt-3">Koleksi pilihan.</h2>
          </div>
          <Link to="/busana" className="inline-flex min-h-11 w-fit items-center gap-3 border-b border-charcoal text-xs uppercase tracking-[0.16em] font-medium text-charcoal hover:text-caramel-deep hover:border-caramel-deep transition-colors">
            Lihat semua busana ({products.filter((product) => product.isPublished).length}) <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product) => {
            const price = product.isSale && product.salePrice ? product.salePrice : product.price;
            const stock = productService.getProductTotalStock(product);
            return (
              <button key={product.id} type="button" onClick={() => setSelectedProduct(product)} className="group text-left bg-surface border border-line p-3 hover:border-charcoal transition-colors" aria-label={`Lihat ${product.name}`}>
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <SmartImage src={product.images[0]} alt={product.name} aspectRatio="3:4" className="w-full h-full" />
                  {product.isSale && <span className="absolute top-2 left-2 bg-sale text-white px-2 py-1 text-[10px] tracking-widest">SALE</span>}
                  {stock <= 5 && <span className="absolute top-2 right-2 bg-charcoal text-white px-2 py-1 text-[10px] tracking-widest">{stock === 0 ? 'HABIS' : `SISA ${stock}`}</span>}
                </div>
                <span className="label-editorial text-muted block mb-2">{product.category} · {product.collection}</span>
                <span className="font-serif text-charcoal text-lg leading-tight block group-hover:text-caramel-deep">{product.name}</span>
                <span className="text-sm text-ink mt-2 block">Rp {price.toLocaleString('id-ID')}</span>
                {product.isSale && product.salePrice && <span className="text-xs text-muted line-through">Rp {product.price.toLocaleString('id-ID')}</span>}
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
                <EditableText contentKey="home.testi.title" defaultText="Kisah Kepuasan Bersama Kami" as="span" />
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
                    <p className="text-sm font-sans text-ink leading-relaxed italic mb-6">
                      "{t.content}"
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-4">
                    <div className="font-serif text-charcoal text-base">{t.title}</div>
                    {t.subtitle && <div className="text-xs text-muted font-sans">{t.subtitle}</div>}
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
              <EditableText contentKey="home.faq.title" defaultText="Pertanyaan yang Sering Diajukan" as="span" />
            </h2>
            <div className="w-12 h-[1px] bg-charcoal mx-auto mt-4" />
          </div>

          <div className="space-y-4">
            {faqs
              .filter((f) => (canEdit ? true : f.isVisible))
              .map((f) => (
                <div
                  key={f.id}
                  className={`border p-5 relative bg-white rounded-[2px] transition-colors ${
                    !f.isVisible ? 'opacity-50 border-dashed border-line' : 'border-line hover:border-charcoal'
                  }`}
                >
                  <CardActionToolbar
                    onEdit={() => handleOpenEditModal(f)}
                    onToggleVisibility={() => handleToggleVisibility(f)}
                    onDelete={() => handleDeleteSection(f)}
                    isVisible={f.isVisible}
                  />

                  <div className="flex items-start gap-3 pr-16 sm:pr-20">
                    <HelpCircle size={18} className="text-caramel-deep shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-serif text-charcoal text-lg mb-2">{f.title}</h3>
                      <p className="text-sm font-sans text-muted leading-relaxed">{f.content}</p>
                    </div>
                  </div>
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

    <section className="bg-white border-t border-line py-20 lg:py-24">
      <div className="site-container flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <span className="label-editorial text-caramel-deep">Tentang kami</span>
          <h2 className="font-section-title mt-3"><EditableText contentKey="home.about.headline" defaultText="Kenali rumah di balik tiga lini." /></h2>
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-ink leading-relaxed">
            <EditableText contentKey="home.about.paragraph1" defaultText={`${BRAND.name} menghadirkan pilihan busana muslimah untuk keseharian dan momen istimewa.`} multiline />
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
            <EditableText contentKey="home.about.paragraph2" defaultText="D’Rhea Syariah Guest House melengkapi lini hunian khusus wanita, sementara katering kami hadir untuk kebutuhan perjamuan Anda." multiline />
          </p>
        </div>
        <Link to="/tentang-kami" className="inline-flex min-h-11 w-fit items-center gap-3 border-b border-charcoal text-xs uppercase tracking-[0.16em] font-medium text-charcoal hover:text-caramel-deep hover:border-caramel-deep transition-colors">
          Tentang Rheamanda <ArrowUpRight size={17} aria-hidden="true" />
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