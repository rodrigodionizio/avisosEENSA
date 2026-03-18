// components/tv/TVUrgentCard.tsx
import { Aviso } from '@/types';
import { TV_CONFIG } from '@/lib/tv-config';
import { ClockIcon } from '@/components/ui/Icons';

interface TVUrgentCardProps {
  aviso: Aviso;
}

/**
 * Card de aviso urgente para modo TV
 * Layout otimizado para exibição em destaque (zona 2)
 */
export function TVUrgentCard({ aviso }: TVUrgentCardProps) {
  // Formatar data de forma simples
  const dataFormatada = new Date(aviso.criado_em).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      className="text-white rounded-xl p-5 shadow-lg h-full flex flex-col justify-between min-h-[160px]"
      style={{
        background: 'linear-gradient(135deg, #F5968F 0%, #F28C83 100%)'
      }}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide mb-2 shadow">
            🚨 Urgente
          </div>
          <h3 className="text-2xl font-bold leading-tight">
            {aviso.titulo}
          </h3>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-lg leading-snug mb-2 line-clamp-2 font-medium">
        {aviso.corpo}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 text-white/90">
        <ClockIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{dataFormatada}</span>
      </div>
    </div>
  );
}
