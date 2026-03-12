import { create } from 'zustand';

interface AuthState {
  user: any | null;
  tenantId: string | null;
  token: string | null;
  setAuth: (user: any, tenantId: string, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tenantId: null,
  token: null,
  setAuth: (user, tenantId, token) => set({ user, tenantId, token }),
  clearAuth: () => set({ user: null, tenantId: null, token: null }),
}));
