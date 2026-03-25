// contexts/LeitorContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getDeviceHashCached } from '@/lib/device-fingerprint';
import { upsertPerfilLeitor } from '@/lib/supabase/leitor-queries';
import type { ContextoLeitor, PerfilLeitor } from '@/types';

// Chave para persistir perfil anônimo no localStorage
const STORAGE_KEY = '__eensa_perfil__';

interface LeitorContextValue {
  contexto: ContextoLeitor;
  setPerfilSimples: (perfil: 'pai' | 'aluno') => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const LeitorContext = createContext<LeitorContextValue | null>(null);

export function LeitorProvider({ children }: { children: ReactNode }) {
  const [contexto, setContexto] = useState<ContextoLeitor>({
    perfil: 'anonimo',
    deviceHash: '',
    nomeCompleto: null,
    email: null,
    userId: null,
    jaIdentificado: false,
  });
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const sb = createClient();

  // ══════════════════════════════════════════════════════════════════════════
  // Inicializar: verificar sessão Google + perfil salvo no localStorage
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    // NÃO inicializar perfil de leitor para rotas administrativas
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function init() {
      try {
        const hash = await getDeviceHashCached();

        // 1. Verificar se existe sessão Google ativa
        const {
          data: { user },
        } = await sb.auth.getUser();

        if (user) {
          // ─────────────────────────────────────────────────────────────────
          // Usuário autenticado via Google OAuth
          // ─────────────────────────────────────────────────────────────────
          // REGRA DE ACESSO:
          // - Admins (ADMIN_EMAILS): acesso FULL via /admin/layout.tsx
          // - Professores: visualizam avisos 'professores' + 'todos'
          // - Validação de domínio: REMOVIDA (será aplicada apenas no painel /professor)

          const nome =
            user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Usuário';

          if (mounted) {
            setContexto({
              perfil: 'professor',
              deviceHash: hash,
              nomeCompleto: nome,
              email: user.email ?? null,
              userId: user.id,
              jaIdentificado: true,
            });
          }

          // Registrar perfil no banco (upsert)
          await upsertPerfilLeitor({
            device_hash: hash,
            perfil: 'professor',
            user_id: user.id,
            nome_completo: nome,
            email: user.email ?? null,
            user_agent: navigator.userAgent.slice(0, 300),
          });
        } else {
          // ─────────────────────────────────────────────────────────────────
          // Sem sessão Google → NÃO auto-inicializar perfil anônimo
          // ─────────────────────────────────────────────────────────────────
          // REGRA DE NEGÓCIO: Usuário DEVE escolher perfil manualmente
          // Perfis Pai/Aluno NÃO podem ser assumidos automaticamente

          // ⚠️ REMOVIDO: Auto-login via localStorage
          // Motivo: Viola regra "sistema não pode assumir perfil sem escolha"
          
          // Sempre inicia como anônimo (forçar seleção de perfil)
          if (mounted) {
            setContexto({
              perfil: 'anonimo',
              deviceHash: hash,
              nomeCompleto: null,
              email: null,
              userId: null,
              jaIdentificado: false,
            });
          }
        }
      } catch (error) {
        console.error('[LeitorContext] Erro ao inicializar:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [sb, pathname]);

  // ══════════════════════════════════════════════════════════════════════════
  // Perfil simples (pai/aluno) — sem autenticação Google
  // ══════════════════════════════════════════════════════════════════════════
  const setPerfilSimples = useCallback(async (perfil: 'pai' | 'aluno') => {
    try {
      const hash = await getDeviceHashCached();
      const perfilLeitor: PerfilLeitor = perfil === 'pai' ? 'pai' : 'aluno';

      // ⚠️ REGRA DE NEGÓCIO: Seleção de perfil é APENAS estado local
      // - NÃO persiste em localStorage (usuário escolhe a cada sessão)
      // - NÃO registra no banco leitor_perfis (operação desnecessária)
      // - Banco será usado SÓ em confirmações (aviso_confirmacoes)

      // Atualizar contexto local (suficiente para filtrar avisos)
      setContexto((prev) => ({
        ...prev,
        perfil: perfilLeitor,
        deviceHash: hash,
        jaIdentificado: true,
      }));
    } catch (error: any) {
      console.error('[LeitorContext] Erro ao definir perfil simples:', error);
      throw error;
    }
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // Login Google OAuth (professores)
  // ══════════════════════════════════════════════════════════════════════════
  const loginGoogle = useCallback(async () => {
    try {
      // Detectar URL base correta (Vercel ou localhost)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                      (typeof window !== 'undefined' ? window.location.origin : '');
      
      await sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
          queryParams: {
            // Força seleção de conta Google (evita auto-login com conta pessoal)
            prompt: 'select_account',
            // Hint de domínio (filtro visual no Google, não bloqueio)
            hd: 'educacao.mg.gov.br',
          },
        },
      });
    } catch (error) {
      console.error('[LeitorContext] Erro ao iniciar login Google:', error);
      throw error;
    }
  }, [sb]);

  // ══════════════════════════════════════════════════════════════════════════
  // Logout (limpa sessão Google + localStorage)
  // ══════════════════════════════════════════════════════════════════════════
  const logout = useCallback(async () => {
    try {
      // Fazer logout do Supabase Auth (sessão Google)
      await sb.auth.signOut();

      // Limpar localStorage
      localStorage.removeItem(STORAGE_KEY);

      // Resetar contexto para anônimo
      const hash = await getDeviceHashCached();
      setContexto({
        perfil: 'anonimo',
        deviceHash: hash,
        nomeCompleto: null,
        email: null,
        userId: null,
        jaIdentificado: false,
      });
    } catch (error) {
      console.error('[LeitorContext] Erro ao fazer logout:', error);
      throw error;
    }
  }, [sb]);

  return (
    <LeitorContext.Provider
      value={{ contexto, setPerfilSimples, loginGoogle, logout, loading }}
    >
      {children}
    </LeitorContext.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Hook para acessar o contexto de leitor
// ══════════════════════════════════════════════════════════════════════════
export function useLeitor() {
  const ctx = useContext(LeitorContext);
  if (!ctx) {
    throw new Error('useLeitor deve ser usado dentro de LeitorProvider');
  }
  return ctx;
}
