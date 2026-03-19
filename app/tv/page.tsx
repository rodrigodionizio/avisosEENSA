// app/tv/page.tsx
'use client';
import Link from 'next/link';
import { useAvisos } from '@/hooks/useAvisos';
import { Clock } from '@/components/layout/Clock';
import { EensaLogo } from '@/components/ui/Logo';
import { TVSlider } from '@/components/tv/TVSlider';
import { formatDataHora } from '@/lib/utils';

/**
 * Modo TV Profissional - Identidade Visual EENSA
 * Slider horizontal de avisos (um por vez)
 * - Timer automático: 30 segundos por aviso
 * - Navegação manual: dots + setas
 * - Cores: Mantém identidade visual da página principal
 */
export default function TVPage() {
  const { avisos, loading, lastUpdate } = useAvisos();

  if (loading) {
    return (
      <div className="min-h-screen bg-eensa-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mx-auto mb-4" style={{ borderColor: 'var(--green)' }} />
          <p className="text-2xl font-semibold" style={{ color: 'var(--text2)' }}>Carregando avisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eensa-bg overflow-hidden flex flex-col">
      {/* Header: Clock + Logo (identidade original) */}
      <Clock />
      
      <div className="bg-eensa-surface border-b-2 border-eensa-border px-7 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer">
          <EensaLogo variant="default" size={56} />
          <div>
            <div className="font-display font-extrabold text-2xl text-eensa-green">
              EENSA
            </div>
            <div className="text-sm text-eensa-text3 font-medium tracking-wide">
              Construindo Histórias...
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2 bg-[rgba(43,170,199,0.12)] text-eensa-teal border border-[rgba(43,170,199,0.3)] rounded-full px-5 py-2">
          <span 
            className="w-2.5 h-2.5 rounded-full bg-eensa-teal"
            style={{animation: 'blink 1.2s ease-in-out infinite'}}
          />
          <span className="font-display font-bold text-sm uppercase tracking-wide">
            Atualizado: {formatDataHora(lastUpdate.toISOString())}
          </span>
        </div>
      </div>

      {/* Slider de Avisos (um por vez) */}
      <TVSlider avisos={avisos} />
    </div>
  );
}
