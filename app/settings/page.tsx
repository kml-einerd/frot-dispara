'use client';

import { Header } from "@/src/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { ShoppingBag, MessageSquare, ExternalLink, CheckCircle2, User } from "lucide-react";
import { useMarketplacesStore } from "@/src/store/marketplaces";
import { useEffect } from "react";
import { api } from "@/src/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/src/components/ui/use-toast";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { accounts, loadAccounts } = useMarketplacesStore();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Usuário Dispara",
      email: "contato@dispara.com.br",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleConnect = async (marketplace: 'shopee' | 'mercadolivre') => {
    try {
      const { url } = await api.get(`/v1/oauth/${marketplace}/connect`);
      window.location.href = url;
    } catch (error) {
      console.error(`Failed to connect to ${marketplace}`, error);
    }
  };

  const shopeeAccount = accounts.find(a => a.marketplace === 'SHOPEE');
  const mlAccount = accounts.find(a => a.marketplace === 'MERCADOLIVRE');

  return (
    <div className="flex flex-col gap-6">
      <Header title="Configurações" showNewPromo={false} />
      
      <div className="grid gap-6 px-6 lg:grid-cols-2">
        {/* Perfil */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Seu Perfil</h2>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <Button type="submit">Salvar Alterações</Button>
              </form>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <div className="flex items-center gap-2 pt-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">WhatsApp</h2>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Gestão de Sessões</CardTitle>
              <CardDescription>Gerencie seus números conectados e o aquecimento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Para gerenciar suas sessões do WhatsApp, ver o status de saúde e sincronizar novos grupos, acesse a página dedicada.
              </p>
              <Link href="/whatsapp">
                <Button variant="outline" className="mt-4 w-full gap-2">
                  Ir para WhatsApp <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Marketplaces */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Marketplaces</h2>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">Shopee</CardTitle>
                <CardDescription>Programa de Afiliados Shopee</CardDescription>
              </div>
              {shopeeAccount ? (
                <Badge variant="success">CONECTADO</Badge>
              ) : (
                <Badge variant="secondary">DESCONECTADO</Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {shopeeAccount ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-secondary/30 p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conta:</span>
                      <span className="font-medium">{shopeeAccount.label}</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-muted-foreground">Última sincronização:</span>
                      <span className="font-medium">
                        {shopeeAccount.lastSyncAt ? format(new Date(shopeeAccount.lastSyncAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 'Nunca'}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">Desconectar</Button>
                </div>
              ) : (
                <Button className="w-full gap-2" onClick={() => handleConnect('shopee')}>
                  Conectar Shopee <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">Mercado Livre</CardTitle>
                <CardDescription>Programa de Afiliados Mercado Livre</CardDescription>
              </div>
              {mlAccount ? (
                <Badge variant="success">CONECTADO</Badge>
              ) : (
                <Badge variant="secondary">DESCONECTADO</Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {mlAccount ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-secondary/30 p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conta:</span>
                      <span className="font-medium">{mlAccount.label}</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-muted-foreground">Última sincronização:</span>
                      <span className="font-medium">
                        {mlAccount.lastSyncAt ? format(new Date(mlAccount.lastSyncAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 'Nunca'}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">Desconectar</Button>
                </div>
              ) : (
                <Button className="w-full gap-2" onClick={() => handleConnect('mercadolivre')}>
                  Conectar Mercado Livre <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
