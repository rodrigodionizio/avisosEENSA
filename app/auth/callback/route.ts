// app/auth/callback/route.ts
// OAuth callback handler — Processa retorno do Google OAuth

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Route Handler para processar callback do Google OAuth
 * 
 * Fluxo:
 * 1. Usuário clica "Login com Google"
 * 2. Redirecionado para Google → escolhe conta
 * 3. Google redireciona para /auth/callback?code=...
 * 4. Este handler troca code por sessão
 * 5. Redirect para home
 * 
 * Validação de acesso:
 * - Admin: verificada em /admin/layout.tsx via ADMIN_EMAILS
 * - Professor: painel removido do escopo (não há validação)
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const error = searchParams.get('error');

  // ══════════════════════════════════════════════════════════════════════════
  // Usuário cancelou OAuth no Google
  // ══════════════════════════════════════════════════════════════════════════
  if (error) {
    console.warn('[OAuth Callback] Usuário cancelou login:', error);
    return NextResponse.redirect(`${origin}/?erro=oauth_cancelado`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Trocar authorization code por sessão
  // ══════════════════════════════════════════════════════════════════════════
  if (code) {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      console.error('[OAuth Callback] Erro ao trocar code por sessão:', exchangeError);
      return NextResponse.redirect(`${origin}/?erro=oauth_falhou`);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Login bem-sucedido: redirecionar para destino
    // ══════════════════════════════════════════════════════════════════════════
    // Nota: Validação de acesso admin é feita em /admin/layout.tsx via ADMIN_EMAILS
    const email = data.user?.email;
    console.log('[OAuth Callback] Login bem-sucedido:', email);
    return NextResponse.redirect(`${origin}${next}`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Sem code nem error: algo inesperado aconteceu
  // ══════════════════════════════════════════════════════════════════════════
  console.warn('[OAuth Callback] Callback sem code nem error — redirecionando para home');
  return NextResponse.redirect(`${origin}/?erro=oauth_invalido`);
}
