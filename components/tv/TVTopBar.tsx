// components/tv/TVTopBar.tsx
'use client';
import { useClock } from '@/hooks/useClock';
import { TV_CONFIG } from '@/lib/tv-config';
import { EensaLogo } from '@/components/ui/Logo';

/**
 * Barra superior do modo TV
 * Zona 1: Logo, Data, Relógio, Indicador "AO VIVO"
 * Z-index: 100 (mais alto de toda a página)
 */
export function TVTopBar() {
  const now = useClock();

  // Formatação de data por extenso
  const dateFormatted = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Capitalizar primeira letra
  const dateCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  // Formatação de hora
  const timeFormatted = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green via-green-mid to-green text-white shadow-lg"
      style={{ zIndex: TV_CONFIG.zIndex.topBar }}
    >
      <div className="max-w-[2000px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <EensaLogo variant="alt" className="h-12 w-auto text-white" />
        </div>

        {/* Data */}
        <div className={`flex-shrink-0 ${TV_CONFIG.typography.topBar.date} font-medium`}>
          {dateCapitalized}
        </div>

        {/* Relógio */}
        <div className={`flex-shrink-0 ${TV_CONFIG.typography.topBar.clock} font-bold tabular-nums`}>
          {timeFormatted}
        </div>

        {/* Indicador AO VIVO */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div 
            className="w-3 h-3 rounded-full bg-red-500"
            style={{ animation: 'blink 1.5s ease-in-out infinite' }}
          />
          <span className={`${TV_CONFIG.typography.topBar.date} font-bold uppercase tracking-wide`}>
            Ao Vivo
          </span>
        </div>
      </div>
    </div>
  );
}
