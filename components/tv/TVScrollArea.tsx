// components/tv/TVScrollArea.tsx
'use client';
import { Aviso } from '@/types';
import { TV_CONFIG } from '@/lib/tv-config';
import { useTVScroll } from '@/hooks/useTVScroll';
import { TVCard } from './TVCard';
import { ListIcon } from '@/components/ui/Icons';

interface TVScrollAreaProps {
  avisos: Aviso[];
}

/**
 * Área de scroll infinito para avisos normais
 * Zona 3: Header sticky com backdrop-filter
 * Zona 4: Cards com scroll automático suave
 */
export function TVScrollArea({ avisos }: TVScrollAreaProps) {
  const { containerRef } = useTVScroll();

  // Duplicar avisos para efeito de scroll infinito suave
  // Quando chegar ao fim da lista, volta ao início sem salto visual
  const avisosExtended = avisos.length > 0 ? [...avisos, ...avisos] : avisos;

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Header Sticky - Zona 3 */}
      <div 
        className={`sticky top-0 ${TV_CONFIG.colors.backdropBlur} bg-white/80 border-b-2 border-green/20 px-8 py-6`}
        style={{ zIndex: TV_CONFIG.zIndex.header }}
      >
        <div className="max-w-[2000px] mx-auto flex items-center gap-3">
          <ListIcon className="w-7 h-7 text-green" />
          <h2 className={`${TV_CONFIG.typography.header.title} font-bold text-green`}>
            Comunicados & Informativos
          </h2>
        </div>
      </div>

      {/* Área de Scroll - Zona 4 */}
      <div 
        ref={containerRef}
        className="overflow-y-auto h-full"
        style={{ 
          height: 'calc(100vh - 200px)', // Ajustar conforme necessário
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }
        `}</style>

        <div className="max-w-[2000px] mx-auto px-8 py-8 space-y-6">
          {avisosExtended.length === 0 ? (
            <div className="text-center py-20 text-text3">
              <p className="text-2xl">Nenhum comunicado disponível no momento.</p>
            </div>
          ) : (
            avisosExtended.map((aviso, index) => (
              <TVCard key={`${aviso.id}-${index}`} aviso={aviso} />
            ))
          )}
        </div>

        {/* Espaçamento extra para garantir scroll infinito */}
        <div className="h-32" />
      </div>

      {/* Fade Bottom - Gradiente de fade para suavizar transição */}
      <div 
        className={`pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${TV_CONFIG.colors.fadeGradient}`}
        style={{ zIndex: TV_CONFIG.zIndex.fades }}
      />
    </div>
  );
}
