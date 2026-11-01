// ============================================================
// Service — Katering, Paket, Menu Hidangan & Konsultasi
// ============================================================
import type {
  KateringPackage,
  KateringDish,
  CateringInquiry,
} from '../types/katering';
import {
  INITIAL_KATERING_PACKAGES,
  INITIAL_KATERING_DISHES,
  INITIAL_CATERING_INQUIRIES,
} from './seed';
import { logActivity } from './activity';

const STORAGE_KEY_PACKAGES = 'reamanda:packages_db';
const STORAGE_KEY_DISHES = 'reamanda:dishes_db';
const STORAGE_KEY_INQUIRIES = 'reamanda:catering_inquiries_db';

export class CateringService {
  // 1. Packages
  public getPackages(publishedOnly = false): KateringPackage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PACKAGES);
      let list: KateringPackage[] = raw ? JSON.parse(raw) : INITIAL_KATERING_PACKAGES;
      if (publishedOnly) list = list.filter((p) => p.isPublished);
      return list.sort((a, b) => a.sortOrder - b.sortOrder);
    } catch {
      return INITIAL_KATERING_PACKAGES;
    }
  }

  public savePackage(pkg: Omit<KateringPackage, 'id'> & { id?: string }, performedBy = 'Admin'): KateringPackage {
    const list = this.getPackages();
    if (pkg.id) {
      const idx = list.findIndex((p) => p.id === pkg.id);
      if (idx !== -1) {
        const updated = { ...list[idx], ...pkg, id: pkg.id };
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(list));
        return updated;
      }
    }
    const created: KateringPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
    };
    list.push(created);
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(list));
    return created;
  }

  public deletePackage(id: string): void {
    const list = this.getPackages().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(list));
  }

  // 2. Dishes
  public getDishes(category?: string): KateringDish[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DISHES);
      let list: KateringDish[] = raw ? JSON.parse(raw) : INITIAL_KATERING_DISHES;
      if (category && category !== 'all') {
        list = list.filter((d) => d.category === category);
      }
      return list;
    } catch {
      return INITIAL_KATERING_DISHES;
    }
  }

  public saveDish(dish: Omit<KateringDish, 'id'> & { id?: string }, performedBy = 'Admin'): KateringDish {
    const list = this.getDishes();
    if (dish.id) {
      const idx = list.findIndex((d) => d.id === dish.id);
      if (idx !== -1) {
        const updated = { ...list[idx], ...dish, id: dish.id };
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEY_DISHES, JSON.stringify(list));
        return updated;
      }
    }
    const created: KateringDish = {
      ...dish,
      id: `dish-${Date.now()}`,
    };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEY_DISHES, JSON.stringify(list));
    return created;
  }

  public deleteDish(id: string): void {
    const list = this.getDishes().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY_DISHES, JSON.stringify(list));
  }

  // 3. Inquiries
  public getInquiries(customerId?: string): CateringInquiry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      let list: CateringInquiry[] = raw ? JSON.parse(raw) : INITIAL_CATERING_INQUIRIES;
      if (customerId) list = list.filter((i) => i.customerId === customerId);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return INITIAL_CATERING_INQUIRIES;
    }
  }

  public createInquiry(inquiry: Omit<CateringInquiry, 'id' | 'createdAt' | 'status'> & { customerId?: string }): CateringInquiry {
    const list = this.getInquiries();
    const created: CateringInquiry = {
      ...inquiry,
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Menunggu Konfirmasi',
      createdAt: new Date().toISOString(),
    };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));

    logActivity({
      userId: inquiry.customerId || 'guest',
      userName: inquiry.nama,
      userRole: 'customer',
      action: 'CATERING_INQUIRY',
      entityType: 'catering',
      entityId: created.id,
      entityName: created.nama,
      details: `Permintaan konsultasi katering baru untuk tanggal ${created.tanggalAcara}.`,
    });

    return created;
  }

  public updateInquiryStatus(id: string, status: CateringInquiry['status'], performedBy = 'Admin'): CateringInquiry {
    const list = this.getInquiries();
    const target = list.find((i) => i.id === id);
    if (!target) throw new Error('Permintaan tidak ditemukan.');

    target.status = status;
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));

    logActivity({
      userId: 'staff',
      userName: performedBy,
      userRole: 'admin',
      action: 'UPDATE_CATERING_STATUS',
      entityType: 'catering',
      entityId: target.id,
      entityName: target.nama,
      details: `Mengubah status konsultasi katering ${target.id} ke "${status}".`,
    });

    return target;
  }
}

export const cateringService = new CateringService();
