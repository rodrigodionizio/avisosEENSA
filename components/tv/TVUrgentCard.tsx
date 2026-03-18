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
    <div className="bg-gradient-to-br from-red to-red-500 text-white rounded-2xl p-8 shadow-2xl h-full flex flex-col justify-between">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-wide mb-3">
            Urgente
          </div>
          <h3 className={`${TV_CONFIG.typography.urgents.title} leading-tight`}>
            {aviso.titulo}
          </h3>
        </div>
      </div>

      {/* Descrição */}
      <p className={`${TV_CONFIG.typography.urgents.description} leading-relaxed mb-4 line-clamp-4`}>
        {aviso.corpo}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 text-white/80">
        <ClockIcon className="w-5 h-5" />
        <span className="text-base font-medium">{dataFormatada}</span>
      </div>
    </div>
  );
}
