// ============================================================
// Component — Catering Management View (Packages, Dishes & Inquiries)
// ============================================================
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { cateringService } from '../../services/katering';
import type { KateringPackage, KateringDish, CateringInquiry } from '../../types/katering';
import { Drawer } from '../ui/Drawer';
import { GalleryField } from '../cms/GalleryField';
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Check,
  ShoppingBag,
} from 'lucide-react';

export const CateringManagementView: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useOverlay();

  const [activeTab, setActiveTab] = useState<'packages' | 'dishes' | 'inquiries'>('packages');

  const [packages, setPackages] = useState<KateringPackage[]>(() => cateringService.getPackages());
  const [dishes, setDishes] = useState<KateringDish[]>(() => cateringService.getDishes());
  const [inquiries, setInquiries] = useState<CateringInquiry[]>(() => cateringService.getInquiries());

  // Package Drawer Form
  const [isPkgDrawerOpen, setIsPkgDrawerOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<KateringPackage | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState(95000);
  const [pkgUnit, setPkgUnit] = useState('porsi');
  const [pkgMinOrder, setPkgMinOrder] = useState(50);
  const [pkgLeadTime, setPkgLeadTime] = useState(3);
  const [pkgInclusions, setPkgInclusions] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgImages, setPkgImages] = useState<string[]>([]);
  const [pkgIsPublished, setPkgIsPublished] = useState(true);

  // Dish Drawer Form
  const [isDishDrawerOpen, setIsDishDrawerOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<KateringDish | null>(null);
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState<KateringDish['category']>('Utama');
  const [dishPrice, setDishPrice] = useState(35000);
  const [dishMinOrder, setDishMinOrder] = useState(20);
  const [dishDesc, setDishDesc] = useState('');
  const [dishIsPopular, setDishIsPopular] = useState(false);

  const reloadData = () => {
    setPackages(cateringService.getPackages());
    setDishes(cateringService.getDishes());
    setInquiries(cateringService.getInquiries());
  };

  const handleOpenAddPackage = () => {
    setEditingPkg(null);
    setPkgName('');
    setPkgPrice(110000);
    setPkgUnit('porsi');
    setPkgMinOrder(50);
    setPkgLeadTime(4);
    setPkgInclusions('Nasi Pandan Wangi\nDaging Rendang\nAyam Bakar Madu\nSup Kimlo\nPuding Caramel');
    setPkgDesc('');
    setPkgImages(['https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop']);
    setPkgIsPublished(true);
    setIsPkgDrawerOpen(true);
  };

  const handleOpenEditPackage = (pkg: KateringPackage) => {
    setEditingPkg(pkg);
    setPkgName(pkg.name);
    setPkgPrice(pkg.startingPrice);
    setPkgUnit(pkg.unit);
    setPkgMinOrder(pkg.minimumOrder);
    setPkgLeadTime(pkg.leadTimeDays);
    setPkgInclusions(pkg.inclusions.join('\n'));
    setPkgDesc(pkg.description);
    setPkgImages(pkg.images || []);
    setPkgIsPublished(pkg.isPublished);
    setIsPkgDrawerOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) return;

    cateringService.savePackage(
      {
        id: editingPkg ? editingPkg.id : undefined,
        name: pkgName.trim(),
        slug: pkgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        startingPrice: Number(pkgPrice),
        unit: pkgUnit,
        minimumOrder: Number(pkgMinOrder),
        minimumUnit: pkgUnit,
        leadTimeDays: Number(pkgLeadTime),
        inclusions: pkgInclusions.split('\n').map((s) => s.trim()).filter(Boolean),
        description: pkgDesc.trim(),
        images: pkgImages,
        isPublished: pkgIsPublished,
        sortOrder: editingPkg ? editingPkg.sortOrder : packages.length + 1,
      },
      currentUser?.name || 'Admin'
    );

    reloadData();
    setIsPkgDrawerOpen(false);
    showToast(editingPkg ? 'Paket katering diperbarui.' : 'Paket katering baru ditambahkan.');
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm('Hapus paket katering ini?')) {
      cateringService.deletePackage(id);
      reloadData();
      showToast('Paket katering dihapus.');
    }
  };

  const handleOpenAddDish = () => {
    setEditingDish(null);
    setDishName('');
    setDishCategory('Utama');
    setDishPrice(40000);
    setDishMinOrder(20);
    setDishDesc('');
    setDishIsPopular(true);
    setIsDishDrawerOpen(true);
  };

  const handleOpenEditDish = (dish: KateringDish) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setDishCategory(dish.category);
    setDishPrice(dish.price);
    setDishMinOrder(dish.minimumOrder);
    setDishDesc(dish.description);
    setDishIsPopular(dish.isPopular);
    setIsDishDrawerOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    cateringService.saveDish(
      {
        id: editingDish ? editingDish.id : undefined,
        name: dishName.trim(),
        category: dishCategory,
        price: Number(dishPrice),
        minimumOrder: Number(dishMinOrder),
        description: dishDesc.trim(),
        isPopular: dishIsPopular,
        isPublished: true,
      },
      currentUser?.name || 'Admin'
    );

    reloadData();
    setIsDishDrawerOpen(false);
    showToast(editingDish ? 'Menu hidangan diperbarui.' : 'Menu hidangan baru ditambahkan.');
  };

  const handleDeleteDish = (id: string) => {
    if (window.confirm('Hapus menu hidangan ini?')) {
      cateringService.deleteDish(id);
      reloadData();
      showToast('Menu hidangan dihapus.');
    }
  };

  const handleUpdateInquiryStatus = (id: string, status: CateringInquiry['status']) => {
    cateringService.updateInquiryStatus(id, status, currentUser?.name || 'Admin');
    reloadData();
    showToast(`Status konsultasi katering diubah ke "${status}".`);
  };

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h2 className="font-serif text-charcoal text-2xl font-light m-0">Katering & Perjamuan</h2>
          <p className="text-xs text-muted font-sans m-0 mt-0.5">
            Kelola paket prasmanan, daftar menu hidangan pilihan, lead time PO, dan permintaan konsultasi.
          </p>
        </div>

        {activeTab === 'packages' ? (
          <button
            type="button"
            onClick={handleOpenAddPackage}
            className="px-4 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors self-start sm:self-auto font-medium"
          >
            <Plus size={14} /> Tambah Paket Katering
          </button>
        ) : activeTab === 'dishes' ? (
          <button
            type="button"
            onClick={handleOpenAddDish}
            className="px-4 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors self-start sm:self-auto font-medium"
          >
            <Plus size={14} /> Tambah Menu Hidangan
          </button>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line gap-2 text-xs font-sans">
        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`py-2 px-3 uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'packages' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
          }`}
        >
          Paket Perjamuan ({packages.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dishes')}
          className={`py-2 px-3 uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'dishes' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
          }`}
        >
          Daftar Menu Hidangan ({dishes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`py-2 px-3 uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'inquiries' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-muted'
          }`}
        >
          Permintaan Konsultasi ({inquiries.length})
        </button>
      </div>

      {/* 1. Tab Packages */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white border border-line rounded-[2px] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] bg-surface-2 overflow-hidden">
                  <img src={pkg.images[0] || '/rheamanda-mark.png'} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2 text-xs font-sans">
                  <h4 className="font-serif text-charcoal text-lg m-0">{pkg.name}</h4>
                  <div className="font-serif text-charcoal text-base font-medium">
                    Mulai {formatRupiah(pkg.startingPrice)} / {pkg.unit}
                  </div>
                  <div className="flex items-center gap-3 text-muted text-[11px]">
                    <span>Min Order: {pkg.minimumOrder} {pkg.minimumUnit}</span>
                    <span>PO Lead Time: {pkg.leadTimeDays} Hari</span>
                  </div>
                  <p className="text-muted line-clamp-2 m-0 mt-2">{pkg.description}</p>
                </div>
              </div>

              <div className="p-3 bg-surface border-t border-line flex items-center justify-end gap-2 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => handleOpenEditPackage(pkg)}
                  className="px-2.5 py-1 bg-white border border-line hover:border-charcoal rounded-[2px] flex items-center gap-1"
                >
                  <Edit size={12} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="p-1 text-muted hover:text-status-occupied bg-white border border-line rounded-[2px]"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Tab Dishes */}
      {activeTab === 'dishes' && (
        <div className="border border-line bg-white rounded-[2px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-muted">
                  <th className="py-3 px-4">Nama Hidangan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga Satuan</th>
                  <th className="py-3 px-4">Minimal Pesan</th>
                  <th className="py-3 px-4">Populer</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {dishes.map((d) => (
                  <tr key={d.id} className="hover:bg-surface/30">
                    <td className="py-3 px-4 font-medium text-charcoal">{d.name}</td>
                    <td className="py-3 px-4 text-muted">{d.category}</td>
                    <td className="py-3 px-4 font-serif text-charcoal text-sm">{formatRupiah(d.price)}</td>
                    <td className="py-3 px-4 text-muted">{d.minimumOrder} porsi</td>
                    <td className="py-3 px-4">
                      {d.isPopular && (
                        <span className="px-2 py-0.5 text-[9px] uppercase font-sans tracking-widest bg-charcoal text-white rounded-[2px]">
                          Paling Disukai
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditDish(d)}
                          className="p-1 text-muted hover:text-charcoal rounded-[2px]"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDish(d.id)}
                          className="p-1 text-muted hover:text-status-occupied rounded-[2px]"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Tab Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="p-5 border border-line bg-white rounded-[2px] space-y-3 text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                <div>
                  <span className="font-medium text-charcoal text-sm">{inq.nama}</span>
                  <span className="text-muted block text-[11px]">HP: {inq.telepon} · Surel: {inq.email || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-surface text-ink border border-line rounded-[2px] uppercase text-[10px]">
                    {inq.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-muted">
                <div>Paket: <strong className="text-charcoal">{inq.paketName || 'Kustom'}</strong></div>
                <div>Tanggal Acara: <strong className="text-charcoal">{inq.tanggalAcara}</strong></div>
                <div>Kuantitas: <strong className="text-charcoal">{inq.jumlahPorsi} porsi</strong></div>
              </div>

              {inq.catatan && (
                <p className="m-0 bg-surface/50 p-2.5 rounded-[2px] text-ink italic">
                  "{inq.catatan}"
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted text-[11px]">Ubah Status:</span>
                  {(['Menunggu Konfirmasi', 'Dikonfirmasi', 'Diproses', 'Diantar', 'Selesai', 'Dibatalkan'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateInquiryStatus(inq.id, st)}
                      className={`px-2 py-1 text-[10px] rounded-[2px] border ${
                        inq.status === st ? 'bg-charcoal text-white border-charcoal font-medium' : 'bg-white text-ink border-line'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <a
                  href={`https://wa.me/${inq.telepon.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo Ibu/Bpk ${inq.nama}, kami dari Rea Manda Katering ingin menindaklanjuti konsultasi acara Anda.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-surface border border-line hover:border-charcoal text-charcoal text-xs rounded-[2px] transition-colors"
                >
                  Hubungi di WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Form Drawer */}
      <Drawer
        id="pkg-drawer"
        isOpen={isPkgDrawerOpen}
        onClose={() => setIsPkgDrawerOpen(false)}
        title={editingPkg ? `Sunting Paket — ${editingPkg.name}` : 'Tambah Paket Katering Baru'}
        side="right"
        maxWidth="w-full sm:max-w-xl"
      >
        <form onSubmit={handleSavePackage} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block uppercase text-muted mb-1">Nama Paket</label>
            <input type="text" required value={pkgName} onChange={(e) => setPkgName(e.target.value)} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase text-muted mb-1">Harga Mulai (Rp)</label>
              <input type="number" step={5000} value={pkgPrice} onChange={(e) => setPkgPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
            </div>
            <div>
              <label className="block uppercase text-muted mb-1">Satuan</label>
              <input type="text" value={pkgUnit} onChange={(e) => setPkgUnit(e.target.value)} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase text-muted mb-1">Minimal Order (Porsi/Box)</label>
              <input type="number" min={1} value={pkgMinOrder} onChange={(e) => setPkgMinOrder(Number(e.target.value))} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
            </div>
            <div>
              <label className="block uppercase text-muted mb-1">PO Lead Time (Hari Kerja)</label>
              <input type="number" min={1} value={pkgLeadTime} onChange={(e) => setPkgLeadTime(Number(e.target.value))} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
            </div>
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">Menu Inklusi Paket (1 menu per baris)</label>
            <textarea rows={4} value={pkgInclusions} onChange={(e) => setPkgInclusions(e.target.value)} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">Deskripsi Singkat</label>
            <textarea rows={2} value={pkgDesc} onChange={(e) => setPkgDesc(e.target.value)} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
          </div>

          <div>
            <span className="block uppercase text-muted mb-1">Galeri Foto Paket</span>
            <GalleryField images={pkgImages} onChange={setPkgImages} />
          </div>

          <button type="submit" className="w-full py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest rounded-[2px]">
            Simpan Paket Katering
          </button>
        </form>
      </Drawer>

      {/* Dish Form Drawer */}
      <Drawer
        id="dish-drawer"
        isOpen={isDishDrawerOpen}
        onClose={() => setIsDishDrawerOpen(false)}
        title={editingDish ? `Sunting Hidangan — ${editingDish.name}` : 'Tambah Hidangan Baru'}
        side="right"
        maxWidth="w-full sm:max-w-md"
      >
        <form onSubmit={handleSaveDish} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block uppercase text-muted mb-1">Nama Hidangan</label>
            <input type="text" required value={dishName} onChange={(e) => setDishName(e.target.value)} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase text-muted mb-1">Kategori</label>
              <select value={dishCategory} onChange={(e) => setDishCategory(e.target.value as any)} className="w-full px-2.5 py-2 border border-line bg-white rounded-[2px]">
                <option value="Utama">Utama</option>
                <option value="Sup">Sup</option>
                <option value="Nasi">Nasi</option>
                <option value="Sayur">Sayur</option>
                <option value="Penutup">Penutup</option>
                <option value="Minuman">Minuman</option>
              </select>
            </div>

            <div>
              <label className="block uppercase text-muted mb-1">Harga Satuan (Rp)</label>
              <input type="number" step={1000} value={dishPrice} onChange={(e) => setDishPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
            </div>
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">Minimal Pemesanan (Porsi)</label>
            <input type="number" min={5} value={dishMinOrder} onChange={(e) => setDishMinOrder(Number(e.target.value))} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">Deskripsi Hidangan</label>
            <textarea rows={3} value={dishDesc} onChange={(e) => setDishDesc(e.target.value)} className="w-full px-3 py-2 border border-line bg-white rounded-[2px]" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="pop-dish" checked={dishIsPopular} onChange={(e) => setDishIsPopular(e.target.checked)} className="rounded border-line text-charcoal" />
            <label htmlFor="pop-dish" className="cursor-pointer">Tandai sebagai Menu Favorit (Populer)</label>
          </div>

          <button type="submit" className="w-full py-2.5 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest rounded-[2px]">
            Simpan Menu Hidangan
          </button>
        </form>
      </Drawer>
    </div>
  );
};
