// lib/supabase/settings-queries.ts
import { createClient } from './client';
import type { TVSettings } from '@/types';

const sb = createClient();

// Helper para logging de erros
function logSupabaseError(operation: string, error: any) {
  console.group(`🚨 Erro Supabase: ${operation}`);
  console.error('Código:', error?.code);
  console.error('Mensagem:', error?.message);
  console.error('Detalhes:', error?.details);
  console.error('Erro completo:', error);
  console.groupEnd();
}

/** Retorna as configurações do Modo TV */
export async function getTVSettings(): Promise<TVSettings> {
  const { data, error } = await sb
    .from('tv_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    logSupabaseError('getTVSettings', error);
    // Retornar valores padrão em caso de erro
    return {
      id: 1,
      timer_seconds: 20,
      transition_duration: 500,
    };
  }
  
  return data as TVSettings;
}

/** Atualiza as configurações do Modo TV */
export async function updateTVSettings(
  timerSeconds: number,
  transitionDuration: number,
  userEmail?: string
): Promise<TVSettings> {
  const { data, error } = await sb
    .from('tv_settings')
    .update({
      timer_seconds: timerSeconds,
      transition_duration: transitionDuration,
      updated_at: new Date().toISOString(),
      updated_by: userEmail || null,
    })
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    logSupabaseError('updateTVSettings', error);
    throw error;
  }
  
  return data as TVSettings;
}

/** Subscreve a mudanças em tempo real nas configurações */
export function subscribeToTVSettings(callback: (settings: TVSettings) => void) {
  const channel = sb
    .channel('tv_settings_changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'tv_settings',
      },
      (payload) => {
        callback(payload.new as TVSettings);
      }
    )
    .subscribe();

  // Retornar função de cleanup
  return () => {
    sb.removeChannel(channel);
  };
}
