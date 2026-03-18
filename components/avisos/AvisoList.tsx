// components/avisos/AvisoList.tsx
import type { Aviso } from '@/types';
import { AvisoCard } from './AvisoCard';
import { Icons } from '@/components/ui/Icons';

interface AvisoListProps {
  avisos: Aviso[];
  isAdmin?: boolean;
  onEdit?: (aviso: Aviso) => void;
  onDelete?: (id: number) => void;
  urgentes: Aviso[];
  normais: Aviso[];
  infos: Aviso[];
}

export function AvisoList({ urgentes, normais, infos, isAdmin, onEdit, onDelete }: AvisoListProps) {
  const renderSection = (
    title: string,
    icon: React.ReactNode,
    avisos: Aviso[],
    delay: number = 0
  ) => {
    if (avisos.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-4 mt-2">
          <span className="font-display font-extrabold text-xs text-eensa-text3 uppercase tracking-wide whitespace-nowrap flex items-center gap-1.5">
            {icon} {title}
          </span>
          <div 
            className="flex-1 h-[1.5px] rounded-sm"
            style={{
              background: 'linear-gradient(90deg, var(--border) 0%, transparent 100%)',
            }}
          />
          <span className="font-display font-bold text-[11px] text-eensa-text3 bg-eensa-surface2 rounded-[10px] px-[7px] py-[2px] border border-eensa-border">
            {avisos.length}
          </span>
        </div>
        
        {avisos.map((aviso, index) => (
          <div key={aviso.id} style={{animationDelay: `${delay + index * 0.07}s`}}>
            <AvisoCard
              aviso={aviso}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    );
  };

  // Empty state
  if (urgentes.length === 0 && normais.length === 0 && infos.length === 0) {
    return (
      <div className="text-center py-14 px-6 text-eensa-text3 animate-fade-in">
        <div className="mb-4 flex justify-center opacity-40">
          <Icons.Archive size={64} className="text-eensa-text3" />
        </div>
        <p className="text-[15px] leading-relaxed">
          Nenhum aviso ativo no momento.
        </p>
      </div>
    );
  }

  return (
    <>
      {renderSection('Urgentes', <Icons.Urgent size={16} className="text-eensa-orange" />, urgentes, 0.05)}
      {renderSection('Comunicados', <Icons.Normal size={16} className="text-eensa-teal" />, normais, 0.2)}
      {renderSection('Informativos', <Icons.Info size={16} className="text-eensa-yellow" />, infos, 0.34)}
    </>
  );
}
