// app/aviso/[id]/page.tsx
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getAvisoBySlugOrId, getOutrosAvisosAtivos } from '@/lib/supabase/queries-server';
import { getAvisoUrl } from '@/lib/utils';
import { AvisoDetailCard } from '@/components/avisos/AvisoDetailCard';
import { AvisoLinksList } from '@/components/avisos/AvisoLinksList';
import { ShareButton } from '@/components/ui/ShareButton';
import { EensaLogo } from '@/components/ui/Logo';

interface AvisoPageProps {
  params: Promise<{ id: string }>;
}

export default async function AvisoPage({ params }: AvisoPageProps) {
  const { id } = await params;
  
  // Buscar aviso por slug ou ID (suporta ambos)
  const aviso = await getAvisoBySlugOrId(id);
  
  if (!aviso) {
    notFound();
  }
  
  // REDIRECT: Se acessado via ID numérico e tem slug, redirecionar para URL canônica
  // Exemplo: /aviso/1 → /aviso/bem-vindos-ao-novo-quadro-de-avisos-digital
  if (/^\d+$/.test(id) && aviso.slug) {
    redirect(`/aviso/${aviso.slug}`);
  }
  
  // Buscar outros avisos para sugestão
  const outros = await getOutrosAvisosAtivos(aviso.id);
  
  // URL completa para compartilhamento (sempre com slug quando disponível)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const avisoUrl = `${baseUrl}${getAvisoUrl(aviso)}`;
  
  return (
    <div className="min-h-screen bg-eensa-bg">
      {/* Header simples com logo e botão Home */}
      <header className="bg-eensa-surface border-b-2 border-eensa-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <EensaLogo variant="default" size={44} />
            <div>
              <div className="font-display font-extrabold text-xl text-eensa-green">
                EENSA
              </div>
              <div className="text-xs text-eensa-text3 font-medium">
                Construindo Histórias...
              </div>
            </div>
          </Link>
          
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-eensa-green text-white rounded-lg
                       hover:bg-eensa-green-mid transition-colors font-medium text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Início</span>
          </Link>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Card do aviso */}
        <AvisoDetailCard aviso={aviso} />
        
        {/* Botões de compartilhamento */}
        <div className="mt-8">
          <ShareButton url={avisoUrl} titulo={aviso.titulo} />
        </div>
        
        {/* Sugestões de outros avisos */}
        {outros.length > 0 && (
          <AvisoLinksList avisos={outros} />
        )}
        
        {/* Link de volta */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-eensa-teal hover:text-eensa-teal-mid 
                       font-semibold transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Ver todos os avisos</span>
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-eensa-surface border-t border-eensa-border mt-16 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-eensa-text3">
          <p>© 2026 E.E.N.S.A - Escola Estadual Nossa Senhora Aparecida</p>
          <p className="mt-1">Construindo Histórias, Formando Cidadãos</p>
        </div>
      </footer>
    </div>
  );
}

// Metadata dinâmico para SEO e preview em redes sociais
export async function generateMetadata({ params }: AvisoPageProps) {
  const { id } = await params;
  
  // Buscar aviso por slug ou ID
  const aviso = await getAvisoBySlugOrId(id);
  
  if (!aviso) {
    return {
      title: 'Aviso não encontrado - EENSA',
    };
  }
  
  const descricao = aviso.corpo.length > 160 
    ? aviso.corpo.substring(0, 157) + '...'
    : aviso.corpo;
  
  // URL canônica sempre com slug (para SEO)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const canonicalUrl = `${baseUrl}${getAvisoUrl(aviso)}`;
  
  return {
    title: `${aviso.titulo} - EENSA`,
    description: descricao,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: aviso.titulo,
      description: aviso.corpo,
      type: 'article',
      siteName: 'EENSA - Avisos Escolares',
      locale: 'pt_BR',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary',
      title: aviso.titulo,
      description: descricao,
    },
  };
}
