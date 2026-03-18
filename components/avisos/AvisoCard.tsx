// components/avisos/AvisoCard.tsx
import type { Aviso } from '@/types';
import { Badge, Chip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icons';
import { formatDataHora, diasRestantes, prioridadeConfig } from '@/lib/utils';

interface AvisoCardProps {
  aviso: Aviso;
  isAdmin?: boolean;
  onEdit?: (aviso: Aviso) => void;
  onDelete?: (id: number) => void;
}

export function AvisoCard({ aviso, isAdmin = false, onEdit, onDelete }: AvisoCardProps) {
  const config = prioridadeConfig[aviso.prioridade];
  const dias = diasRestantes(aviso.expira_em);

  // Estilo de expiração
  let expiraStyle = 'expira-normal text-eensa-text3';
  let expiraText = '';
  let expiraIcon = null;
  
  if (aviso.expira_em) {
    if (dias !== null) {
      if (dias < 0) {
        expiraStyle = 'text-gray-500';
        expiraText = 'Expirado';
        expiraIcon = <Icons.X size={14} className="opacity-50" />;
      } else if (dias === 0) {
        expiraStyle = 'expira-hoje text-eensa-red font-bold';
        expiraText = 'Expira hoje';
        expiraIcon = <Icons.Clock size={14} />;
      } else if (dias <= 2) {
        expiraStyle = 'expira-breve text-eensa-orange font-bold';
        expiraText = `Expira em ${dias} dia(s)`;
        expiraIcon = <Icons.Lightning size={14} />;
      } else {
        const dataFormatada = new Date(aviso.expira_em).toLocaleDateString('pt-BR');
        expiraText = `Até ${dataFormatada}`;
        expiraIcon = <Icons.Calendar size={14} />;
      }
    }
  }

  // Classes condicionais para background
  const bgGradient = {
    urgente: 'bg-gradient-to-br from-[#FFFAF5] to-eensa-orange-lt',
    normal: 'bg-gradient-to-br from-[#FAFEFF] to-[#F0FAFD]',
    info: 'bg-gradient-to-br from-[#FFFEF5] to-eensa-yellow-lt',
  };

  const borderColor = {
    urgente: 'border-eensa-orange-border',
    normal: 'border-eensa-teal-border',
    info: 'border-eensa-yellow-border',
  };

  const barGradient = {
    urgente: 'bg-gradient-to-b from-eensa-orange to-eensa-red',
    normal: 'bg-eensa-teal',
    info: 'bg-eensa-yellow',
  };

  return (
    <div 
      className={`relative bg-eensa-surface ${bgGradient[aviso.prioridade]} rounded-md border-[1.5px] ${borderColor[aviso.prioridade]} p-5 pr-[22px] pl-7 mb-3 shadow-sm transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md animate-card-in overflow-hidden`}
    >
      {/* Barra colorida esquerda */}
      <div className={`absolute left-0 top-0 bottom-0 w-[5px] ${barGradient[aviso.prioridade]} rounded-l-md`} />

      {/* Badges */}
      <div className="flex gap-1.5 flex-wrap items-center mb-[7px]">
        <Badge prioridade={aviso.prioridade} />
        <Chip>{aviso.categoria}</Chip>
      </div>

      {/* Título */}
      <h3 
        className={`font-display font-extrabold text-base leading-snug mb-2 ${
          aviso.prioridade === 'urgente' ? 'text-[#8A3208]' : 'text-eensa-text'
        }`}
      >
        {aviso.titulo}
      </h3>

      {/* Corpo */}
      <p className="text-eensa-text2 text-sm leading-relaxed mb-3">
        {aviso.corpo}
      </p>

      {/* Meta + Actions */}
      <div className="flex items-center justify-between pt-2.5 border-t border-eensa-border/60">
        <div className="flex items-center gap-3.5 flex-wrap text-xs text-eensa-text3">
          <span className="flex items-center gap-1.5">
            <Icons.User size={14} className="opacity-70" /> {aviso.autor}
          </span>
          <span className="flex items-center gap-1.5">
            <Icons.Clock size={14} className="opacity-70" /> {formatDataHora(aviso.criado_em)}
          </span>
          {expiraText && (
            <span className={`flex items-center gap-1.5 ${expiraStyle}`}>
              {expiraIcon} {expiraText}
            </span>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-1.5 flex-shrink-0">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onEdit?.(aviso)}
            >
              <Icons.Edit size={14} /> Editar
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              icon
              onClick={() => onDelete?.(aviso.id)}
            >
              <Icons.Trash size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
