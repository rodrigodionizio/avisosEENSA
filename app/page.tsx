// app/page.tsx
'use client';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AvisoList } from '@/components/avisos/AvisoList';
import { ProfileSelector } from '@/components/layout/ProfileSelector';
import { ButtonTV } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icons';
import { useAvisosSegmentados } from '@/hooks/useAvisosSegmentados';
import { useLeitor } from '@/contexts/LeitorContext';
import { useAuth } from '@/hooks/useAuth';
import { PushPromoBanner } from '@/components/ui/PushPromoBanner';

export default function HomePage() {
  const { grouped, loading, avisos } = useAvisosSegmentados();
  const { contexto, loading: leitorLoading } = useLeitor();
  const { usuario } = useAuth();
  const urgenteCount = grouped.urgentes.length;

  // Lista de emails admin permitidos
  const adminEmails = [
    'admin@eensa.com.br',
    'direcao@eensa.com.br',
    'coordenacao@eensa.com.br',
    'rodrigo.dionizio@gmail.com',
  ];

  const isAdmin = usuario?.email && adminEmails.includes(usuario.email.toLowerCase());

  return (
    <>
      <Header />
      <PageWrapper>
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* LÓGICA CONDICIONAL: ProfileSelector vs Avisos                  */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        
        {leitorLoading ? (
          // Loading do contexto de leitor
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-eensa-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-eensa-text3">Carregando...</p>
            </div>
          </div>
        ) : !contexto.jaIdentificado ? (
          // Usuário NÃO identificado → Mostrar seletor de perfil
          <ProfileSelector />
        ) : (
          // Usuário IDENTIFICADO → Mostrar avisos
          <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-7 animate-fade-in">
              <div className="flex-1 min-w-0">
                <h1 className="font-display font-extrabold text-xl sm:text-[22px] text-eensa-green leading-tight">
                  Quadro de Avisos
                </h1>
                <div className="text-xs sm:text-[13px] text-eensa-text3 mt-1.5 flex items-center gap-2 flex-wrap">
                  <span>{avisos.length} avisos ativos</span>
                  <span className="inline-flex items-center gap-1 bg-[rgba(43,170,199,0.12)] text-eensa-teal border border-[rgba(43,170,199,0.3)] rounded-full px-2.5 py-[3px] font-display font-bold text-[10px] sm:text-[11px]">
                    <span 
                      className="w-1.5 h-1.5 rounded-full bg-eensa-teal"
                      style={{animation: 'blink 1.2s ease-in-out infinite'}}
                    />
                    Atualizando em tempo real
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {isAdmin && (
                  <Link href="/admin">
                    <ButtonTV>
                      <Icons.Settings size={16} className="inline-block" /> <span className="hidden xs:inline">Gestão</span><span className="xs:hidden">⚙️</span>
                    </ButtonTV>
                  </Link>
                )}
                <Link href="/tv">
                  <ButtonTV>
                    <Icons.TV size={16} className="inline-block" /> <span className="hidden xs:inline">Modo TV</span><span className="xs:hidden">TV</span>
                  </ButtonTV>
                </Link>
              </div>
            </div>

            {/* Banner Promocional de Push Notifications */}
            <PushPromoBanner />

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
          </>
        )}
      </PageWrapper>
      <Footer />
    </>
  );
}
