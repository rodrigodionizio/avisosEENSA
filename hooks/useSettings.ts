// hooks/useSettings.ts
'use client';
import { useState, useEffect } from 'react';
import { getTVSettings, updateTVSettings, subscribeToTVSettings } from '@/lib/supabase/settings-queries';
import type { TVSettings } from '@/types';

export function useSettings() {
  const [settings, setSettings] = useState<TVSettings>({
    id: 1,
    timer_seconds: 20,
    transition_duration: 500,
  });
  const [loading, setLoading] = useState(true);

  // Carregar configurações ao montar
  useEffect(() => {
    async function carregar() {
      try {
        const data = await getTVSettings();
        setSettings(data);
      } catch (error) {
        console.error('Erro ao carregar settings:', error);
        // Mantém valores padrão
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  // Subscrever a mudanças em tempo real
  useEffect(() => {
    const unsubscribe = subscribeToTVSettings((newSettings) => {
      console.log('🔄 Settings atualizadas via real-time:', newSettings);
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  return {
    settings,
    loading,
    timerMs: settings.timer_seconds * 1000, // Helper: converter para ms
  };
}
