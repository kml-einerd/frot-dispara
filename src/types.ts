export interface WaSession {
  id: string;
  name: string;
  phoneNumber: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'BANNED' | 'WARMING_UP';
  healthScore: number;
  warmupDay: number;
  dailyMsgCount: number;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  externalId: string;
  memberCount: number;
  sessionId: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  promoPrice: number;
  discountPercent: number;
  imageUrl: string;
  productUrl: string;
  affiliateUrl: string;
  marketplace: 'SHOPEE' | 'MERCADOLIVRE';
  category?: string;
}

export interface Promo {
  id: string;
  productName: string;
  marketplace: string;
  originalPrice: number;
  promoPrice: number;
  discountPercent: number;
  imageUrl: string | null;
  affiliateUrl: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  variations: CopyVariation[];
  createdAt: string;
}

export interface CopyVariation {
  id: string;
  label: string;
  copyText: string;
  isDefault: boolean;
}

export interface Dispatch {
  id: string;
  promoId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalGroups: number;
  sentCount: number;
  createdAt: string;
}

export interface AffiliateAccount {
  id: string;
  marketplace: 'SHOPEE' | 'MERCADOLIVRE';
  label: string;
  status: 'ACTIVE' | 'EXPIRED';
  lastSyncAt: string | null;
}
