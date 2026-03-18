// components/ui/Badge.tsx
import type { Prioridade } from '@/types';
import { Icons } from './Icons';

interface BadgeProps {
  prioridade: Prioridade;
}

export function Badge({ prioridade }: BadgeProps) {
  const styles = {
    urgente: 'bg-eensa-orange-lt text-[#A04010] border-eensa-orange-border',
    normal: 'bg-eensa-teal-lt text-[#1A7A95] border-eensa-teal-border',
    info: 'bg-eensa-yellow-lt text-[#8A6A00] border-eensa-yellow-border',
  };

  const icons = {
    urgente: <Icons.Urgent size={14} />,
    normal: <Icons.Normal size={14} />,
    info: <Icons.Info size={14} />,
  };

  const labels = {
    urgente: 'Urgente',
    normal: 'Normal',
    info: 'Informativo',
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 font-display font-bold text-[11px] px-[9px] py-[3px] rounded-full border ${styles[prioridade]}`}
      style={{ letterSpacing: '0.2px' }}
    >
      {icons[prioridade]} {labels[prioridade]}
    </span>
  );
}

interface ChipProps {
  children: React.ReactNode;
}

export function Chip({ children }: ChipProps) {
  return (
    <span className="inline-block bg-eensa-surface2 text-eensa-text2 rounded-full px-[9px] py-[2px] text-[11px] font-semibold border border-eensa-border font-display">
      {children}
    </span>
  );
}
