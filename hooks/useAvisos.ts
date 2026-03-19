// hooks/useAvisos.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { getAvisosAtivos, subscribeToAvisos } from '@/lib/supabase/queries';
import type { Aviso, AvisosGrouped } from '@/types';

export function useAvisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAvisosAtivos();
      setAvisos(data);
      setLastUpdate(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    const channel = subscribeToAvisos(carregar);
    return () => { channel.unsubscribe(); };
  }, [carregar]);

  const grouped: AvisosGrouped = {
    urgentes: avisos.filter(a => a.prioridade === 'urgente'),
    normais: avisos.filter(a => a.prioridade === 'normal'),
    infos: avisos.filter(a => a.prioridade === 'info'),
  };

  return { avisos, grouped, loading, error, lastUpdate, recarregar: carregar };
}
