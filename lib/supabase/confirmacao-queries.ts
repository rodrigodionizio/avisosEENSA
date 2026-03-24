// lib/supabase/confirmacao-queries.ts (CLIENT-SIDE ONLY)
import { createClient } from '@/lib/supabase/client';
import type { ConfirmacaoStatus } from '@/types';

/**
 * Verifica se o device já confirmou leitura deste aviso.
 * Usado no hook useConfirmacao para determinar estado inicial.
 */
export async function checkJaConfirmou(
  avisoId: number,
  deviceHash: string
): Promise<ConfirmacaoStatus> {
  const sb = createClient();

  const { data } = await sb
    .from('aviso_confirmacoes')
    .select('confirmado_em')
    .eq('aviso_id', avisoId)
    .eq('device_hash', deviceHash)
    .maybeSingle();

  return {
    jaConfirmou: !!data,
    confirmado_em: data?.confirmado_em ?? null,
  };
}

/**
 * Assina realtime de novas confirmações de um aviso (para o admin).
 * Retorna um channel que pode ser desassinado com .unsubscribe().
 */
export function subscribeConfirmacoes(
  avisoId: number,
  callback: () => void
) {
  const sb = createClient();

  return sb
    .channel(`confirmacoes-aviso-${avisoId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'aviso_confirmacoes',
        filter: `aviso_id=eq.${avisoId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * Busca estatísticas de confirmação (CLIENT-SIDE).
 * Faz query direto na view materializada.
 */
export async function getConfirmacaoStatsClient(avisoId: number) {
  const sb = createClient();

  const { data } = await sb
    .from('aviso_confirmacoes_stats')
    .select('*')
    .eq('aviso_id', avisoId)
    .maybeSingle();

  return data;
}
