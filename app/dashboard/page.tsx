'use client';

import { Header } from "@/src/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tag, MessageSquare, Users, MousePointer2 } from "lucide-react";
import useSWR from "swr";
import { Promo } from "@/src/types";
import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const stats = [
  { label: 'Promos este mês', value: '24', icon: Tag, color: 'text-violet-500' },
  { label: 'Mensagens hoje', value: '1.2k', icon: MessageSquare, color: 'text-emerald-500' },
  { label: 'Grupos ativos', value: '12', icon: Users, color: 'text-blue-500' },
  { label: 'Taxa de clique', value: '18%', icon: MousePointer2, color: 'text-orange-500' },
];

export default function DashboardPage() {
  const { data: promosData } = useSWR('/promos');
  const promos: Promo[] = promosData?.data || [];

  return (
    <div className="flex flex-col gap-6">
      <Header title="Overview" />
      
      <div className="grid gap-4 px-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="px-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Últimas Promoções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promos.slice(0, 5).map((promo) => (
                <div key={promo.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                      {promo.imageUrl && (
                        <img src={promo.imageUrl} alt={promo.productName} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{promo.productName}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(promo.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-500">R$ {promo.promoPrice.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground line-through">R$ {promo.originalPrice.toFixed(2)}</div>
                    </div>
                    <Badge variant={promo.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {promo.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {promos.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  Nenhuma promoção criada ainda.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
