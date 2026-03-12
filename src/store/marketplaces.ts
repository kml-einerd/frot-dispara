import { create } from 'zustand';
import { AffiliateAccount } from '../types';
import { api } from '../lib/api';

interface MarketplacesState {
  shopeeConnected: boolean;
  mlConnected: boolean;
  accounts: AffiliateAccount[];
  loadAccounts: () => Promise<void>;
}

export const useMarketplacesStore = create<MarketplacesState>((set) => ({
  shopeeConnected: false,
  mlConnected: false,
  accounts: [],
  loadAccounts: async () => {
    try {
      const { accounts } = await api.get('/affiliate-accounts');
      set({
        accounts,
        shopeeConnected: accounts.some((a: AffiliateAccount) => a.marketplace === 'SHOPEE' && a.status === 'ACTIVE'),
        mlConnected: accounts.some((a: AffiliateAccount) => a.marketplace === 'MERCADOLIVRE' && a.status === 'ACTIVE'),
      });
    } catch (error) {
      console.error('Failed to load affiliate accounts', error);
    }
  },
}));
