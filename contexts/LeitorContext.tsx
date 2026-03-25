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
import { createClient } from '@/lib/supabase/client';
import { getDeviceHashCached } from '@/lib/device-fingerprint';
import { isDominioValido } from '@/lib/auth/domain-check';
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
  const sb = createClient();

  // ══════════════════════════════════════════════════════════════════════════
  // Inicializar: verificar sessão Google + perfil salvo no localStorage
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
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

          // VALIDAÇÃO CRÍTICA: Verificar se o email é do domínio permitido
          if (!isDominioValido(user.email)) {
            // Domínio inválido → fazer logout imediatamente
            console.warn(
              '[LeitorContext] Email com domínio inválido detectado. Fazendo logout...',
              user.email
            );
            await sb.auth.signOut();

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
            setLoading(false);
            return;
          }

          // Domínio válido → configurar contexto de professor
          const nome =
            user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Professor';

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
          // Sem sessão Google → verificar perfil anônimo salvo (localStorage)
          // ─────────────────────────────────────────────────────────────────
          const saved = localStorage.getItem(STORAGE_KEY);

          if (saved && (saved === 'pai' || saved === 'aluno')) {
            const perfil: PerfilLeitor = saved === 'pai' ? 'pai' : 'aluno';

            if (mounted) {
              setContexto({
                perfil,
                deviceHash: hash,
                nomeCompleto: null,
                email: null,
                userId: null,
                jaIdentificado: true,
              });
            }

            // Registrar perfil no banco (upsert)
            await upsertPerfilLeitor({
              device_hash: hash,
              perfil,
              user_agent: navigator.userAgent.slice(0, 300),
            });
          } else {
            // Nenhum perfil identificado → permanece anônimo
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
  }, [sb]);

  // ══════════════════════════════════════════════════════════════════════════
  // Perfil simples (pai/aluno) — sem autenticação Google
  // ══════════════════════════════════════════════════════════════════════════
  const setPerfilSimples = useCallback(async (perfil: 'pai' | 'aluno') => {
    try {
      const hash = await getDeviceHashCached();
      const perfilLeitor: PerfilLeitor = perfil === 'pai' ? 'pai' : 'aluno';

      // Persistir no localStorage para próximas sessões
      localStorage.setItem(STORAGE_KEY, perfil);

      // Registrar no banco (sem dados pessoais)
      await upsertPerfilLeitor({
        device_hash: hash,
        perfil: perfilLeitor,
        user_agent: navigator.userAgent.slice(0, 300),
      });

      // Atualizar contexto local
      setContexto((prev) => ({
        ...prev,
        perfil: perfilLeitor,
        deviceHash: hash,
        jaIdentificado: true,
      }));
    } catch (error) {
      console.error('[LeitorContext] Erro ao definir perfil simples:', error);
      throw error;
    }
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // Login Google OAuth (professores)
  // ══════════════════════════════════════════════════════════════════════════
  const loginGoogle = useCallback(async () => {
    try {
      await sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
