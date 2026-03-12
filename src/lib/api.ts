import { useAuthStore } from '../store/auth';
import { mockSessions, mockGroups, mockProducts, mockPromos, mockDispatches, mockAffiliateAccounts } from './api-mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

async function fetcher(url: string, options: RequestInit = {}) {
  const { token, tenantId } = useAuthStore.getState();

  if (USE_MOCK) {
    console.log(`[MOCK API] ${options.method || 'GET'} ${url}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    if (url.includes('/wa/sessions')) {
      if (url.endsWith('/qr')) return { qr: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', status: 'PENDING' };
      if (url.endsWith('/health')) return { healthScore: 85, warmupDay: 10, dailyMsgCount: 50 };
      return { sessions: mockSessions };
    }
    if (url.includes('/groups')) return { data: mockGroups, pagination: { total: 3 } };
    if (url.includes('/promos')) {
      if (url.includes('/search-by-image')) return { products: mockProducts };
      return { data: mockPromos, pagination: { total: 1 } };
    }
    if (url.includes('/dispatches')) return { data: mockDispatches, pagination: { total: 2 } };
    if (url.includes('/affiliate-accounts')) return { accounts: mockAffiliateAccounts };
    if (url.includes('/oauth')) return { url: 'https://example.com/oauth' };

    return {};
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

export const api = {
  get: (url: string) => fetcher(url),
  post: (url: string, data?: any) => fetcher(url, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
  }),
  delete: (url: string) => fetcher(url, { method: 'DELETE' }),
};
