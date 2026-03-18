// components/layout/Clock.tsx
'use client';
import { useClock } from '@/hooks/useClock';

export function Clock() {
  const now = useClock();

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const timeString = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = now.toLocaleDateString('pt-BR', dateOptions);

  return (
    <div className="bg-eensa-green text-white/95 px-7 py-[10px] flex justify-between items-center font-display text-sm font-semibold shadow-[0_2px_12px_rgba(26,107,46,0.2)]">
      <div className="capitalize">{dateString}</div>
      <div className="text-[19px] font-black tracking-wide">{timeString}</div>
    </div>
  );
}
