// app/tv/page.tsx
'use client';
import { useAvisos } from '@/hooks/useAvisos';
import { TVTopBar } from '@/components/tv/TVTopBar';
import { TVUrgentBanner } from '@/components/tv/TVUrgentBanner';
import { TVScrollArea } from '@/components/tv/TVScrollArea';

/**
 * Modo TV Profissional
 * Otimizado para exibição em telas de 720p a 4K
 * Layout em 4 zonas com z-index hierarchy:
 * 
 * Zona 1 (z-100): TVTopBar - Logo, Data, Relógio, "AO VIVO"
 * Zona 2 (z-5):   TVUrgentBanner - Avisos urgentes (carousel/grid adaptativo)
 * Zona 3 (z-20):  Header Sticky - "Comunicados & Informativos" com backdrop-filter
 * Zona 4 (z-1):   TVScrollArea - Cards com scroll infinito automático
 * 
 * Fades (z-15):   Gradientes de fade para suavizar scroll
 */
export default function TVPage() {
  const { avisos, loading } = useAvisos();

  // Separar urgentes e normais
  const urgentes = avisos.filter(a => a.prioridade === 'urgente');
  const normais = avisos.filter(a => a.prioridade !== 'urgente');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green mx-auto mb-4" />
          <p className="text-2xl text-text2 font-semibold">Carregando avisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Zona 1: TopBar (z-100) */}
      <TVTopBar />

      {/* Espaçamento para TopBar fixa */}
      <div className="h-12" />

      {/* Zona 2: Banner de Urgentes (z-5) - Condicional */}
      {urgentes.length > 0 && <TVUrgentBanner urgentes={urgentes} />}

      {/* Zona 3 + 4: Header Sticky + Scroll Infinito */}
      <TVScrollArea avisos={normais} />
    </div>
  );
}
