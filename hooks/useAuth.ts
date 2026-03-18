// hooks/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [logado, setLogado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<User | null>(null);
  const sb = createClient();

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setLogado(!!data.session);
      setUsuario(data.session?.user || null);
      setLoading(false);
    });
    const { data: listener } = sb.auth.onAuthStateChange((_event, session) => {
      setLogado(!!session);
      setUsuario(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, [sb]);

  const login = async (email: string, senha: string) => {
    const { error } = await sb.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
  };

  const logout = async () => {
    await sb.auth.signOut();
  };

  // Retorna nome do user_metadata ou email
  const getNome = () => {
    if (!usuario) return '';
    return usuario.user_metadata?.nome || usuario.user_metadata?.display_name || usuario.email || '';
  };

  return { logado, loading, login, logout, usuario, getNome };
}
