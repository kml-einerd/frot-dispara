import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      // expõe vars NEXT_PUBLIC_ como process.env para compatibilidade
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(env.VITE_API_URL ?? env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'),
      'process.env.NEXT_PUBLIC_USE_MOCK': JSON.stringify(env.VITE_USE_MOCK ?? env.NEXT_PUBLIC_USE_MOCK ?? 'true'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      hmr: true,
    },
  };
});
