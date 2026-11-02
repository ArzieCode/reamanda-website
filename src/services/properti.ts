// ============================================================
// Service — Properti, Lelang & Permintaan Kunjungan
// ============================================================
import type { Property, PropertyStatus, Bid, VisitRequest } from '../types/properti';
import { INITIAL_PROPERTIES } from './seed';
import { logActivity } from './activity';
import { migrateLegacyProperties } from './legacy-properties';

const STORAGE_KEY_PROPERTIES = 'reamanda:properties_db';
const STORAGE_KEY_BIDS = 'reamanda:bids_db';
const STORAGE_KEY_VISITS = 'reamanda:visit_requests_db';

export class PropertyService {
  public getProperties(statusFilter?: PropertyStatus | 'all'): Property[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROPERTIES);
      let list: Property[] = raw ? JSON.parse(raw) : INITIAL_PROPERTIES;
      if (raw) {
        const migrated = migrateLegacyProperties(list, INITIAL_PROPERTIES);
        if (migrated !== list) {
          localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(migrated));
          list = migrated;
        }
      }
      if (statusFilter && statusFilter !== 'all') {
        list = list.filter((p) => p.status === statusFilter);
      }
      return list;
    } catch {
      return INITIAL_PROPERTIES;
    }
  }

  public getPropertyById(id: string): Property | null {
    const list = this.getProperties();
    return list.find((p) => p.id === id) || null;
  }

  public saveProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, performedBy = 'Admin'): Property {
    const list = this.getProperties();
    const now = new Date().toISOString();

    if (property.id) {
      const idx = list.findIndex((p) => p.id === property.id);
      if (idx !== -1) {
        const updated: Property = {
          ...list[idx],
          ...property,
          id: property.id,
          updatedAt: now,
        };
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(list));

        logActivity({
          userId: 'staff',
          userName: performedBy,
          userRole: 'admin',
          action: 'UPDATE_PROPERTY',
          entityType: 'property',
          entityId: updated.id,
          entityName: updated.name,
          details: `Memperbarui data properti: ${updated.name}.`,
        });

        return updated;
      }
    }

    const created: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(list));

    logActivity({
      userId: 'staff',
      userName: performedBy,
      userRole: 'admin',
      action: 'CREATE_PROPERTY',
      entityType: 'property',
      entityId: created.id,
      entityName: created.name,
      details: `Menambahkan properti baru: ${created.name}.`,
    });

    return created;
  }

  public updateStatus(id: string, status: PropertyStatus, performedBy = 'Admin'): Property {
    const list = this.getProperties();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Properti tidak ditemukan.');

    const prev = list[idx].status;
    list[idx].status = status;
    list[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(list));

    logActivity({
      userId: 'staff',
      userName: performedBy,
      userRole: 'admin',
      action: 'UPDATE_PROPERTY_STATUS',
      entityType: 'property',
      entityId: id,
      entityName: list[idx].name,
      details: `Mengubah status hunian ${list[idx].name} dari "${prev}" menjadi "${status}".`,
      beforeState: { status: prev },
      afterState: { status },
    });

    return list[idx];
  }

  public duplicateProperty(id: string, performedBy = 'Admin'): Property {
    const p = this.getPropertyById(id);
    if (!p) throw new Error('Properti tidak ditemukan.');

    const copy: Property = {
      ...p,
      id: `prop-${Date.now()}`,
      name: `${p.name} (Salinan)`,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const list = this.getProperties();
    list.unshift(copy);
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(list));
    return copy;
  }

  public deleteProperty(id: string, performedBy = 'Admin'): Property {
    const list = this.getProperties();
    const p = list.find((item) => item.id === id);
    if (!p) throw new Error('Properti tidak ditemukan.');

    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(filtered));

    logActivity({
      userId: 'staff',
      userName: performedBy,
      userRole: 'admin',
      action: 'DELETE_PROPERTY',
      entityType: 'property',
      entityId: p.id,
      entityName: p.name,
      details: `Menghapus properti ${p.name}.`,
    });

    return p;
  }

  public restoreProperty(p: Property): void {
    const list = this.getProperties();
    list.unshift(p);
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(list));
  }

  // Bids
  public getBids(propertyId?: string, customerId?: string): Bid[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BIDS);
      let list: Bid[] = raw ? JSON.parse(raw) : [
        {
          id: 'bid-1',
          propertyId: 'prop-1',
          bidderName: 'Aisyah Putri',
          phone: '081298765432',
          amount: 4200000,
          timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
          status: 'accepted',
        },
        {
          id: 'bid-2',
          propertyId: 'prop-1',
          bidderName: 'Nurul Hidayah',
          phone: '081387654321',
          amount: 4000000,
          timestamp: new Date(Date.now() - 10 * 3600000).toISOString(),
          status: 'outbid',
        },
      ];
      if (propertyId) list = list.filter((b) => b.propertyId === propertyId);
      if (customerId) list = list.filter((b) => b.customerId === customerId);
      return list.sort((a, b) => b.amount - a.amount);
    } catch {
      return [];
    }
  }

  public placeBid(propertyId: string, amount: number, bidderName: string, phone: string, customerId?: string): Bid {
    const props = this.getProperties();
    const prop = props.find((p) => p.id === propertyId);
    if (!prop) throw new Error('Properti tidak ditemukan.');

    if (amount <= prop.currentBid) {
      throw new Error(`Penawaran harus lebih tinggi dari penawaran saat ini (Rp ${prop.currentBid.toLocaleString('id-ID')}).`);
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      propertyId,
      customerId,
      bidderName,
      phone,
      amount,
      timestamp: new Date().toISOString(),
      status: 'accepted',
    };

    const bids = this.getBids();
    // Mark previous highest for this property as outbid
    bids.forEach((b) => {
      if (b.propertyId === propertyId && b.status === 'accepted') {
        b.status = 'outbid';
      }
    });
    bids.unshift(newBid);
    localStorage.setItem(STORAGE_KEY_BIDS, JSON.stringify(bids));

    // Update property currentBid
    prop.currentBid = amount;
    this.saveProperty(prop, bidderName);

    return newBid;
  }

  // Visit Requests
  public getVisitRequests(customerId?: string): VisitRequest[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VISITS);
      let list: VisitRequest[] = raw ? JSON.parse(raw) : [
        {
          id: 'vis-1',
          propertyId: 'prop-1',
          propertyName: 'D’Rhea Syariah Guest House — Kamar Suite Marwah',
          customerName: 'Aisyah Putri',
          customerPhone: '081298765432',
          requestedDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
          requestedTime: '14:00 WIB',
          notes: 'Ingin survei kamar dan memastikan fasilitas wifi serta parkir.',
          status: 'Menunggu',
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        },
      ];
      if (customerId) list = list.filter((v) => v.customerId === customerId);
      return list;
    } catch {
      return [];
    }
  }

  public requestVisit(req: Omit<VisitRequest, 'id' | 'createdAt' | 'status'>): VisitRequest {
    const list = this.getVisitRequests();
    const created: VisitRequest = {
      ...req,
      id: `vis-${Date.now()}`,
      status: 'Menunggu',
      createdAt: new Date().toISOString(),
    };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEY_VISITS, JSON.stringify(list));
    return created;
  }
}

export const propertyService = new PropertyService();
