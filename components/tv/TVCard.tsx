// components/tv/TVCard.tsx
import { Aviso } from '@/types';
import { TV_CONFIG } from '@/lib/tv-config';
import { ClockIcon, UserIcon } from '@/components/ui/Icons';

interface TVCardProps {
  aviso: Aviso;
}

/**
 * Card de aviso normal para modo TV
 * Otimizado para leitura a distância (fontes grandes)
 * Usado na zona de scroll infinito
 */
export function TVCard({ aviso }: TVCardProps) {
  // Formatar data de forma simples
  const dataFormatada = new Date(aviso.criado_em).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Cores baseadas na prioridade
  const priorityStyles = {
    urgente: 'border-red bg-red-lt',
    normal: 'border-teal bg-teal-lt',
    info: 'border-yellow bg-yellow-lt',
  };

  const priorityLabels = {
    urgente: 'Urgente',
    normal: 'Normal',
    info: 'Info',
  };

  const priorityColors = {
    urgente: 'text-red',
    normal: 'text-teal',
    info: 'text-yellow-700',
  };

  return (
    <div 
      className={`rounded-2xl border-l-8 ${priorityStyles[aviso.prioridade]} p-8 shadow-md transition-all hover:shadow-lg`}
      style={{ zIndex: TV_CONFIG.zIndex.cards }}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className={`${TV_CONFIG.typography.cards.title} leading-tight flex-1`}>
          {aviso.titulo}
        </h3>
        <span 
          className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${priorityColors[aviso.prioridade]} bg-white/80`}
        >
          {priorityLabels[aviso.prioridade]}
        </span>
      </div>

      {/* Descrição */}
      <p className={`${TV_CONFIG.typography.cards.description} text-text2 leading-relaxed mb-6`}>
        {aviso.corpo}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-6 text-text3">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5" />
          <span className={TV_CONFIG.typography.cards.meta}>{dataFormatada}</span>
        </div>
        {aviso.autor && (
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            <span className={TV_CONFIG.typography.cards.meta}>{aviso.autor}</span>
          </div>
        )}
      </div>
    </div>
  );
}
