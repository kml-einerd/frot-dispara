'use client';

import { Product, Group } from "@/src/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useState } from "react";
import useSWR from "swr";
import { Rocket, Calendar, Loader2 } from "lucide-react";
import { api } from "@/src/lib/api";
import { toast } from "../ui/use-toast";

interface QuickDispatchProps {
  product: Product;
}

export function QuickDispatch({ product }: QuickDispatchProps) {
  const { data: groupsData } = useSWR('/groups');
  const groups: Group[] = groupsData?.data || [];
  
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const toggleGroup = (id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleDispatch = async () => {
    if (selectedGroups.length === 0) {
      toast({ title: "Selecione os grupos", description: "Você precisa selecionar pelo menos um grupo para disparar.", variant: "destructive" });
      return;
    }

    setIsSending(true);
    try {
      await api.post('/dispatches', {
        promoId: product.id,
        groupIds: selectedGroups,
        scheduledAt: isScheduled ? new Date().toISOString() : null
      });
      
      toast({ title: "Sucesso! 🚀", description: isScheduled ? "Promoção agendada com sucesso." : "Disparo iniciado com sucesso." });
      setSelectedGroups([]);
    } catch (error) {
      toast({ title: "Erro no disparo", description: "Não foi possível realizar o disparo.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Disparo Rápido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Selecionar Grupos</Label>
          <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-lg border border-border/50 bg-background/50 p-2">
            {groups.map(group => (
              <div key={group.id} className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent/50">
                <Checkbox 
                  id={`group-${group.id}`} 
                  checked={selectedGroups.includes(group.id)}
                  onCheckedChange={() => toggleGroup(group.id)}
                />
                <label htmlFor={`group-${group.id}`} className="flex flex-1 cursor-pointer items-center justify-between text-sm">
                  <span>{group.name}</span>
                  <span className="text-xs text-muted-foreground">{group.memberCount} membros</span>
                </label>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Nenhum grupo ativo encontrado.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
          <div className="flex items-center gap-2">
            {isScheduled ? <Calendar className="h-4 w-4 text-primary" /> : <Rocket className="h-4 w-4 text-primary" />}
            <Label htmlFor="schedule-toggle" className="cursor-pointer text-sm">
              {isScheduled ? 'Agendar para depois' : 'Enviar agora'}
            </Label>
          </div>
          <Switch id="schedule-toggle" checked={isScheduled} onCheckedChange={setIsScheduled} />
        </div>

        {isScheduled && (
          <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
            <p>Os disparos agendados ocorrem apenas em horários comerciais (09-12h ou 14-18h BRT).</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full gap-2" 
          size="lg" 
          onClick={handleDispatch}
          disabled={isSending || selectedGroups.length === 0}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {isScheduled ? 'Agendar Disparo' : 'Disparar Agora'} 🚀
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
