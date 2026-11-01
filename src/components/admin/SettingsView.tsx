// ============================================================
// Component — Settings View (Brand, WhatsApp, SEO, Backup & Reset)
// ============================================================
import React, { useState, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { downloadBackupFile, restoreFromBackup, resetAllDemoData } from '../../services/backup';
import { ImageField } from '../cms/ImageField';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Check,
  Palette,
  Globe,
  Phone,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useAdmin();
  const { isOwner } = useAuth();
  const { showToast } = useOverlay();

  // Settings form states
  const [brandName, setBrandName] = useState(settings.brandName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [bankText, setBankText] = useState(settings.bankAccountText);
  const [shippingText, setShippingText] = useState(settings.shippingPricesText);
  const [businessHours, setBusinessHours] = useState(settings.businessHours);
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold || 5);
  const [accentColor, setAccentColor] = useState(settings.accentColor || '--caramel-deep');

  // SEO
  const [seoHomeTitle, setSeoHomeTitle] = useState(settings.seoHomeTitle);
  const [seoHomeDesc, setSeoHomeDesc] = useState(settings.seoHomeDesc);
  const [seoBusanaTitle, setSeoBusanaTitle] = useState(settings.seoBusanaTitle);
  const [seoBusanaDesc, setSeoBusanaDesc] = useState(settings.seoBusanaDesc);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      brandName,
      tagline,
      logoUrl,
      faviconUrl,
      phone,
      whatsappNumber: whatsapp,
      email,
      address,
      instagram,
      bankAccountText: bankText,
      shippingPricesText: shippingText,
      businessHours,
      lowStockThreshold: Number(lowStockThreshold),
      accentColor,
      seoHomeTitle,
      seoHomeDesc,
      seoBusanaTitle,
      seoBusanaDesc,
    });
    showToast('Konfigurasi dan setelan situs berhasil disimpan.');
  };

  const handleExportBackup = async () => {
    try {
      await downloadBackupFile();
      showToast('Cadangan berkas JSON (termasuk gambar) berhasil diunduh.');
    } catch {
      showToast('Gagal mengekspor data cadangan.');
    }
  };

  const handleImportFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        await restoreFromBackup(json);
        await resetAllData(); // Reload memory state
        showToast('Data berhasil dipulihkan dari cadangan.');
      } catch (err: any) {
        showToast('Format berkas tidak valid: ' + (err.message || 'Error'));
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = async () => {
    if (window.confirm('Yakin ingin mereset seluruh data demo ke kondisi awal bawaan pabrik? Seluruh pesanan dan suntingan kustom akan dikembalikan.')) {
      await resetAllData();
      showToast('Seluruh data demo berhasil dikembalikan.');
    }
  };

  const tokenColors = [
    { id: '--charcoal', label: 'Charcoal', hex: '#1B1713' },
    { id: '--caramel-deep', label: 'Caramel Deep', hex: '#7D5A28' },
    { id: '--caramel', label: 'Caramel', hex: '#A67C42' },
    { id: '--indigo', label: 'Indigo', hex: '#2C353F' },
    { id: '--status-available', label: 'Sage Hijau', hex: '#6A7A66' },
    { id: '--sand', label: 'Sand Krem', hex: '#DFD4C4' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-line">
        <h2 className="font-serif text-charcoal text-2xl font-light m-0">Pengaturan Sistem & Cadangan Data</h2>
        <p className="text-xs text-muted font-sans m-0 mt-0.5">
          Kelola profil jenama, kontak resmi, rekening bank, aksen warna, SEO, serta ekspor dan impor data.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8 text-xs font-sans">
        {/* Section 1: Profil Jenama & Logo */}
        <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
          <span className="label-editorial text-muted block">Identitas Jenama & Logo</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-muted mb-1">Nama Brand</label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>

            <div>
              <label className="block uppercase text-muted mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block uppercase text-muted mb-1">Logo Mark (Simbol)</label>
              <ImageField
                value={logoUrl}
                aspectRatio="1:1"
                className="max-w-[140px]"
                onChange={(res) => setLogoUrl(res.url)}
              />
            </div>

            <div>
              <label className="block uppercase text-muted mb-1">Favicon Ikon</label>
              <ImageField
                value={faviconUrl}
                aspectRatio="1:1"
                className="max-w-[140px]"
                onChange={(res) => setFaviconUrl(res.url)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kontak & WhatsApp */}
        <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
          <span className="label-editorial text-muted block">Kontak & Lokasi Butik</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-muted mb-1">Nomor WhatsApp Pusat (628...)</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
              <span className="text-[11px] text-muted block mt-1">
                Tautan polos digunakan di tombol konsultasi & konfirmasi pemesanan.
              </span>
            </div>

            <div>
              <label className="block uppercase text-muted mb-1">Nomor Telepon Kantor</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-muted mb-1">Alamat Surel Resmi</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>

            <div>
              <label className="block uppercase text-muted mb-1">Akun Instagram</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@reamanda_official"
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">Alamat Fisik Butik & Galeri</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
            />
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">Jam Operasional Layanan</label>
            <input
              type="text"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
            />
          </div>
        </div>

        {/* Section 3: Rekening Bank, Pengiriman & Ambang Stok */}
        <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
          <span className="label-editorial text-muted block">Operasional, Rekening & Ambang Stok</span>

          <div>
            <label className="block uppercase text-muted mb-1">Informasi Rekening Bank Pembayaran</label>
            <input
              type="text"
              value={bankText}
              onChange={(e) => setBankText(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
            />
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">Ketentuan Ongkos Kirim</label>
            <input
              type="text"
              value={shippingText}
              onChange={(e) => setShippingText(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
            />
          </div>

          <div>
            <label className="block uppercase text-muted mb-1">
              Batas Ambang Stok Menipis (Unit)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="w-32 px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
            />
            <span className="text-[11px] text-muted block mt-1">
              Produk dengan stok di bawah atau sama dengan angka ini akan muncul di daftar peringatan dasbor.
            </span>
          </div>

          {/* Accent Color Chooser (Limited to tokens.css) */}
          <div className="pt-2">
            <label className="block uppercase text-muted mb-2">Pilihan Aksen Warna Utama (Design Tokens)</label>
            <div className="flex flex-wrap gap-3">
              {tokenColors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAccentColor(c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-[2px] transition-all ${
                    accentColor === c.id ? 'border-charcoal bg-surface font-medium' : 'border-line bg-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-line/50 shrink-0" style={{ backgroundColor: c.hex }} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: SEO Metadata per Halaman */}
        <div className="p-6 bg-white border border-line rounded-[2px] space-y-4">
          <span className="label-editorial text-muted block">Optimasi Mesin Pencari (SEO)</span>

          <div className="space-y-3">
            <div>
              <label className="block uppercase text-muted mb-1">Judul Halaman Beranda (Home Title)</label>
              <input
                type="text"
                value={seoHomeTitle}
                onChange={(e) => setSeoHomeTitle(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
            <div>
              <label className="block uppercase text-muted mb-1">Deskripsi Halaman Beranda (Home Description)</label>
              <textarea
                rows={2}
                value={seoHomeDesc}
                onChange={(e) => setSeoHomeDesc(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-line/60">
            <div>
              <label className="block uppercase text-muted mb-1">Judul Halaman Busana</label>
              <input
                type="text"
                value={seoBusanaTitle}
                onChange={(e) => setSeoBusanaTitle(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
            <div>
              <label className="block uppercase text-muted mb-1">Deskripsi Halaman Busana</label>
              <textarea
                rows={2}
                value={seoBusanaDesc}
                onChange={(e) => setSeoBusanaDesc(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-[2px] text-sm text-ink bg-white"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-charcoal text-white hover:bg-caramel-deep text-xs uppercase tracking-widest font-sans rounded-[2px] transition-colors font-medium shadow-sm"
          >
            Simpan Seluruh Pengaturan
          </button>
        </div>
      </form>

      {/* Section 5: Cadangan Data & Reset Demo */}
      <div className="p-6 bg-white border border-line rounded-[2px] space-y-4 text-xs font-sans">
        <span className="label-editorial text-muted block">Cadangan Data & Reset Lingkungan Demo</span>

        <p className="text-muted m-0 leading-relaxed">
          Ekspor mencadangkan seluruh data produk, riwayat pesanan, profil pelanggan, setelan situs, dan arsip gambar IndexedDB ke dalam satu berkas JSON terpadu.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2 bg-charcoal text-white hover:bg-caramel-deep rounded-[2px] flex items-center gap-1.5 uppercase tracking-wider font-sans"
          >
            <Download size={13} /> Ekspor Data (JSON + Gambar)
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => handleImportFile(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-line hover:border-charcoal bg-white rounded-[2px] flex items-center gap-1.5 uppercase tracking-wider font-sans text-charcoal"
          >
            <Upload size={13} /> Impor Data Cadangan
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 text-status-occupied border border-status-occupied/40 hover:bg-status-occupied/10 rounded-[2px] flex items-center gap-1.5 uppercase tracking-wider font-sans ml-auto"
          >
            <RotateCcw size={13} /> Reset Data Demo
          </button>
        </div>
      </div>
    </div>
  );
};
