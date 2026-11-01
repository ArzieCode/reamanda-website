// ============================================================
// Component — CMS Content Management View (Sections, FAQs, Slides)
// ============================================================
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { contentService } from '../../services/content';
import type { SectionEntity } from '../../types/content';
import { Drawer } from '../ui/Drawer';
import { CardActionToolbar } from '../cms/CardActionToolbar';
import { AddSectionCard } from '../cms/AddSectionCard';
import { ImageField } from '../cms/ImageField';
import {
  FileText,
  Plus,
  HelpCircle,
  MessageSquare,
  Sliders,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ContentManagementView: React.FC = () => {
  const { toggleEditMode } = useAdmin();
  const { showToast } = useOverlay();

  const [activeTab, setActiveTab] = useState<SectionEntity['type']>('testimonial');
  const [sections, setSections] = useState<SectionEntity[]>(() => contentService.getSections());

  // Form Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SectionEntity | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLink, setFormLink] = useState('');

  // Undo delete
  const [deletedItem, setDeletedItem] = useState<SectionEntity | null>(null);

  const reload = () => {
    setSections(contentService.getSections());
  };

  const currentList = sections.filter((s) => s.type === activeTab);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormContent('');
    setFormImageUrl('');
    setFormLink('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: SectionEntity) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormSubtitle(item.subtitle || '');
    setFormContent(item.content || '');
    setFormImageUrl(item.imageUrl || '');
    setFormLink(item.link || '');
    setIsDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    contentService.saveSection({
      id: editingItem ? editingItem.id : undefined,
      type: activeTab,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || undefined,
      content: formContent.trim() || undefined,
      imageUrl: formImageUrl || undefined,
      link: formLink.trim() || undefined,
      sortOrder: editingItem ? editingItem.sortOrder : currentList.length + 1,
      isVisible: true,
    });

    reload();
    setIsDrawerOpen(false);
    showToast(editingItem ? 'Konten diperbarui.' : 'Konten baru ditambahkan.');
  };

  const handleDuplicate = (id: string) => {
    contentService.duplicateSection(id);
    reload();
    showToast('Konten berhasil diduplikasi.');
  };

  const handleToggleVisibility = (id: string) => {
    contentService.toggleSectionVisibility(id);
    reload();
    showToast('Visibilitas konten diubah.');
  };

  const handleDelete = (id: string) => {
    const deleted = contentService.deleteSection(id);
    setDeletedItem(deleted);
    reload();
    showToast('Konten dihapus. Klik Urungkan untuk membatalkan.');
  };

  const handleUndoDelete = () => {
    if (!deletedItem) return;
    contentService.restoreSection(deletedItem);
    setDeletedItem(null);
    reload();
    showToast('Konten berhasil dikembalikan.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h2 className="font-serif text-charcoal text-2xl font-light m-0">Pengelolaan Konten Situs & Bagian</h2>
          <p className="text-xs text-muted font-sans m-0 mt-0.5">
            Sunting testimoni, pertanyaan umum (FAQ), slide spanduk, dan blok informasi secara terpusat.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors font-medium self-start sm:self-auto"
        >
          <Plus size={14} /> Tambah Item Baru
        </button>
      </div>

      {/* Undo Banner */}
      {deletedItem && (
        <div className="p-3 bg-surface border border-line flex items-center justify-between text-xs font-sans rounded-[2px]">
          <span className="text-muted">Item "{deletedItem.title}" baru saja dihapus.</span>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="flex items-center gap-1 text-charcoal font-medium hover:text-caramel-deep"
          >
            <RotateCcw size={12} /> Urungkan Hapus
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-line gap-2 text-xs font-sans">
        <button
          type="button"
          onClick={() => setActiveTab('testimonial')}
          className={`py-2 px-3 uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'testimonial' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
          }`}
        >
          Testimoni Pelanggan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`py-2 px-3 uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'faq' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
          }`}
        >
          Tanya Jawab (FAQ)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hero_slide')}
          className={`py-2 px-3 uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'hero_slide' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
          }`}
        >
          Slide Hero Utama
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentList.map((item) => (
          <div
            key={item.id}
            className={`p-5 bg-white border rounded-[2px] relative flex flex-col justify-between space-y-3 ${
              item.isVisible ? 'border-line' : 'border-line/40 opacity-60'
            }`}
          >
            {/* Toolbar */}
            <CardActionToolbar
              isVisible={item.isVisible}
              onEdit={() => handleOpenEdit(item)}
              onDuplicate={() => handleDuplicate(item.id)}
              onToggleVisibility={() => handleToggleVisibility(item.id)}
              onDelete={() => handleDelete(item.id)}
            />

            <div className="space-y-2 text-xs font-sans pr-12">
              <h4 className="font-serif text-charcoal text-lg m-0 font-light leading-snug">
                {item.title}
              </h4>
              {item.subtitle && <span className="text-[11px] text-muted block">{item.subtitle}</span>}
              {item.content && (
                <p className="text-ink leading-relaxed m-0 italic bg-surface/40 p-3 rounded-[2px]">
                  "{item.content}"
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted font-sans border-t border-line/60 pt-2">
              <span>Urutan: #{item.sortOrder}</span>
              <span>{item.isVisible ? 'Ditampilkan di situs' : 'Disembunyikan'}</span>
            </div>
          </div>
        ))}

        {/* Add Card at the end */}
        <AddSectionCard
          label={`+ Tambah ${activeTab === 'testimonial' ? 'Testimoni' : activeTab === 'faq' ? 'FAQ' : 'Slide'}`}
          onClick={handleOpenAdd}
        />
      </div>

      {/* Form Drawer */}
      <Drawer
        id="content-drawer"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? 'Sunting Item Konten' : 'Tambah Item Konten Baru'}
        side="right"
        maxWidth="w-full sm:max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block uppercase text-muted mb-1">
              {activeTab === 'testimonial' ? 'Nama Pelanggan' : activeTab === 'faq' ? 'Pertanyaan' : 'Judul Slide'}
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
            />
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">
              {activeTab === 'testimonial' ? 'Kota / Gelar' : 'Sub-judul / Keterangan'}
            </label>
            <input
              type="text"
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
            />
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">
              {activeTab === 'testimonial' ? 'Ulasan / Testimoni' : activeTab === 'faq' ? 'Jawaban Lengkap' : 'Deskripsi'}
            </label>
            <textarea
              rows={4}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full px-3 py-2 border border-line bg-white rounded-[2px]"
            />
          </div>

          {activeTab === 'hero_slide' && (
            <div>
              <span className="block uppercase text-muted mb-1">Foto Spanduk (Slide)</span>
              <ImageField value={formImageUrl} onChange={(res) => setFormImageUrl(res.url)} />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest rounded-[2px] transition-colors"
          >
            Simpan Item Konten
          </button>
        </form>
      </Drawer>
    </div>
  );
};
