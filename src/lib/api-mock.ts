import { WaSession, Group, Product, Promo, Dispatch, AffiliateAccount } from '../types';

export const mockSessions: WaSession[] = [
  {
    id: '1',
    name: 'Vendas 01',
    phoneNumber: '5511999999999',
    status: 'CONNECTED',
    healthScore: 95,
    warmupDay: 15,
    dailyMsgCount: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Promoções 02',
    phoneNumber: '5511888888888',
    status: 'DISCONNECTED',
    healthScore: 40,
    warmupDay: 2,
    dailyMsgCount: 10,
    createdAt: new Date().toISOString(),
  },
];

export const mockGroups: Group[] = [
  { id: '1', name: 'Ofertas Relâmpago', externalId: 'group1@g.us', memberCount: 250, sessionId: '1', isActive: true },
  { id: '2', name: 'Cupons Shopee', externalId: 'group2@g.us', memberCount: 180, sessionId: '1', isActive: true },
  { id: '3', name: 'Achadinhos ML', externalId: 'group3@g.us', memberCount: 420, sessionId: '1', isActive: false },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Tênis Nike Air Max Excee Masculino',
    originalPrice: 599.90,
    promoPrice: 359.90,
    discountPercent: 40,
    imageUrl: 'https://picsum.photos/seed/nike/400/400',
    productUrl: 'https://shopee.com.br/product/123/456',
    affiliateUrl: 'https://shope.ee/abc123',
    marketplace: 'SHOPEE',
  },
  {
    id: 'p2',
    name: 'Smartphone Samsung Galaxy S23 256GB',
    originalPrice: 4500.00,
    promoPrice: 3200.00,
    discountPercent: 28,
    imageUrl: 'https://picsum.photos/seed/samsung/400/400',
    productUrl: 'https://mercadolivre.com.br/p/MLB123',
    affiliateUrl: 'https://mercadolivre.com/sec/abc456',
    marketplace: 'MERCADOLIVRE',
  },
];

export const mockPromos: Promo[] = [
  {
    id: 'pr1',
    productName: 'Tênis Nike Air Max Excee',
    marketplace: 'SHOPEE',
    originalPrice: 599.90,
    promoPrice: 359.90,
    discountPercent: 40,
    imageUrl: 'https://picsum.photos/seed/nike/400/400',
    affiliateUrl: 'https://shope.ee/abc123',
    status: 'ACTIVE',
    variations: [
      { id: 'v1', label: 'Urgente', copyText: '🔥 OFERTA RELÂMPAGO! Tênis Nike Air Max com 40% OFF! Corra antes que acabe!\n\nConfira aqui: https://shope.ee/abc123', isDefault: true },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const mockDispatches: Dispatch[] = [
  { id: 'd1', promoId: 'pr1', status: 'COMPLETED', totalGroups: 5, sentCount: 5, createdAt: new Date().toISOString() },
  { id: 'd2', promoId: 'pr1', status: 'PENDING', totalGroups: 3, sentCount: 0, createdAt: new Date().toISOString() },
];

export const mockAffiliateAccounts: AffiliateAccount[] = [
  { id: 'a1', marketplace: 'SHOPEE', label: 'Minha Loja Shopee', status: 'ACTIVE', lastSyncAt: new Date().toISOString() },
  { id: 'a2', marketplace: 'MERCADOLIVRE', label: 'ML Oficial', status: 'ACTIVE', lastSyncAt: new Date().toISOString() },
];
