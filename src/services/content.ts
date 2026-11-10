// ============================================================
// Service — Site Content, Versions, Sections, & Settings
// ============================================================
import type {
  SiteContent,
  ContentVersion,
  SectionEntity,
  GeneralSettings,
} from '../types/content';
import {
  INITIAL_SITE_CONTENT,
  INITIAL_GENERAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
} from './seed';
import { logActivity } from './activity';
import { exportAllImageBlobs, importAllImageBlobs } from './idb';

const STORAGE_KEY_CONTENT = 'reamanda:site_content';
const STORAGE_KEY_SETTINGS = 'reamanda:general_settings';
const STORAGE_KEY_SECTIONS = 'reamanda:section_entities';

export class ContentService {
  // 1. Key-Value Content with Version History (last 20 versions)
  public getContentList(): SiteContent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONTENT);
      return raw ? JSON.parse(raw) : INITIAL_SITE_CONTENT;
    } catch {
      return INITIAL_SITE_CONTENT;
    }
  }

  public getContentValue(key: string, defaultValue = ''): string {
    const list = this.getContentList();
    const item = list.find((c) => c.key === key);
    if (key === 'announcement.group.text' && item?.value === 'RHEAMANDA GROUP · TUMBUH BERSAMA, MELAYANI SEPENUH HATI') {
      return defaultValue;
    }
    return item ? item.value : defaultValue;
  }

  public updateContent(key: string, value: string, updatedBy = 'Admin'): SiteContent {
    const list = this.getContentList();
    const existingIndex = list.findIndex((c) => c.key === key);

    const now = new Date().toISOString();
    const newVersion: ContentVersion = {
      id: `ver-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      key,
      value,
      updatedAt: now,
      updatedBy,
    };

    let updatedItem: SiteContent;

    if (existingIndex !== -1) {
      const existing = list[existingIndex];
      // Keep up to 20 versions
      const versions = [newVersion, ...(existing.versions || [])].slice(0, 20);
      updatedItem = {
        ...existing,
        value,
        updatedAt: now,
        updatedBy,
        versions,
      };
      list[existingIndex] = updatedItem;
    } else {
      updatedItem = {
        key,
        value,
        updatedAt: now,
        updatedBy,
        versions: [newVersion],
      };
      list.push(updatedItem);
    }

    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(list));

    logActivity({
      userId: 'staff',
      userName: updatedBy,
      userRole: 'admin',
      action: 'UPDATE_CONTENT',
      entityType: 'content',
      entityId: key,
      entityName: key,
      details: `Menyunting konten teks: "${key}".`,
      afterState: { value },
    });

    return updatedItem;
  }

  public revertVersion(key: string, versionId: string, revertedBy = 'Admin'): SiteContent {
    const list = this.getContentList();
    const item = list.find((c) => c.key === key);
    if (!item) throw new Error('Konten tidak ditemukan.');

    const targetVersion = item.versions.find((v) => v.id === versionId);
    if (!targetVersion) throw new Error('Versi tidak ditemukan.');

    return this.updateContent(key, targetVersion.value, `${revertedBy} (Kembalikan Versi)`);
  }

  // 2. General Settings
  public getSettings(): GeneralSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!raw) return INITIAL_GENERAL_SETTINGS;
      const stored: GeneralSettings = JSON.parse(raw);
      // Update only the old default; keep any tagline the admin set intentionally.
      return stored.tagline === 'Building Better Living'
        ? { ...stored, tagline: INITIAL_GENERAL_SETTINGS.tagline }
        : stored;
    } catch {
      return INITIAL_GENERAL_SETTINGS;
    }
  }

  public updateSettings(settings: Partial<GeneralSettings>, updatedBy = 'Admin'): GeneralSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));

    logActivity({
      userId: 'staff',
      userName: updatedBy,
      userRole: 'owner',
      action: 'UPDATE_SETTINGS',
      entityType: 'settings',
      entityName: 'Pengaturan Situs',
      details: 'Memperbarui konfigurasi kontak & preferensi situs.',
    });

    return updated;
  }

  // 3. Section Entities (hero slides, testimonials, FAQs, categories, etc.)
  public getSections(type?: SectionEntity['type']): SectionEntity[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SECTIONS);
      const list: SectionEntity[] = raw ? JSON.parse(raw) : this.getDefaultSections();
      if (!type) return list.sort((a, b) => a.sortOrder - b.sortOrder);
      return list.filter((s) => s.type === type).sort((a, b) => a.sortOrder - b.sortOrder);
    } catch {
      return this.getDefaultSections();
    }
  }

  public saveSection(item: Omit<SectionEntity, 'id' | 'updatedAt'> & { id?: string }): SectionEntity {
    const list = this.getSections();
    const now = new Date().toISOString();

    if (item.id) {
      const idx = list.findIndex((s) => s.id === item.id);
      if (idx !== -1) {
        const updated: SectionEntity = {
          ...list[idx],
          ...item,
          id: item.id,
          updatedAt: now,
        };
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(list));
        return updated;
      }
    }

    const created: SectionEntity = {
      ...item,
      id: item.id || `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      updatedAt: now,
    };
    list.push(created);
    localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(list));
    return created;
  }

  public duplicateSection(id: string): SectionEntity {
    const list = this.getSections();
    const target = list.find((s) => s.id === id);
    if (!target) throw new Error('Entitas tidak ditemukan.');

    const copy: SectionEntity = {
      ...target,
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `${target.title} (Salinan)`,
      sortOrder: target.sortOrder + 1,
      updatedAt: new Date().toISOString(),
    };

    list.push(copy);
    localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(list));
    return copy;
  }

  public toggleSectionVisibility(id: string): SectionEntity {
    const list = this.getSections();
    const target = list.find((s) => s.id === id);
    if (!target) throw new Error('Entitas tidak ditemukan.');

    target.isVisible = !target.isVisible;
    target.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(list));
    return target;
  }

  public deleteSection(id: string): SectionEntity {
    const list = this.getSections();
    const target = list.find((s) => s.id === id);
    if (!target) throw new Error('Entitas tidak ditemukan.');

    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(filtered));
    return target;
  }

  public restoreSection(item: SectionEntity): void {
    const list = this.getSections();
    list.push(item);
    localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(list));
  }

  public reorderSections(orderedIds: string[]): void {
    const list = this.getSections();
    const map = new Map(list.map((s) => [s.id, s]));
    const updated: SectionEntity[] = [];

    orderedIds.forEach((id, idx) => {
      const item = map.get(id);
      if (item) {
        item.sortOrder = idx;
        updated.push(item);
        map.delete(id);
      }
    });

    // Append any unmentioned items
    map.forEach((item) => updated.push(item));
    localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(updated));
  }

  private getDefaultSections(): SectionEntity[] {
    return [
      // Hero slides
      {
        id: 'slide-1',
        type: 'hero_slide',
        title: 'Keanggunan Santun dalam Setiap Langkah Kehidupan',
        subtitle: 'Menghadirkan busana muslimah kontemporer, kost eksklusif wanita, dan jamuan berselera.',
        imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1600&auto=format&fit=crop',
        sortOrder: 1,
        isVisible: true,
        updatedAt: new Date().toISOString(),
      },
      // Testimonials
      {
        id: 'testi-1',
        type: 'testimonial',
        title: 'Ibu Hj. Mariam Al-Habsyi',
        subtitle: 'Jakarta Selatan',
        content: 'Jahitan abaya Rea Manda sangat presisi dan nyaman dipakai beribadah seharian. Bahannya jatuh dan dingin.',
        sortOrder: 1,
        isVisible: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'testi-2',
        type: 'testimonial',
        title: 'Dr. Sarah Amalia',
        subtitle: 'Surabaya',
        content: 'Katering tasyakuran Rea Manda dipuji semua tamu undangan. Nasi liwet dan rendangnya luar biasa nikmat.',
        sortOrder: 2,
        isVisible: true,
        updatedAt: new Date().toISOString(),
      },
      // FAQ
      {
        id: 'faq-1',
        type: 'faq',
        title: 'Bagaimana cara konfirmasi pemesanan katering?',
        content: 'Anda dapat memilih paket di halaman Katering dan mengirimkan formulir konsultasi. Tim kami akan segera menghubungi via WhatsApp untuk penyesuaian menu dan jadwal food tasting.',
        sortOrder: 1,
        isVisible: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'faq-2',
        type: 'faq',
        title: 'Apakah kamar di D’Rhea Syariah Guest House boleh untuk pasutri?',
        content: 'D’Rhea Syariah memprioritaskan kost eksklusif wanita. Untuk penginapan guest house harian bersama pasangan, wajib menunjukkan buku nikah resmi saat check-in.',
        sortOrder: 2,
        isVisible: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'faq-3',
        type: 'faq',
        title: 'Kebijakan penukaran ukuran busana',
        content: 'Kami menerima penukaran ukuran maksimal 3 hari kerja setelah barang diterima dengan kondisi tag utuh dan belum dicuci.',
        sortOrder: 3,
        isVisible: true,
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

export const contentService = new ContentService();
