// app/tv/page.tsx
'use client';
import Link from 'next/link';
import { Clock } from '@/components/layout/Clock';
import { AvisoList } from '@/components/avisos/AvisoList';
import { Icons } from '@/components/ui/Icons';
import { EensaLogo } from '@/components/ui/Logo';
import { useAvisos } from '@/hooks/useAvisos';

export default function TVPage() {
  const { grouped, loading, avisos } = useAvisos();

  return (
    <div className="min-h-screen bg-eensa-bg">
      {/* Clock Bar */}
      <Clock />

      {/* Logo Bar */}
      <div className="bg-eensa-surface border-b-2 border-eensa-border px-7 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <EensaLogo variant="default" size={52} />
          <div>
            <div className="font-display font-extrabold text-xl text-eensa-green">
              EENSA
            </div>
            <div className="text-xs text-eensa-text3 font-medium tracking-wide">
              Construindo Histórias...
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto px-7 py-7 pb-[60px]">
        {loading ? (
          <div className="text-center py-10 text-eensa-text3">Carregando avisos...</div>
        ) : (
          <div className="tv">
            <AvisoList
              avisos={avisos}
              urgentes={grouped.urgentes}
              normais={grouped.normais}
              infos={grouped.infos}
            />
          </div>
        )}
      </div>

      {/* Back Button */}
      <Link href="/">
        <button className="fixed bottom-6 right-6 bg-[rgba(26,107,46,0.85)] text-white/80 border-none rounded-full px-4 py-2 font-display font-semibold text-xs cursor-pointer backdrop-blur-lg transition-all duration-200 hover:bg-eensa-green hover:text-white flex items-center gap-2">
          <Icons.Arrow size={16} className="rotate-180" /> Sair do modo TV
        </button>
      </Link>
    </div>
  );
}
