import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/src/index.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dispara - Seu copiloto de promoções",
  description: "Ferramenta de copiloto de promoções que dispara produtos via WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
