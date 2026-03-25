// app/auth/callback/route.ts
// OAuth callback handler — VALIDA DOMÍNIO após retorno do Google

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isDominioValido, getDominioPermitido } from '@/lib/auth/domain-check';

/**
 * Route Handler para processar callback do Google OAuth
 * 
 * Fluxo:
 * 1. Usuário clica "Login com Google"
 * 2. Redirecionado para Google → escolhe conta
 * 3. Google redireciona para /auth/callback?code=...
 * 4. Este handler troca code por sessão
 * 5. **CRÍTICO**: Valida se email é @educacao.mg.gov.br
 * 6. Se inválido: logout + redirect com erro
 * 7. Se válido: redirect para home
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
    // VALIDAÇÃO CRÍTICA: Verificar domínio do email
    // ══════════════════════════════════════════════════════════════════════════
    const email = data.user?.email;

    if (!isDominioValido(email)) {
      // ──────────────────────────────────────────────────────────────────────
      // Domínio inválido: encerrar sessão e redirecionar com erro específico
      // ──────────────────────────────────────────────────────────────────────
      console.warn(
        '[OAuth Callback] Domínio de email não autorizado:',
        email,
        '| Esperado:',
        getDominioPermitido()
      );

      // Fazer logout imediato
      await supabase.auth.signOut();

      // Redirecionar para home com mensagem de erro
      const errorUrl = new URL('/', origin);
      errorUrl.searchParams.set('erro', 'dominio_invalido');
      errorUrl.searchParams.set('email', email ?? '');

      return NextResponse.redirect(errorUrl.toString());
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Domínio válido: redirecionar para destino
    // ══════════════════════════════════════════════════════════════════════════
    console.log('[OAuth Callback] Login bem-sucedido:', email);
    return NextResponse.redirect(`${origin}${next}`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Sem code nem error: algo inesperado aconteceu
  // ══════════════════════════════════════════════════════════════════════════
  console.warn('[OAuth Callback] Callback sem code nem error — redirecionando para home');
  return NextResponse.redirect(`${origin}/?erro=oauth_invalido`);
}
