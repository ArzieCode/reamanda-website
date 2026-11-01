// ============================================================
// Component — Property & Guest House Management View
// ============================================================
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { propertyService } from '../../services/properti';
import type { Property, PropertyStatus, Bid } from '../../types/properti';
import { Drawer } from '../ui/Drawer';
import { Modal } from '../ui/Modal';
import { GalleryField } from '../cms/GalleryField';
import {
  Home,
  Plus,
  Edit,
  Trash2,
  Copy,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  Gavel,
} from 'lucide-react';

export const PropertyManagementView: React.FC = () => {
  const { properties, refreshProperties } = useAdmin();
  const { currentUser } = useAuth();
  const { showToast } = useOverlay();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<Property['type']>('Kost Eksklusif');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState(25);
  const [startingPrice, setStartingPrice] = useState(2500000);
  const [currentBid, setCurrentBid] = useState(2500000);
  const [minimumIncrement, setMinimumIncrement] = useState(50000);
  const [status, setStatus] = useState<PropertyStatus>('tersedia');
  const [description, setDescription] = useState('');
  const [auctionEnd, setAuctionEnd] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
  const [images, setImages] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(true);

  // Bids modal
  const [selectedPropBids, setSelectedPropBids] = useState<Bid[]>([]);
  const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
  const [bidsPropName, setBidsPropName] = useState('');

  const handleOpenAdd = () => {
    setEditingProperty(null);
    setName('');
    setType('Kost Eksklusif');
    setLocation('Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan');
    setArea(25);
    setStartingPrice(3000000);
    setCurrentBid(3000000);
    setMinimumIncrement(100000);
    setStatus('tersedia');
    setDescription('');
    setAuctionEnd(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
    setImages(['https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop']);
    setIsPublished(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (p: Property) => {
    setEditingProperty(p);
    setName(p.name);
    setType(p.type);
    setLocation(p.location);
    setArea(p.area);
    setStartingPrice(p.startingPrice);
    setCurrentBid(p.currentBid);
    setMinimumIncrement(p.minimumIncrement);
    setStatus(p.status);
    setDescription(p.description);
    setAuctionEnd(p.auctionEnd ? new Date(p.auctionEnd).toISOString().slice(0, 16) : '');
    setImages(p.images || []);
    setIsPublished(p.isPublished);
    setIsDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama hunian wajib diisi.');
      return;
    }

    propertyService.saveProperty(
      {
        id: editingProperty ? editingProperty.id : undefined,
        name,
        type,
        location,
        area: Number(area),
        startingPrice: Number(startingPrice),
        currentBid: Number(currentBid),
        minimumIncrement: Number(minimumIncrement),
        status,
        description,
        specs: editingProperty?.specs || { kamarTidur: 1, kamarMandi: 1, ac: 'Ada' },
        auctionEnd: new Date(auctionEnd).toISOString(),
        images,
        isPublished,
      },
      currentUser?.name || 'Admin'
    );

    refreshProperties();
    setIsDrawerOpen(false);
    showToast(editingProperty ? 'Properti berhasil diperbarui.' : 'Properti baru berhasil ditambahkan.');
  };

  const handleQuickStatusChange = (id: string, newStatus: PropertyStatus) => {
    propertyService.updateStatus(id, newStatus, currentUser?.name || 'Admin');
    refreshProperties();
    showToast(`Status properti diubah ke "${newStatus}".`);
  };

  const handleDuplicate = (id: string) => {
    const copy = propertyService.duplicateProperty(id, currentUser?.name || 'Admin');
    refreshProperties();
    showToast(`Properti disalin: "${copy.name}".`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus properti ini?')) {
      const deleted = propertyService.deleteProperty(id, currentUser?.name || 'Admin');
      refreshProperties();
      showToast(`Properti "${deleted.name}" dihapus.`);
    }
  };

  const handleOpenBids = (p: Property) => {
    const bids = propertyService.getBids(p.id);
    setSelectedPropBids(bids);
    setBidsPropName(p.name);
    setIsBidsModalOpen(true);
  };

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const getStatusColor = (st: PropertyStatus) => {
    if (st === 'tersedia') return 'text-status-available border-status-available/30 bg-status-available/10';
    if (st === 'dp') return 'text-status-deposit border-status-deposit/30 bg-status-deposit/10';
    return 'text-status-occupied border-status-occupied/30 bg-status-occupied/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h2 className="font-serif text-charcoal text-2xl font-light m-0">
            D’Rhea Syariah & Properti Eksklusif
          </h2>
          <p className="text-xs text-muted font-sans m-0 mt-0.5">
            Manajemen unit kamar guest house, kost wanita, status ketersediaan, dan lelang penawaran sewa.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-wider font-sans rounded-[2px] flex items-center gap-1.5 transition-colors self-start sm:self-auto font-medium"
        >
          <Plus size={14} /> Tambah Unit Baru
        </button>
      </div>

      {/* Grid of Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div key={p.id} className="bg-white border border-line rounded-[2px] overflow-hidden flex flex-col justify-between group">
            <div>
              {/* Image with status badge */}
              <div className="relative aspect-[16/10] bg-surface-2 overflow-hidden">
                <img
                  src={p.images[0] || '/rheamanda-mark.png'}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-sans tracking-widest rounded-[2px] border ${getStatusColor(p.status)}`}>
                    {p.status === 'tersedia' ? 'Tersedia' : p.status === 'dp' ? 'Sudah DP' : 'Ditempati'}
                  </span>
                  {!p.isPublished && (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-sans tracking-widest bg-charcoal text-white rounded-[2px]">
                      Draf
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 bg-charcoal/80 text-white text-[10px] px-2 py-0.5 rounded-xs font-sans">
                  {p.area} m² · {p.type}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <h4 className="font-serif text-charcoal text-lg font-light m-0 leading-tight">
                  {p.name}
                </h4>
                <p className="text-xs text-muted font-sans line-clamp-2 m-0">
                  {p.description}
                </p>

                {/* Price & Bids */}
                <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="text-[10px] uppercase text-muted block">Penawaran Tertinggi:</span>
                    <span className="font-serif text-charcoal text-base font-medium">
                      {formatRupiah(p.currentBid)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBids(p)}
                    className="flex items-center gap-1 text-caramel-deep hover:underline text-[11px]"
                  >
                    <Gavel size={12} /> Riwayat Penawaran
                  </button>
                </div>
              </div>
            </div>

            {/* Footer with Quick Status Select & Actions */}
            <div className="p-3 bg-surface border-t border-line flex items-center justify-between gap-2 text-xs font-sans">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase text-muted">Status:</span>
                <select
                  value={p.status}
                  onChange={(e) => handleQuickStatusChange(p.id, e.target.value as PropertyStatus)}
                  className="px-2 py-1 text-[11px] border border-line bg-white rounded-[2px] text-ink"
                >
                  <option value="tersedia">Tersedia</option>
                  <option value="dp">Sudah DP</option>
                  <option value="ditempati">Sudah Ditempati</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 text-muted hover:text-charcoal bg-white border border-line rounded-[2px]"
                  title="Sunting Unit"
                >
                  <Edit size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicate(p.id)}
                  className="p-1.5 text-muted hover:text-charcoal bg-white border border-line rounded-[2px]"
                  title="Duplikat Unit"
                >
                  <Copy size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 text-muted hover:text-status-occupied bg-white border border-line rounded-[2px]"
                  title="Hapus Unit"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Drawer Form */}
      <Drawer
        id="property-drawer-form"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProperty ? `Sunting Unit — ${editingProperty.name}` : 'Tambah Unit Properti Baru'}
        side="right"
        maxWidth="w-full sm:max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block uppercase tracking-wider text-muted mb-1">Nama Hunian / Unit</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Tipe Properti</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-2.5 py-2 border border-line rounded-[2px] text-xs bg-white text-ink"
              >
                <option value="Kost Eksklusif">Kost Eksklusif Wanita</option>
                <option value="Guest House">Guest House Syariah</option>
                <option value="Paviliun">Paviliun</option>
                <option value="Ruang Usaha">Ruang Usaha / Studio</option>
              </select>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Luas Ruangan (m²)</label>
              <input
                type="number"
                min={5}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-muted mb-1">Lokasi Alamat</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Harga Buka Sewa (Rp)</label>
              <input
                type="number"
                step={50000}
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Penawaran Saat Ini (Rp)</label>
              <input
                type="number"
                step={50000}
                value={currentBid}
                onChange={(e) => setCurrentBid(Number(e.target.value))}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Kelipatan Bid (Rp)</label>
              <input
                type="number"
                step={10000}
                value={minimumIncrement}
                onChange={(e) => setMinimumIncrement(Number(e.target.value))}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Status Ketersediaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full px-2.5 py-2 border border-line rounded-[2px] text-xs bg-white text-ink"
              >
                <option value="tersedia">Tersedia</option>
                <option value="dp">Sudah DP</option>
                <option value="ditempati">Sudah Ditempati</option>
              </select>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted mb-1">Waktu Lelang Berakhir</label>
              <input
                type="datetime-local"
                value={auctionEnd}
                onChange={(e) => setAuctionEnd(e.target.value)}
                className="w-full px-3 py-1.5 border border-line rounded-[2px] text-xs bg-white text-ink"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-muted mb-1">Deskripsi & Fasilitas</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
            />
          </div>

          <div>
            <span className="block uppercase tracking-wider text-muted mb-2">Galeri Foto Unit</span>
            <GalleryField images={images} onChange={setImages} />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-line">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 border border-line rounded-[2px] hover:border-charcoal text-xs uppercase font-sans"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-charcoal text-white hover:bg-caramel-deep rounded-[2px] text-xs uppercase tracking-widest font-sans font-medium"
            >
              Simpan Properti
            </button>
          </div>
        </form>
      </Drawer>

      {/* Bids Modal */}
      {isBidsModalOpen && (
        <Modal
          id="bids-modal"
          isOpen={isBidsModalOpen}
          onClose={() => setIsBidsModalOpen(false)}
          title={`Riwayat Penawaran — ${bidsPropName}`}
          maxWidth="md"
        >
          <div className="space-y-3 max-h-[50vh] overflow-y-auto text-xs font-sans">
            {selectedPropBids.length === 0 ? (
              <div className="p-8 text-center text-muted bg-surface/30 border border-line">
                Belum ada penawaran yang diajukan untuk unit ini.
              </div>
            ) : (
              selectedPropBids.map((b, idx) => (
                <div key={b.id} className="p-3 border border-line bg-white rounded-[2px] flex items-center justify-between">
                  <div>
                    <div className="font-medium text-charcoal">{b.bidderName} ({b.phone || '-'})</div>
                    <span className="text-[10px] text-muted">
                      {new Date(b.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-charcoal text-sm font-medium block">
                      {formatRupiah(b.amount)}
                    </span>
                    <span className={`text-[10px] uppercase font-sans tracking-wider ${idx === 0 ? 'text-status-available font-medium' : 'text-muted'}`}>
                      {idx === 0 ? 'Tertinggi' : 'Outbid'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
