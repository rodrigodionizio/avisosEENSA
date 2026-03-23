// components/avisos/AvisoDetailCard.tsx
import type { Aviso } from '@/types';
import { Badge, Chip } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/Icons';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { formatDataHora, diasRestantes, prioridadeConfig } from '@/lib/utils';

interface AvisoDetailCardProps {
  aviso: Aviso;
}

export function AvisoDetailCard({ aviso }: AvisoDetailCardProps) {
  const config = prioridadeConfig[aviso.prioridade];
  const dias = diasRestantes(aviso.expira_em);
  
  // Verificar status do aviso
  const expirado = aviso.expira_em && dias !== null && dias < 0;
  const inativo = !aviso.ativo;

  // Estilo de expiração
  let expiraStyle = 'text-eensa-text3';
  let expiraText = '';
  let expiraIcon = null;
  
  if (aviso.expira_em) {
    if (dias !== null) {
      if (dias < 0) {
        expiraStyle = 'text-gray-500';
        expiraText = 'Expirado';
        expiraIcon = <Icons.X size={16} className="opacity-50" />;
      } else if (dias === 0) {
        expiraStyle = 'text-eensa-red font-bold';
        expiraText = 'Expira hoje';
        expiraIcon = <Icons.Clock size={16} />;
      } else if (dias <= 2) {
        expiraStyle = 'text-eensa-orange font-bold';
        expiraText = `Expira em ${dias} dia(s)`;
        expiraIcon = <Icons.Lightning size={16} />;
      } else {
        expiraText = `Expira em ${formatDataHora(aviso.expira_em)}`;
        expiraIcon = <Icons.Calendar size={16} />;
      }
    }
  }

  // Cores da borda baseado na prioridade
  const borderColor = {
    urgente: '#F28C30',
    normal: '#2BAAC7',
    info: '#F5C840',
  };

  // Cores do título
  const tituloColor = {
    urgente: '#8A3208',
    normal: '#1A3A22',
    info: '#8B6914',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-[1.5px] border-eensa-border">
      {/* Barra colorida superior */}
      <div 
        className="h-1.5"
        style={{ backgroundColor: borderColor[aviso.prioridade] }}
      />
      
      <div className="p-6 md:p-8">
        {/* Badges de status (se aplicável) */}
        {(expirado || inativo) && (
          <div className="flex gap-2 mb-4">
            {expirado && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                <Icons.X size={14} />
                EXPIRADO
              </span>
            )}
            {inativo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                🚫 INATIVO
              </span>
            )}
          </div>
        )}

        {/* Prioridade + Categoria */}
        <div className="flex items-center gap-3 mb-5">
          <Badge prioridade={aviso.prioridade} />
          <Chip>{aviso.categoria}</Chip>
        </div>

        {/* Título grande */}
        <h1 
          className="font-display font-extrabold text-3xl md:text-4xl leading-tight mb-6"
          style={{ color: tituloColor[aviso.prioridade] }}
        >
          {aviso.titulo}
        </h1>

        {/* Corpo do aviso */}
        <div className="mb-8 text-lg md:text-xl text-eensa-text2 leading-relaxed">
          <MarkdownRenderer content={aviso.corpo} />
        </div>

        {/* Separador */}
        <div className="border-t border-eensa-border pt-6 mb-2">
          {/* Meta informações */}
          <div className="space-y-3 text-sm text-eensa-text3">
            <div className="flex items-center gap-2">
              <Icons.User size={18} className="text-eensa-green" />
              <span>
                Publicado por: <span className="font-semibold text-eensa-text2">{aviso.autor}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Icons.Calendar size={18} className="text-eensa-green" />
              <span>
                Em: <span className="font-semibold text-eensa-text2">{formatDataHora(aviso.criado_em)}</span>
              </span>
            </div>
            
            {aviso.expira_em && (
              <div className={`flex items-center gap-2 ${expiraStyle}`}>
                {expiraIcon}
                <span className="font-medium">{expiraText}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
