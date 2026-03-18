// app/page.tsx
'use client';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AvisoList } from '@/components/avisos/AvisoList';
import { ButtonTV } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icons';
import { useAvisos } from '@/hooks/useAvisos';

export default function HomePage() {
  const { grouped, loading, avisos } = useAvisos();
  const urgenteCount = grouped.urgentes.length;

  return (
    <>
      <Header />
      <PageWrapper>
        {/* Page Header */}
        <div className="flex justify-between items-start mb-7 animate-fade-in">
          <div>
            <h1 className="font-display font-extrabold text-[22px] text-eensa-green leading-tight">
              Quadro de Avisos
            </h1>
            <div className="text-[13px] text-eensa-text3 mt-1.5 flex items-center gap-2 flex-wrap">
              <span>{avisos.length} avisos ativos</span>
              <span className="inline-flex items-center gap-1 bg-[rgba(43,170,199,0.12)] text-eensa-teal border border-[rgba(43,170,199,0.3)] rounded-full px-2.5 py-[3px] font-display font-bold text-[11px]">
                <span 
                  className="w-1.5 h-1.5 rounded-full bg-eensa-teal"
                  style={{animation: 'blink 1.2s ease-in-out infinite'}}
                />
                Atualizando em tempo real
              </span>
            </div>
          </div>
          <Link href="/tv">
            <ButtonTV>
              <Icons.TV size={16} className="inline-block" /> Modo TV
            </ButtonTV>
          </Link>
        </div>

        {/* Banner Urgente */}
        {urgenteCount > 0 && (
          <div 
            className="bg-gradient-to-r from-[#FFF3E6] to-eensa-orange-lt border-[1.5px] border-eensa-orange-border rounded-md px-[18px] py-[11px] mb-6 flex items-center gap-2.5 font-display font-bold text-[13px] text-[#8A3A10]"
            style={{animation: 'pulseBar 3s ease-in-out infinite'}}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full bg-eensa-orange flex-shrink-0"
              style={{animation: 'blink 1.4s ease-in-out infinite'}}
            />
            {urgenteCount} aviso{urgenteCount > 1 ? 's' : ''} urgent{urgenteCount > 1 ? 'es' : 'e'} — leia com atenção
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-md bg-gradient-to-r from-eensa-surface2 via-[#EAF3E5] to-eensa-surface2 bg-[length:200%_100%] h-[110px] mb-3"
                style={{animation: 'shimmer 1.5s infinite'}}
              />
            ))}
          </div>
        ) : (
          <AvisoList
            avisos={avisos}
            urgentes={grouped.urgentes}
            normais={grouped.normais}
            infos={grouped.infos}
          />
        )}
      </PageWrapper>
      <Footer />
    </>
  );
}
