import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { SWRConfig } from 'swr';
import { api } from './lib/api';
import { useAuthStore } from './store/auth';
import { DashboardLayout } from './layouts/DashboardLayout';
import { CopilotPage } from './pages/CopilotPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { GroupsPage } from './pages/GroupsPage';
import { PromosPage } from './pages/PromosPage';
import { NewPromoPage } from './pages/NewPromoPage';
import { DispatchesPage } from './pages/DispatchesPage';
import { SettingsPage } from './pages/SettingsPage';

const swrFetcher = (url: string) => api.get(url);

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  return (
    <SWRConfig value={{ fetcher: swrFetcher, revalidateOnFocus: false }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/copiloto" replace />} />
          <Route element={<DashboardLayout />}>
            <Route path="/copiloto" element={<CopilotPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/whatsapp" element={<WhatsAppPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/promos" element={<PromosPage />} />
            <Route path="/promos/new" element={<NewPromoPage />} />
            <Route path="/dispatches" element={<DispatchesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </SWRConfig>
  );
}
