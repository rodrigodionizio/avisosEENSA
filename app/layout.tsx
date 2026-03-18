// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EENSA — Quadro de Avisos',
  description: 'Quadro de avisos digital da Escola Estadual Nilo Santos de Araújo',
  manifest: '/manifest.json',
  appleWebApp: { 
    capable: true, 
    statusBarStyle: 'default', 
    title: 'EENSA Avisos' 
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A6B2E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
