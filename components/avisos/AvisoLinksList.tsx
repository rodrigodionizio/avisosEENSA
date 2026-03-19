// components/avisos/AvisoLinksList.tsx
import Link from 'next/link';
import type { Aviso } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { prioridadeConfig } from '@/lib/utils';

interface AvisoLinksListProps {
  avisos: Aviso[];
  title?: string;
}

export function AvisoLinksList({ avisos, title = "💡 Outros Avisos Ativos" }: AvisoLinksListProps) {
  if (avisos.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
      <h2 className="font-display font-bold text-xl text-blue-900 mb-4">
        {title}
      </h2>
      
      <div className="space-y-3">
        {avisos.map(aviso => {
          const config = prioridadeConfig[aviso.prioridade];
          
          return (
            <Link
              key={aviso.id}
              href={`/aviso/${aviso.id}`}
              className="block p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-1">
                  <Badge prioridade={aviso.prioridade} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-eensa-text mb-1 line-clamp-1">
                    {aviso.titulo}
                  </h3>
                  <p className="text-sm text-eensa-text3 line-clamp-2">
                    {aviso.corpo}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="text-blue-500"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
