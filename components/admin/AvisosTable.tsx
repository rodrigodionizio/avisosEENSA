// components/admin/AvisosTable.tsx
import type { Aviso } from '@/types';
import { Badge, Chip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icons';
import { diasRestantes } from '@/lib/utils';

interface AvisosTableProps {
  avisos: Aviso[];
  onEdit: (aviso: Aviso) => void;
  onDelete: (id: number) => void;
}

export function AvisosTable({ avisos, onEdit, onDelete }: AvisosTableProps) {
  return (
    <div className="bg-eensa-surface rounded-md border-[1.5px] border-eensa-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3.5 border-b-[1.5px] border-eensa-border flex justify-between items-center bg-eensa-surface2">
        <span className="font-display font-extrabold text-[13px] text-eensa-text">
          {avisos.length} aviso{avisos.length !== 1 ? 's' : ''}
        </span>
        <span className="text-xs text-eensa-text3">
          Ordenados por urgência
        </span>
      </div>

      {/* Rows */}
      {avisos.length === 0 ? (
        <div className="px-5 py-10 text-center text-eensa-text3">
          Nenhum aviso encontrado
        </div>
      ) : (
        avisos.map((aviso, index) => {
          const dias = diasRestantes(aviso.expira_em);
          let expiraText = '';
          let expiraClass = 'text-eensa-text3';
          let expiraIcon = null;

          if (aviso.expira_em && dias !== null) {
            if (dias < 0) {
              expiraText = 'Expirado';
              expiraClass = 'text-gray-500';
              expiraIcon = <Icons.X size={14} className="opacity-50" />;
            } else if (dias === 0) {
              expiraText = 'Expira hoje';
              expiraClass = 'expira-hoje text-eensa-red font-bold';
              expiraIcon = <Icons.Clock size={14} />;
            } else if (dias <= 2) {
              expiraText = `Expira em ${dias} dia(s)`;
              expiraClass = 'expira-breve text-eensa-orange font-bold';
              expiraIcon = <Icons.Lightning size={14} />;
            } else {
              const dataFormatada = new Date(aviso.expira_em).toLocaleDateString('pt-BR');
              expiraText = `Até ${dataFormatada}`;
              expiraIcon = <Icons.Calendar size={14} />;
            }
          }

          return (
            <div
              key={aviso.id}
              className="px-5 py-3.5 border-b border-eensa-border last:border-b-0 flex items-center gap-3.5 transition-all duration-150 hover:bg-eensa-bg animate-card-in"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              {/* Badge prioridade */}
              <div>
                <Badge prioridade={aviso.prioridade} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="mb-1">
                  <Chip>{aviso.categoria}</Chip>
                </div>
                <div className="font-display font-bold text-sm text-eensa-text my-[5px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {aviso.titulo}
                </div>
                <div className="text-xs text-eensa-text3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5">
                    <Icons.User size={14} className="opacity-70" /> {aviso.autor}
                  </span>
                  {expiraText && (
                    <span className={`flex items-center gap-1.5 ${expiraClass}`}>
                      {expiraIcon} {expiraText}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onEdit(aviso)}
                >
                  <Icons.Edit size={14} /> Editar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  icon
                  onClick={() => onDelete(aviso.id)}
                >
                  <Icons.Trash size={16} />
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
