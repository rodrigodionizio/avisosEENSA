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
      className="text-white rounded-3xl p-10 shadow-2xl h-full flex flex-col justify-between min-h-[280px]"
      style={{
        background: 'linear-gradient(135deg, var(--red) 0%, #C84525 100%)'
      }}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="inline-block px-5 py-2 bg-white/25 backdrop-blur-sm rounded-full text-base font-black uppercase tracking-wider mb-4 shadow-lg">
            🚨 Urgente
          </div>
          <h3 className="text-4xl font-black leading-tight">
            {aviso.titulo}
          </h3>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-2xl leading-relaxed mb-4 line-clamp-3 font-medium">
        {aviso.corpo}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 text-white/90">
        <ClockIcon className="w-6 h-6" />
        <span className="text-lg font-semibold">{dataFormatada}</span>
      </div>
    </div>
  );
}
