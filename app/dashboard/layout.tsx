import { Sidebar } from "@/src/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 md:pl-64">
        {children}
      </main>
    </div>
  );
}
