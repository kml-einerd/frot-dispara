'use client';

import { SWRConfig } from 'swr';
import { Toaster } from '@/src/components/ui/toaster';
import { api } from '@/src/lib/api';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => api.get(url),
        revalidateOnFocus: false,
      }}
    >
      {children}
      <Toaster />
    </SWRConfig>
  );
}
