// hooks/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const [logado, setLogado] = useState(false);
  const [loading, setLoading] = useState(true);
  const sb = createClient();

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setLogado(!!data.session);
      setLoading(false);
    });
    const { data: listener } = sb.auth.onAuthStateChange((_event, session) => {
      setLogado(!!session);
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

  return { logado, loading, login, logout };
}
