import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 md:pl-64">
        <Outlet />
      </main>
    </div>
  );
}
