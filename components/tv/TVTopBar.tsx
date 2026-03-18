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
      className="fixed top-0 left-0 right-0 text-white shadow-2xl"
      style={{ 
        zIndex: TV_CONFIG.zIndex.topBar,
        background: 'linear-gradient(to right, var(--green), var(--green-mid), var(--green))'
      }}
    >
      <div className="max-w-[2000px] mx-auto px-8 py-5 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <EensaLogo variant="alt" className="h-14 w-auto text-white" />
        </div>

        {/* Data */}
        <div className="flex-shrink-0 text-2xl font-semibold">
          {dateCapitalized}
        </div>

        {/* Relógio */}
        <div className="flex-shrink-0 text-3xl font-black tabular-nums">
          {timeFormatted}
        </div>

        {/* Indicador AO VIVO */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div 
            className="w-4 h-4 rounded-full bg-red-500"
            style={{ animation: 'blink 1.5s ease-in-out infinite' }}
          />
          <span className="text-xl font-black uppercase tracking-wider">
            Ao Vivo
          </span>
        </div>
      </div>
    </div>
  );
}
