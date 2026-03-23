// components/avisos/AvisoCard.tsx
'use client';
import { useState } from 'react';
import type { Aviso } from '@/types';
import { Badge, Chip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icons';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { formatDataHora, diasRestantes, prioridadeConfig, getAvisoUrl } from '@/lib/utils';

interface AvisoCardProps {
  aviso: Aviso;
  isAdmin?: boolean;
  onEdit?: (aviso: Aviso) => void;
  onDelete?: (id: number) => void;
}

export function AvisoCard({ aviso, isAdmin = false, onEdit, onDelete }: AvisoCardProps) {
  const [linkCopiado, setLinkCopiado] = useState(false);
  
  const config = prioridadeConfig[aviso.prioridade];
  const dias = diasRestantes(aviso.expira_em);

  const copiarLink = async () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}${getAvisoUrl(aviso)}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

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
      <div className="text-eensa-text2 text-sm leading-relaxed mb-3">
        <MarkdownRenderer content={aviso.corpo} />
      </div>

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
      
      {/* Botão discreto de compartilhar link */}
      {!isAdmin && (
        <div className="mt-3 pt-3 border-t border-eensa-border/40">
          <button
            onClick={copiarLink}
            className="text-xs text-eensa-teal hover:text-eensa-teal-mid hover:underline 
                       flex items-center gap-1.5 transition-colors group"
          >
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="group-hover:scale-110 transition-transform"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>{linkCopiado ? '✓ Link copiado!' : 'Copiar link deste aviso'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
