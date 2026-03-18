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

  // Cores baseadas na prioridade (usando CSS variables do globals.css)
  const priorityStyles = {
    urgente: { border: 'var(--red)', bg: 'var(--red-lt)' },
    normal: { border: 'var(--teal)', bg: 'var(--teal-lt)' },
    info: { border: 'var(--orange)', bg: 'var(--orange-lt)' },
  };

  const priorityLabels = {
    urgente: 'Urgente',
    normal: 'Normal',
    info: 'Info',
  };

  const priorityColors = {
    urgente: { text: 'var(--red)', bg: 'var(--red-lt)' },
    normal: { text: 'var(--teal)', bg: 'var(--teal-lt)' },
    info: { text: 'var(--orange)', bg: 'var(--orange-lt)' },
  };

  return (
    <div 
      className="rounded-2xl p-8 shadow-lg transition-all hover:shadow-xl"
      style={{ 
        zIndex: TV_CONFIG.zIndex.cards,
        borderLeft: `8px solid ${priorityStyles[aviso.prioridade].border}`,
        backgroundColor: priorityStyles[aviso.prioridade].bg
      }}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-2xl font-bold leading-tight flex-1" style={{ color: 'var(--text)' }}>
          {aviso.titulo}
        </h3>
        <span 
          className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap shadow-md"
          style={{ 
            color: priorityColors[aviso.prioridade].text,
            backgroundColor: 'rgba(255,255,255,0.9)'
          }}
        >
          {priorityLabels[aviso.prioridade]}
        </span>
      </div>

      {/* Descrição */}
      <p className="text-lg leading-relaxed mb-5 font-medium" style={{ color: 'var(--text2)' }}>
        {aviso.corpo}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-6" style={{ color: 'var(--text3)' }}>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5" />
          <span className="text-base font-semibold">{dataFormatada}</span>
        </div>
        {aviso.autor && (
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            <span className="text-base font-semibold">{aviso.autor}</span>
          </div>
        )}
      </div>
    </div>
  );
}
