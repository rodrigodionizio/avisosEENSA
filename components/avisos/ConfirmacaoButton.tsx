// components/avisos/ConfirmacaoButton.tsx
'use client';
import { useConfirmacao } from '@/hooks/useConfirmacao';
import { formatDataHora } from '@/lib/utils';

interface ConfirmacaoButtonProps {
  avisoId: number;
  origem?: 'web' | 'push' | 'tv' | 'qrcode';
  variant?: 'full' | 'compact'; // full = card completo, compact = inline
}

/**
 * Botão de confirmação de leitura de aviso.
 * Gerencia estado automaticamente via useConfirmacao hook.
 * 
 * - **loading**: Verificando se já confirmou
 * - **confirmado**: Mostra feedback visual de ciência confirmada
 * - **nao-confirmado**: Mostra botão para confirmar
 * - **confirmando**: Mostra loading durante requisição
 * - **erro**: Mostra feedback de erro com retry automático
 */
export function ConfirmacaoButton({
  avisoId,
  origem = 'web',
  variant = 'full',
}: ConfirmacaoButtonProps) {
  const { status, confirmado_em, confirmar } = useConfirmacao(avisoId, origem);

  if (status === 'loading') return null; // Não pisca ao carregar

  if (status === 'confirmado') {
    return (
      <div
        className={`flex items-center gap-2 ${
          variant === 'full'
            ? 'bg-eensa-surface2 border border-eensa-border rounded-xl px-4 py-3'
            : 'text-sm text-eensa-text3'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-eensa-green flex items-center justify-center flex-shrink-0">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span className="text-sm font-semibold text-eensa-text2">
          Ciência confirmada
          {confirmado_em && (
            <span className="text-eensa-text3 font-normal ml-1">
              · {formatDataHora(confirmado_em)}
            </span>
          )}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => confirmar()}
      disabled={status === 'confirmando'}
      className={`
        flex items-center justify-center gap-2
        font-display font-bold text-sm
        rounded-xl border-2 transition-all duration-150
        ${
          status === 'erro'
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-eensa-green text-white border-eensa-green hover:bg-eensa-green-mid active:scale-[0.98]'
        }
        ${variant === 'full' ? 'w-full py-3 px-4' : 'px-4 py-2'}
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
    >
      {status === 'confirmando' ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Registrando...
        </>
      ) : status === 'erro' ? (
        'Tentar novamente'
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Li e estou ciente
        </>
      )}
    </button>
  );
}
