'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface HeaderProps {
  title: string;
  showNewPromo?: boolean;
}

export function Header({ title, showNewPromo = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-background/50 px-6 py-4 backdrop-blur-md">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      
      {showNewPromo && (
        <Link href="/promos/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Promo
          </Button>
        </Link>
      )}
    </header>
  );
}
