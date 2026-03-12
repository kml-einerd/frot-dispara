import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Tag,
  Send,
  Settings,
  LogOut,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuthStore } from '@/src/store/auth';

const navItems = [
  { label: 'Copiloto',      icon: Sparkles,        href: '/copiloto' },
  { label: 'Dashboard',     icon: LayoutDashboard, href: '/dashboard' },
  { label: 'WhatsApp',      icon: MessageSquare,   href: '/whatsapp' },
  { label: 'Grupos',        icon: Users,           href: '/groups' },
  { label: 'Promoções',     icon: Tag,             href: '/promos' },
  { label: 'Disparos',      icon: Send,            href: '/dispatches' },
  { label: 'Configurações', icon: Settings,        href: '/settings' },
];

export function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <aside className="fixed bottom-0 left-0 z-40 h-16 w-full border-t border-border/50 bg-card md:h-screen md:w-64 md:border-r md:border-t-0">
      <div className="flex h-full flex-row items-center justify-around md:flex-col md:items-stretch md:justify-start md:p-4">

        {/* logo */}
        <div className="hidden items-center gap-2 px-2 py-4 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Dispara</span>
        </div>

        {/* nav */}
        <nav className="flex flex-row gap-1 md:mt-6 md:flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:flex-row md:gap-3 md:text-sm',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden md:inline">{item.label}</span>
              <span className="md:hidden text-[9px]">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>

        {/* user */}
        <div className="mt-auto hidden flex-col gap-4 md:flex">
          <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback>{user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{user?.name ?? 'Usuário'}</span>
              <span className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>

      </div>
    </aside>
  );
}
