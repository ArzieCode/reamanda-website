import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SmartImage } from '../components/ui/SmartImage';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext';
import { ArrowRight, Sparkles, Plus, Quote, HelpCircle } from 'lucide-react';
import { QuickViewModal } from '../components/busana/QuickViewModal';
import { KateringInquiryModal } from '../components/modals/KateringInquiryModal';
import { EditableText } from '../components/cms/EditableText';
import { CardActionToolbar } from '../components/cms/CardActionToolbar';
import { AddSectionCard } from '../components/cms/AddSectionCard';
import { Modal } from '../components/ui/Modal';
import { productService } from '../services/products';
import { contentService } from '../services/content';
import type { BusanaProduct } from '../data/busana';
import type { KateringPackageItem } from '../data/katering';
import type { SectionEntity } from '../types/content';
import { BRAND } from '../config/brand';

export const HomePage: React.FC = () => {
  const { products, isEditMode, isVisitorPreview } = useAdmin();
  const { hasPermission } = useAuth();
  const { showToast } = useOverlay();

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<KateringPackageItem | null>(null);

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

  // Featured items
  const featuredProducts = products.slice(0, 4);

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

    const saved = contentService.saveSection({
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
      {/* 1. Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[560px] max-h-[820px] bg-charcoal overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <SmartImage
            slot="hero"
            aspectRatio="custom"
            className="w-full h-full object-cover"
            priority
          />
          {/* Strict required overlay token */}
          <div className="absolute inset-0 bg-overlay" />
        </div>

        <div className="site-container relative z-10 text-white space-y-6">
          <div className="inline-flex items-center gap-2 border border-white/30 px-3.5 py-1 text-white text-[11px] uppercase tracking-[0.2em] font-sans">
            <Sparkles size={12} className="stroke-[1.25]" />
            <EditableText
              contentKey="home.hero.tag"
              defaultText="BUSANA · KOST WANITA · KATERING"
            />
          </div>

          <h1 className="font-display text-white max-w-4xl font-light">
            <EditableText
              contentKey="home.hero.title"
              defaultText="Keanggunan Santun dalam Setiap Langkah Kehidupan"
              as="span"
              multiline
            />
          </h1>

          <p className="text-white/90 text-base sm:text-lg max-w-xl font-sans font-light leading-relaxed">
            <EditableText
              contentKey="home.hero.subtitle"
              defaultText="Menghadirkan busana muslimah kontemporer, kost eksklusif untuk wanita, serta hidangan perjamuan berselera."
              as="span"
              multiline
            />
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/busana"
              className="px-8 py-3.5 bg-white text-charcoal hover:bg-caramel-deep hover:text-white text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2 font-medium rounded-[2px]"
            >
              <span>Jelajahi Busana</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>

            <Link
              to="/kost-wanita"
              className="px-8 py-3.5 bg-transparent border border-white/60 text-white hover:bg-white hover:text-charcoal text-xs uppercase tracking-[0.18em] font-sans transition-colors inline-flex items-center gap-2 rounded-[2px]"
            >
              <span>Kost Eksklusif Wanita</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Statement Band per spec */}
      <section className="bg-charcoal text-white py-6 border-y border-line text-center">
        <div className="site-container">
          <p className="text-xs sm:text-sm uppercase tracking-[0.18em] font-sans text-white/90 font-light">
            <EditableText
              contentKey="home.statement_band"
              defaultText="Tiga lini usaha, satu komitmen: kualitas yang dirawat dengan tulus."
              as="span"
            />
          </p>
        </div>
      </section>

      {/* 2. Three Business Lines Feature Tiles */}
      <section className="section-padding site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-editorial text-muted block mb-2">Tiga Lini Usaha</span>
          <h2 className="font-section-title text-charcoal">
            <EditableText
              contentKey="home.lines.title"
              defaultText={`Ekosistem Gaya Hidup Santun ${BRAND.name}`}
              as="span"
            />
          </h2>
          <div className="w-12 h-[1px] bg-charcoal mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tile 1: Busana (Accent: charcoal) */}
          <div className="bg-white border border-line p-6 flex flex-col justify-between group hover:border-charcoal transition-colors">
            <div>
              <div className="w-full aspect-[4/3] mb-6 overflow-hidden">
                <SmartImage
                  slot="tile-busana"
                  aspectRatio="4:3"
                  className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <span className="label-editorial text-charcoal block mb-1">Busana Muslimah</span>
              <h3 className="font-serif text-2xl text-charcoal font-light mb-3">
                <EditableText
                  contentKey="home.tile1.title"
                  defaultText="Koleksi Busana Santun"
                  as="span"
                />
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6 font-sans">
                <EditableText
                  contentKey="home.tile1.desc"
                  defaultText="Rancangan busana muslimah berkarakter lembut dengan palet pastel hangat, serat alami ramah iklim tropis, dan bordir monogram songket kontemporer."
                  as="span"
                  multiline
                />
              </p>
            </div>
            <Link
              to="/busana"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-sans text-charcoal group-hover:text-caramel-deep border-t border-line pt-4 transition-colors font-medium"
            >
              <span>Buka Katalog Busana</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>
          </div>

          {/* Tile 2: Kost Eksklusif Wanita */}
          <div className="bg-white border border-line p-6 flex flex-col justify-between group hover:border-indigo transition-colors">
            <div>
              <div className="w-full aspect-[4/3] mb-6 overflow-hidden flex items-center justify-center">
                <img src="/d-rhea-syariah-logo.png" alt="Logo D’Rhea Syariah Guest House" className="w-full h-full object-contain p-3 sm:p-6" />
              </div>
              <span className="label-editorial text-indigo block mb-1">D’Rhea Syariah Guest House</span>
              <h3 className="font-serif text-charcoal text-2xl font-light mb-3">
                <EditableText
                  contentKey="home.tile2.title"
                  defaultText="Kost Eksklusif Wanita"
                  as="span"
                />
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6 font-sans">
                <EditableText
                  contentKey="home.tile2.desc"
                  defaultText="Hunian khusus wanita dengan identitas D’Rhea Syariah Guest House. Lokasi aman, tenang, dan bersahabat."
                  as="span"
                  multiline
                />
              </p>
            </div>
            <Link
              to="/kost-wanita"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-sans text-indigo border-t border-line pt-4 transition-opacity font-medium"
            >
              <span>Kenali Kost Wanita</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>
          </div>

          {/* Tile 3: Katering (Accent: caramel-deep) */}
          <div className="bg-white border border-line p-6 flex flex-col justify-between group hover:border-caramel-deep transition-colors">
            <div>
              <div className="w-full aspect-[4/3] mb-6 overflow-hidden">
                <SmartImage
                  slot="tile-katering"
                  aspectRatio="4:3"
                  className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <span className="label-editorial text-caramel-deep block mb-1">Katering & Perjamuan</span>
              <h3 className="font-serif text-charcoal text-2xl font-light mb-3">
                <EditableText
                  contentKey="home.tile3.title"
                  defaultText="Tata Meja Rasa Nusantara"
                  as="span"
                />
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6 font-sans">
                <EditableText
                  contentKey="home.tile3.desc"
                  defaultText="Sajian kuliner halal autentik resep turun-temurun untuk resepsi pernikahan agung, jamuan korporasi, tumpeng syukuran, dan hantaran keluarga."
                  as="span"
                  multiline
                />
              </p>
            </div>
            <Link
              to="/katering"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-sans text-caramel-deep border-t border-line pt-4 transition-colors font-medium"
            >
              <span>Pilihan Menu Perjamuan</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Busana Products */}
      <section className="bg-white border-y border-line section-padding">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="label-editorial text-muted block mb-2">Busana Terpilih</span>
              <h2 className="font-section-title text-charcoal">
                Koleksi Pilihan Musim Ini
              </h2>
            </div>
            <Link
              to="/busana"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-sans text-charcoal hover:text-caramel-deep font-medium"
            >
              <span>Lihat Semua Busana ({products.length})</span>
              <ArrowRight size={14} className="stroke-[1.25]" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const displayPrice = p.isSale && p.salePrice ? p.salePrice : p.price;
              const stock = productService.getProductTotalStock(p as any);
              const isOutOfStock = stock === 0;
              const isLowStock = stock > 0 && stock <= 5;

              return (
                <div
                  key={p.id}
                  className="group bg-surface border border-line p-3 flex flex-col justify-between cursor-pointer hover:border-charcoal transition-colors relative"
                  onClick={() => setSelectedProduct(p)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-surface-2">
                    <SmartImage
                      slot={(p as any).imageSlot1 || (p.images && p.images[0]) || 'hero'}
                      alt={p.name}
                      aspectRatio="3:4"
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <SmartImage
                        slot={(p as any).imageSlot2 || (p.images && p.images[1]) || (p.images && p.images[0]) || 'hero'}
                        alt={`${p.name} tampak alternatif`}
                        aspectRatio="3:4"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Sale Badge */}
                    {p.isSale && (
                      <span
                        className="absolute top-2 left-2 bg-sale text-white px-2 py-0.5 text-[9px] tracking-[0.14em] font-sans font-medium z-10"
                        style={{ borderRadius: '9999px' }}
                      >
                        SALE
                      </span>
                    )}

                    {/* Stock Badges */}
                    {isOutOfStock ? (
                      <span
                        className="absolute top-2 right-2 bg-charcoal text-white px-2 py-0.5 text-[9px] tracking-wider font-sans font-medium z-10 shadow-sm"
                        style={{ borderRadius: '9999px' }}
                      >
                        HABIS
                      </span>
                    ) : isLowStock ? (
                      <span
                        className="absolute top-2 right-2 bg-status-occupied text-white px-2 py-0.5 text-[9px] tracking-wider font-sans font-medium z-10 shadow-sm"
                        style={{ borderRadius: '9999px' }}
                      >
                        SISA {stock}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <span className="label-editorial text-muted text-[10px] block mb-1">
                      {p.category} · {p.collection}
                    </span>
                    <h3 className="font-serif text-charcoal text-base font-normal leading-tight mb-2 group-hover:text-caramel-deep transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-charcoal text-sm font-medium">
                        Rp {displayPrice.toLocaleString('id-ID')}
                      </span>
                      {p.isSale && p.salePrice && (
                        <span className="text-xs text-muted line-through font-sans">
                          Rp {p.price.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Tentang Rheamanda */}
      <section className="section-padding site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="border border-line p-2 bg-white">
              <SmartImage
                slot="about-portrait"
                alt={`Studio dan Ruang Karya ${BRAND.name}`}
                aspectRatio="3:4"
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <span className="label-editorial text-muted block">Tentang {BRAND.name}</span>
              {isEditMode && (
                <span className="text-[11px] font-sans text-caramel-deep bg-caramel/10 border border-caramel/30 px-2 py-0.5 rounded-[2px]">
                  Konten dinamis mode edit aktif
                </span>
              )}
            </div>

            <h2 className="font-section-title text-charcoal font-light leading-tight">
              <EditableText
                contentKey="home.about.headline"
                defaultText="Tiga lini usaha, satu komitmen: kualitas yang dirawat dengan tulus."
                as="span"
                multiline
              />
            </h2>

            <div className="w-16 h-[1px] bg-charcoal" />

            <p className="text-ink text-base leading-relaxed font-sans font-light">
              <EditableText
                contentKey="home.about.paragraph1"
                defaultText={`${BRAND.name} mendedikasikan karya pada kesantunan dan kenyamanan hidup. Melalui busana muslimah kontemporer, kami menghadirkan siluet anggun berbahan serat alami yang sejuk dan ramah untuk keseharian maupun perayaan.`}
                as="span"
                multiline
              />
            </p>

            <p className="text-muted text-sm leading-relaxed font-sans">
              <EditableText
                contentKey="home.about.paragraph2"
                defaultText="Lini kost wanita menghadirkan D’Rhea Syariah Guest House sebagai pilihan hunian khusus wanita. Sementara layanan katering menyajikan hidangan perjamuan autentik untuk momen berharga Anda."
                as="span"
                multiline
              />
            </p>

            {/* Stats row */}
            <div className="pt-4 border-t border-line grid grid-cols-3 gap-6 text-left">
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-charcoal block">
                  <EditableText contentKey="home.stats.lines" defaultText="3" as="span" />
                </span>
                <span className="label-editorial text-muted text-[10px] sm:text-[11px] block mt-1">Lini Usaha</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-charcoal block">
                  <EditableText contentKey="home.stats.quality" defaultText="100%" as="span" />
                </span>
                <span className="label-editorial text-muted text-[10px] sm:text-[11px] block mt-1">Bahan Pilihan</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-charcoal block">
                  <EditableText contentKey="home.stats.guest" defaultText="24/7" as="span" />
                </span>
                <span className="label-editorial text-muted text-[10px] sm:text-[11px] block mt-1">Layanan Tamu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonial Section (Dynamic CMS Entity) */}
      <section className="bg-surface-2 border-y border-line section-padding">
        <div className="site-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="label-editorial text-muted block mb-2">Ulasan Tamu & Pelanggan</span>
              <h2 className="font-section-title text-charcoal">
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

      {/* 6. FAQ Section (Dynamic CMS Entity) */}
      <section className="bg-white border-b border-line section-padding">
        <div className="site-container max-w-4xl">
          <div className="text-center mb-12">
            <span className="label-editorial text-muted block mb-2">Tanya Jawab</span>
            <h2 className="font-section-title text-charcoal">
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
                  className={`border p-5 relative bg-surface rounded-[2px] transition-colors ${
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

      {/* 7. Kost Wanita Highlight */}
      <section className="bg-surface-2 section-padding">
        <div className="site-container grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="space-y-5">
            <span className="label-editorial text-indigo block">D’Rhea Syariah Guest House</span>
            <h2 className="font-section-title text-charcoal">Kost Eksklusif Wanita</h2>
            <p className="text-ink text-base leading-relaxed font-sans">
              Kenali lini hunian khusus wanita dari {BRAND.name}. Detail kamar, fasilitas penunjang,
              dan informasi reservasi kunjungan langsung.
            </p>
            <Link
              to="/kost-wanita"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-sans text-indigo font-medium hover:underline"
            >
              Lihat Halaman Kost <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/d-rhea-syariah-logo.png"
              alt="Logo D’Rhea Syariah Guest House"
              className="w-full max-w-[480px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Modals */}
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <KateringInquiryModal
        isOpen={Boolean(selectedPackage)}
        initialPackage={selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />

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
            <label className="block text-xs uppercase tracking-wider text-muted font-sans mb-1">
              {activeSectionModal === 'testimonial' ? 'Nama Pelanggan / Tamu' : 'Judul Pertanyaan'} *
            </label>
            <input
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
              <label className="block text-xs uppercase tracking-wider text-muted font-sans mb-1">
                Kota / Keterangan
              </label>
              <input
                type="text"
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-line bg-surface rounded-[2px]"
                placeholder="Jakarta Selatan"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-muted font-sans mb-1">
              {activeSectionModal === 'testimonial' ? 'Isi Ulasan Testimoni' : 'Jawaban Penjelasan'} *
            </label>
            <textarea
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
