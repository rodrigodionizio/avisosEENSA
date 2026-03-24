// components/admin/ConfirmacoesDashboard.tsx
'use client';
import { useState, useEffect } from 'react';
import { getConfirmacaoStatsClient, subscribeConfirmacoes } from '@/lib/supabase/confirmacao-queries';
import type { AvisoConfirmacaoStats } from '@/types';
import { formatDataHora } from '@/lib/utils';

interface Props {
  avisoId: number;
  totalEsperado?: number; // Meta para calcular % (opcional)
}

/**
 * Dashboard de confirmações de leitura para o admin.
 * Atualiza em tempo real quando novas confirmações chegam (Supabase Realtime).
 * 
 * Exibe:
 * - Taxa de confirmação (se totalEsperado fornecido)
 * - Total de confirmações
 * - Confirmações via push
 * - Confirmações via QR code
 * - Último registro
 */
export function ConfirmacoesDashboard({ avisoId, totalEsperado }: Props) {
  const [stats, setStats] = useState<AvisoConfirmacaoStats | null>(null);

  const load = async () => {
    const data = await getConfirmacaoStatsClient(avisoId);
    setStats(data ?? null);
  };

  useEffect(() => {
    load();

    // Real-time: atualiza quando chega nova confirmação
    const channel = subscribeConfirmacoes(avisoId, load);
    return () => {
      channel.unsubscribe();
    };
  }, [avisoId]);

  if (!stats) return null;

  const pct = totalEsperado
    ? Math.round((stats.total_confirmacoes / totalEsperado) * 100)
    : null;

  return (
    <div className="bg-eensa-surface border border-eensa-border rounded-xl p-4">
      {/* Taxa */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-eensa-text3 uppercase tracking-wide">
          Confirmações de ciência
        </span>
        {pct !== null && (
          <span className="text-sm font-extrabold text-eensa-green">{pct}%</span>
        )}
      </div>

      {pct !== null && (
        <div className="h-2 bg-eensa-surface2 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-eensa-green rounded-full transition-all duration-700"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      )}

      {/* Números */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center bg-eensa-surface2 rounded-lg py-2">
          <div className="text-lg font-black text-eensa-green">{stats.total_confirmacoes}</div>
          <div className="text-[10px] text-eensa-text3 font-semibold">Total</div>
        </div>
        <div className="text-center bg-eensa-surface2 rounded-lg py-2">
          <div className="text-lg font-black text-eensa-teal">{stats.via_push}</div>
          <div className="text-[10px] text-eensa-text3 font-semibold">Via push</div>
        </div>
        <div className="text-center bg-eensa-surface2 rounded-lg py-2">
          <div className="text-lg font-black text-eensa-text3">{stats.via_qrcode}</div>
          <div className="text-[10px] text-eensa-text3 font-semibold">Via QR</div>
        </div>
      </div>

      {/* Última confirmação */}
      {stats.ultima_confirmacao && (
        <div className="text-xs text-eensa-text3">
          Última confirmação: {formatDataHora(stats.ultima_confirmacao)}
        </div>
      )}
    </div>
  );
}
