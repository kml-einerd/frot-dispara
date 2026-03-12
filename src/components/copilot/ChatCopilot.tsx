'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ImagePlus, Link2, Loader2, Bot, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';
import { Product } from '@/src/types';
import { ChatProductCard } from './ChatProductCard';
import { ChatPromoReady } from './ChatPromoReady';
import { ChatDispatchConfirm } from './ChatDispatchConfirm';

// ── tipos de mensagem / UI ──────────────────────────────────────────────────

type MessageRole = 'user' | 'assistant';

interface TextContent { type: 'text'; text: string }
interface ProductsContent { type: 'products'; products: Product[] }
interface PromoContent { type: 'promo'; product: Product; variations: Record<string, string> }
interface DispatchContent { type: 'dispatch'; product: Product; variation: string }
interface LoadingContent { type: 'loading'; text: string }

type MessageContent = TextContent | ProductsContent | PromoContent | DispatchContent | LoadingContent;

interface Message {
  id: string;
  role: MessageRole;
  content: MessageContent;
}

// ── mock de respostas da IA ─────────────────────────────────────────────────

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Tênis Nike Air Max Excee Masculino Branco',
    originalPrice: 599.90, promoPrice: 359.90, discountPercent: 40,
    imageUrl: 'https://picsum.photos/seed/nike1/400/400',
    productUrl: 'https://shopee.com.br/product/123/456',
    affiliateUrl: 'https://shope.ee/abc123', marketplace: 'SHOPEE', category: 'Calçados',
  },
  {
    id: 'p2', name: 'Tênis Adidas Ultraboost 22 Running',
    originalPrice: 799.90, promoPrice: 519.90, discountPercent: 35,
    imageUrl: 'https://picsum.photos/seed/adidas1/400/400',
    productUrl: 'https://mercadolivre.com.br/p/MLB456',
    affiliateUrl: 'https://mercadolivre.com/sec/abc456', marketplace: 'MERCADOLIVRE', category: 'Calçados',
  },
  {
    id: 'p3', name: 'Tênis Puma RS-X Bold Colorido',
    originalPrice: 499.90, promoPrice: 289.90, discountPercent: 42,
    imageUrl: 'https://picsum.photos/seed/puma1/400/400',
    productUrl: 'https://shopee.com.br/product/789/012',
    affiliateUrl: 'https://shope.ee/xyz789', marketplace: 'SHOPEE', category: 'Calçados',
  },
];

const MOCK_ELECTRONICS: Product[] = [
  {
    id: 'e1', name: 'Fone JBL Tune 510BT Bluetooth Sem Fio',
    originalPrice: 299.90, promoPrice: 169.90, discountPercent: 43,
    imageUrl: 'https://picsum.photos/seed/jbl/400/400',
    productUrl: 'https://shopee.com.br/product/fone/jbl',
    affiliateUrl: 'https://shope.ee/fone123', marketplace: 'SHOPEE', category: 'Eletrônicos',
  },
  {
    id: 'e2', name: 'Smartwatch Xiaomi Mi Band 8 GPS Monitor',
    originalPrice: 349.90, promoPrice: 199.90, discountPercent: 43,
    imageUrl: 'https://picsum.photos/seed/xiaomi/400/400',
    productUrl: 'https://mercadolivre.com.br/p/MLB789',
    affiliateUrl: 'https://mercadolivre.com/sec/watch123', marketplace: 'MERCADOLIVRE', category: 'Eletrônicos',
  },
];

function buildVariations(product: Product): Record<string, string> {
  const n = product.name;
  const d = product.discountPercent;
  const p = `R$ ${product.promoPrice.toFixed(2)}`;
  const o = `R$ ${product.originalPrice.toFixed(2)}`;
  const url = product.affiliateUrl;
  return {
    urgente: `🔥 CORRE! ${n} com ${d}% OFF!\n\nDe ${o} por apenas ${p}!\nPromoção por tempo limitado ⚡\n\n👉 ${url}`,
    casual: `Olha esse achadinho 😍\n\n${n}\n\nSó ${p} (era ${o})\n\n${url}`,
    formal: `📢 Oferta especial:\n\n${n}\nValor: ${p} | Desconto: ${d}%\n\n${url}`,
    divertido: `O estagiário ficou louco! 🤪\n\n${n} tá quase de graça!\n\nSó ${p} 💸\n\nPega logo: ${url}`,
    escassez: `⏳ ÚLTIMAS UNIDADES!\n\n${n} com ${d}% OFF.\nFinal: ${p}\n\nGaranta já: ${url}`,
  };
}

function detectIntent(input: string): 'search' | 'url' | 'image_prompt' | 'select' | 'dispatch' | 'unknown' {
  const lower = input.toLowerCase();
  if (lower.startsWith('http') || lower.includes('shopee.com') || lower.includes('mercadolivre.com')) return 'url';
  if (lower.includes('dispara') || lower.includes('envia') || lower.includes('manda') || lower.includes('grupo')) return 'dispatch';
  if (lower.includes('selec') || lower.includes('esse') || lower.includes('primeiro') || lower.includes('segundo') || lower.includes('terceiro')) return 'select';
  if (lower.length > 3) return 'search';
  return 'unknown';
}

async function simulateDelay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ── componente principal ────────────────────────────────────────────────────

export function ChatCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: {
        type: 'text',
        text: 'Olá! Sou o copiloto do Dispara 🚀\n\nMe diga o que quer divulgar:\n• Digite o nome do produto (ex: "tênis nike")\n• Cole um link do Shopee ou Mercado Livre\n• Envie uma foto do produto 📸',
      },
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = useCallback((msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: crypto.randomUUID() }]);
  }, []);

  const replaceLastAssistant = useCallback((content: MessageContent) => {
    setMessages(prev => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i]!.role === 'assistant') {
          copy[i] = { ...copy[i]!, content };
          return copy;
        }
      }
      return copy;
    });
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isTyping) return;
    setInput('');

    addMessage({ role: 'user', content: { type: 'text', text: value } });
    setIsTyping(true);

    const intent = detectIntent(value);

    // Loading bubble
    addMessage({ role: 'assistant', content: { type: 'loading', text: 'Buscando produtos...' } });
    await simulateDelay(1200);

    if (intent === 'url') {
      const isShopee = value.includes('shopee');
      const product: Product = {
        id: 'url_p1',
        name: isShopee ? 'Produto Shopee — Link colado' : 'Produto Mercado Livre — Link colado',
        originalPrice: 399.90,
        promoPrice: 229.90,
        discountPercent: 43,
        imageUrl: `https://picsum.photos/seed/${isShopee ? 'shopee_url' : 'ml_url'}/400/400`,
        productUrl: value,
        affiliateUrl: isShopee ? `https://shope.ee/link${Date.now()}` : `https://mercadolivre.com/sec/link${Date.now()}`,
        marketplace: isShopee ? 'SHOPEE' : 'MERCADOLIVRE',
      };
      setPendingProducts([product]);
      replaceLastAssistant({
        type: 'products',
        products: [product],
      });
      addMessage({ role: 'assistant', content: { type: 'text', text: 'Encontrei o produto! Clique nele para gerar o anúncio 👆' } });
    } else if (intent === 'search') {
      const lower = value.toLowerCase();
      const products = lower.includes('fone') || lower.includes('smart') || lower.includes('elet')
        ? MOCK_ELECTRONICS
        : MOCK_PRODUCTS;
      setPendingProducts(products);
      replaceLastAssistant({ type: 'products', products });
      addMessage({ role: 'assistant', content: { type: 'text', text: `Encontrei ${products.length} produtos! Clique no que quiser para gerar o anúncio 👆` } });
    } else if (intent === 'dispatch' && selectedProduct) {
      replaceLastAssistant({ type: 'loading', text: 'Preparando disparo...' });
      await simulateDelay(800);
      const variations = buildVariations(selectedProduct);
      replaceLastAssistant({ type: 'dispatch', product: selectedProduct, variation: variations.urgente! });
    } else {
      replaceLastAssistant({ type: 'text', text: 'Não entendi 😅 Tente digitar o nome de um produto, colar um link ou enviar uma foto!' });
    }

    setIsTyping(false);
  }, [input, isTyping, addMessage, replaceLastAssistant, selectedProduct]);

  const handleProductSelect = useCallback(async (product: Product) => {
    setSelectedProduct(product);
    setIsTyping(true);
    addMessage({ role: 'user', content: { type: 'text', text: `Selecionei: ${product.name}` } });
    addMessage({ role: 'assistant', content: { type: 'loading', text: 'Gerando anúncios com IA...' } });
    await simulateDelay(1400);
    const variations = buildVariations(product);
    replaceLastAssistant({ type: 'promo', product, variations });
    addMessage({ role: 'assistant', content: { type: 'text', text: 'Escolha o tom do anúncio e edite se quiser. Quando pronto, clique em **Disparar** 🚀' } });
    setIsTyping(false);
  }, [addMessage, replaceLastAssistant]);

  const handleDispatch = useCallback(async (variation: string) => {
    if (!selectedProduct) return;
    setIsTyping(true);
    addMessage({ role: 'user', content: { type: 'text', text: 'Quero disparar para os grupos!' } });
    addMessage({ role: 'assistant', content: { type: 'loading', text: 'Carregando seus grupos...' } });
    await simulateDelay(900);
    replaceLastAssistant({ type: 'dispatch', product: selectedProduct, variation });
    setIsTyping(false);
  }, [selectedProduct, addMessage, replaceLastAssistant]);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsTyping(true);
    const objectUrl = URL.createObjectURL(file);
    addMessage({
      role: 'user',
      content: { type: 'text', text: `📷 [Foto enviada: ${file.name}]` },
    });
    addMessage({ role: 'assistant', content: { type: 'loading', text: 'Analisando imagem com IA...' } });
    await simulateDelay(1800);
    const products = MOCK_PRODUCTS;
    setPendingProducts(products);
    replaceLastAssistant({ type: 'products', products });
    addMessage({ role: 'assistant', content: { type: 'text', text: 'Identificado! Esses são os produtos mais parecidos. Escolha um para gerar o anúncio 👆' } });
    URL.revokeObjectURL(objectUrl);
    setIsTyping(false);
  }, [addMessage, replaceLastAssistant]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onProductSelect={handleProductSelect}
            onDispatch={handleDispatch}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {['tênis nike', 'fone bluetooth', 'smartwatch', 'https://shopee.com.br/...'].map(s => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-border/50 bg-card/80 px-4 py-3 backdrop-blur">
        <div className="flex items-end gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2 focus-within:border-primary/60 transition-colors">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite o produto, cole um link ou envie uma foto..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 max-h-32 min-h-[24px]"
            style={{ height: 'auto' }}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 128) + 'px';
            }}
          />
          <div className="flex items-center gap-1 pb-0.5">
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Enviar foto"
            >
              <ImagePlus className="h-4 w-4" />
            </button>
            <Button
              size="sm"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="h-8 w-8 p-0 rounded-lg"
            >
              {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
}

// ── renderiza cada mensagem ─────────────────────────────────────────────────

function ChatMessage({
  message,
  onProductSelect,
  onDispatch,
}: {
  message: Message;
  onProductSelect: (p: Product) => void;
  onDispatch: (variation: string) => void;
}) {
  const isUser = message.role === 'user';
  const { content } = message;

  if (content.type === 'loading') {
    return (
      <div className="flex items-start gap-3">
        <BotAvatar />
        <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {content.text}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {content.type === 'text' && content.text}
        </div>
      </div>
    );
  }

  // assistant
  if (content.type === 'text') {
    return (
      <div className="flex items-start gap-3">
        <BotAvatar />
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
          {content.text}
        </div>
      </div>
    );
  }

  if (content.type === 'products') {
    return (
      <div className="flex items-start gap-3">
        <BotAvatar />
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {content.products.map(p => (
              <ChatProductCard key={p.id} product={p} onSelect={onProductSelect} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (content.type === 'promo') {
    return (
      <div className="flex items-start gap-3">
        <BotAvatar />
        <div className="flex-1 min-w-0">
          <ChatPromoReady product={content.product} variations={content.variations} onDispatch={onDispatch} />
        </div>
      </div>
    );
  }

  if (content.type === 'dispatch') {
    return (
      <div className="flex items-start gap-3">
        <BotAvatar />
        <div className="flex-1 min-w-0">
          <ChatDispatchConfirm product={content.product} variation={content.variation} />
        </div>
      </div>
    );
  }

  return null;
}

function BotAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/30">
      <Sparkles className="h-4 w-4 text-primary" />
    </div>
  );
}
