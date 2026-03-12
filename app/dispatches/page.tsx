'use client';

import { Header } from "@/src/components/layout/Header";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { Send, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import useSWR from "swr";
import { Dispatch, Promo } from "@/src/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DispatchesPage() {
  const { data: dispatchesData } = useSWR('/dispatches');
  const { data: promosData } = useSWR('/promos');
  
  const dispatches: Dispatch[] = dispatchesData?.data || [];
  const promos: Promo[] = promosData?.data || [];

  const statusIcons = {
    PENDING: Clock,
    PROCESSING: Loader2,
    COMPLETED: CheckCircle2,
    FAILED: AlertCircle,
  };

  const statusColors = {
    PENDING: 'secondary',
    PROCESSING: 'default',
    COMPLETED: 'success',
    FAILED: 'destructive',
  } as const;

  return (
    <div className="flex flex-col gap-6">
      <Header title="Histórico de Disparos" showNewPromo={false} />
      
      <div className="px-6">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Promoção</th>
                    <th className="px-4 py-3 font-medium">Grupos</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Enviados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {dispatches.map((dispatch) => {
                    const promo = promos.find(p => p.id === dispatch.promoId);
                    const StatusIcon = statusIcons[dispatch.status];
                    
                    return (
                      <tr key={dispatch.id} className="transition-colors hover:bg-accent/30">
                        <td className="px-4 py-4 whitespace-nowrap">
                          {format(new Date(dispatch.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded bg-muted">
                              {promo?.imageUrl && <img src={promo.imageUrl} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <span className="font-medium line-clamp-1">{promo?.productName || 'Promoção removida'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">{dispatch.totalGroups} grupos</td>
                        <td className="px-4 py-4">
                          <Badge variant={statusColors[dispatch.status]} className="gap-1">
                            <StatusIcon className={cn("h-3 w-3", dispatch.status === 'PROCESSING' && "animate-spin")} />
                            {dispatch.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all" 
                                style={{ width: `${(dispatch.sentCount / dispatch.totalGroups) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{dispatch.sentCount}/{dispatch.totalGroups}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {dispatches.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-muted-foreground">
                        Nenhum disparo realizado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
