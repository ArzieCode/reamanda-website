// ============================================================
// Types — CMS & Site Content
// ============================================================

export interface ContentVersion {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
  updatedBy: string; // user name
}

export interface SiteContent {
  key: string;
  value: string;
  updatedAt: string;
  updatedBy: string;
  versions: ContentVersion[];
}

export interface ImageAsset {
  id: string;
  name: string;
  blobKey?: string; // idb storage key
  dataUrl?: string; // fallback or memory data URL
  url?: string;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
  focalPoint: { x: number; y: number }; // 0-100%
  altText: string;
  createdAt: string;
}

export interface SectionEntity {
  id: string;
  type:
    | 'hero_slide'
    | 'landing_tile'
    | 'category'
    | 'collection'
    | 'testimonial'
    | 'faq'
    | 'announcement'
    | 'footer_link'
    | 'static_block';
  title: string;
  subtitle?: string;
  content?: string;
  link?: string;
  imageId?: string;
  imageUrl?: string;
  sortOrder: number;
  isVisible: boolean;
  metadata?: Record<string, any>;
  updatedAt: string;
}

export interface GeneralSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  whatsappNumber: string; // format: 628...
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  youtube: string;
  bankAccountText: string;
  shippingPricesText: string;
  businessHours: string;
  lowStockThreshold: number; // default 5
  accentColor: string; // one of --charcoal, --caramel-deep, --indigo, --status-available, --sand
  seoHomeTitle: string;
  seoHomeDesc: string;
  seoBusanaTitle: string;
  seoBusanaDesc: string;
  seoKostTitle: string;
  seoKostDesc: string;
  seoKateringTitle: string;
  companyEmail?: string;
  officeAddress?: string;
  announcement?: string;
  seoKateringDesc: string;
}
