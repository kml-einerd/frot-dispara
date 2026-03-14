import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { useOnboardingStore } from '../store/onboarding';
import useSWR from 'swr';
import type { WaSession } from '../types';

export function DashboardLayout() {
  const { isOpen, open, isComplete } = useOnboardingStore();
  const { data, isLoading } = useSWR('/wa/sessions');
  const sessions: WaSession[] = data?.sessions || [];
  const hasConnected = sessions.some((s) => s.status === 'CONNECTED');

  useEffect(() => {
    if (!isLoading && !hasConnected && !isComplete() && !isOpen) {
      open();
    }
  }, [isLoading, hasConnected, isOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 md:pl-64">
        <Outlet />
      </main>
      <OnboardingWizard />
    </div>
  );
}
