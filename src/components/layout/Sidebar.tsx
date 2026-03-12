'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Tag, 
  Send, 
  Settings, 
  LogOut,
  Rocket
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuthStore } from '@/src/store/auth';
import { signOut } from 'next-auth/react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'WhatsApp', icon: MessageSquare, href: '/whatsapp' },
  { label: 'Grupos', icon: Users, href: '/groups' },
  { label: 'Promoções', icon: Tag, href: '/promos' },
  { label: 'Disparos', icon: Send, href: '/dispatches' },
  { label: 'Configurações', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="fixed bottom-0 left-0 z-40 h-16 w-full border-t bg-card md:h-screen md:w-64 md:border-r md:border-t-0">
      <div className="flex h-full flex-row items-center justify-around md:flex-col md:items-stretch md:justify-start md:p-4">
        <div className="hidden items-center gap-2 px-2 py-4 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Dispara</span>
        </div>

        <nav className="flex flex-row gap-1 md:mt-8 md:flex-col">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:flex-row md:gap-3 md:text-sm",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden flex-col gap-4 md:flex">
          <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{user?.name || 'Usuário'}</span>
              <span className="truncate text-xs text-muted-foreground">{user?.email || 'user@example.com'}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}
