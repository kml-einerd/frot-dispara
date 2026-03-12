'use client';

import { Product } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface PromoEditorProps {
  product: Product;
}

const variations = [
  { id: 'urgente', label: 'Urgente', template: '🔥 OFERTA RELÂMPAGO! {name} com {discount}% OFF! Corra antes que acabe!\n\nDe R$ {original} por apenas R$ {promo}\n\nConfira aqui: {url}' },
  { id: 'casual', label: 'Casual', template: 'Olha esse achadinho! 😍\n\n{name}\n\nPor apenas R$ {promo} (era R$ {original})\n\nLink do produto: {url}' },
  { id: 'formal', label: 'Formal', template: 'Oportunidade de aquisição: {name}.\n\nValor promocional: R$ {promo}\nDesconto aplicado: {discount}%\n\nAcesse o link oficial: {url}' },
  { id: 'divertido', label: 'Divertido', template: 'O estagiário ficou louco! 🤪\n\n{name} tá quase de graça!\n\nSó R$ {promo} 💸\n\nPega logo: {url}' },
  { id: 'escassez', label: 'Escassez', template: 'ÚLTIMAS UNIDADES! 😱\n\n{name} com {discount}% de desconto.\n\nPreço final: R$ {promo}\n\nGaranta o seu: {url}' },
];

export function PromoEditor({ product }: PromoEditorProps) {
  const [copies, setCopies] = useState<Record<string, string>>({});

  useEffect(() => {
    const newCopies: Record<string, string> = {};
    variations.forEach(v => {
      newCopies[v.id] = v.template
        .replace('{name}', product.name)
        .replace('{discount}', product.discountPercent.toString())
        .replace('{original}', product.originalPrice.toFixed(2))
        .replace('{promo}', product.promoPrice.toFixed(2))
        .replace('{url}', product.affiliateUrl);
    });
    setCopies(newCopies);
  }, [product]);

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Editor de Promoção</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg bg-secondary/30 p-3">
          <img src={product.imageUrl} alt="" className="h-16 w-16 rounded-md object-cover" />
          <div className="flex flex-col">
            <span className="line-clamp-1 text-sm font-medium">{product.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-500">R$ {product.promoPrice.toFixed(2)}</span>
              <Badge variant="success" className="h-5 text-[10px]">Link inserido automaticamente ✓</Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="urgente" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            {variations.map(v => (
              <TabsTrigger key={v.id} value={v.id} className="text-[10px] md:text-xs">
                {v.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {variations.map(v => (
            <TabsContent key={v.id} value={v.id} className="mt-4">
              <textarea
                className="min-h-[150px] w-full rounded-lg border border-border/50 bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={copies[v.id] || ''}
                onChange={(e) => setCopies({ ...copies, [v.id]: e.target.value })}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
