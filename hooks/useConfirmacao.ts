// hooks/useConfirmacao.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { getDeviceHashCached } from '@/lib/device-fingerprint';
import { checkJaConfirmou } from '@/lib/supabase/confirmacao-queries';

type Status = 'loading' | 'nao-confirmado' | 'confirmando' | 'confirmado' | 'erro';

interface UseConfirmacaoReturn {
  status: Status;
  confirmado_em: string | null;
  confirmar: (displayName?: string) => Promise<void>;
}

/**
 * Hook para gerenciar o estado de confirmação de leitura de um aviso.
 * 
 * @param avisoId - ID do aviso a ser confirmado
 * @param origem - Origem da confirmação (web, push, tv, qrcode)
 * 
 * @returns {UseConfirmacaoReturn} Estado e função para confirmar
 */
export function useConfirmacao(
  avisoId: number,
  origem?: 'web' | 'push' | 'tv' | 'qrcode'
): UseConfirmacaoReturn {
  const [status, setStatus] = useState<Status>('loading');
  const [confirmado_em, setConfirmadoEm] = useState<string | null>(null);
  const [deviceHash, setDeviceHash] = useState<string>('');

  // Inicializar: verificar se já confirmou
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const hash = await getDeviceHashCached();
        const result = await checkJaConfirmou(avisoId, hash);

        if (!mounted) return;
        setDeviceHash(hash);

        if (result.jaConfirmou) {
          setStatus('confirmado');
          setConfirmadoEm(result.confirmado_em);
        } else {
          setStatus('nao-confirmado');
        }
      } catch {
        if (mounted) setStatus('nao-confirmado'); // Fail silently — não bloquear o usuário
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [avisoId]);

  const confirmar = useCallback(
    async (displayName?: string) => {
      if (status !== 'nao-confirmado') return;

      setStatus('confirmando');

      try {
        const res = await fetch('/api/confirmacoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aviso_id: avisoId,
            device_hash: deviceHash,
            display_name: displayName ?? null,
            origem: origem ?? 'web',
          }),
        });

        if (!res.ok) throw new Error('Falha na confirmação');

        setStatus('confirmado');
        setConfirmadoEm(new Date().toISOString());
      } catch {
        setStatus('erro');
        // Retry automático após 3s
        setTimeout(() => setStatus('nao-confirmado'), 3000);
      }
    },
    [status, avisoId, deviceHash, origem]
  );

  return { status, confirmado_em, confirmar };
}
