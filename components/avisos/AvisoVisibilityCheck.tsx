// components/avisos/AvisoVisibilityCheck.tsx
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useLeitor } from '@/contexts/LeitorContext';
import { Icons } from '@/components/ui/Icons';
import type { Aviso, PublicoAlvo, PerfilLeitor } from '@/types';

const PERFIL_PARA_PUBLICO: Record<PerfilLeitor, PublicoAlvo[]> = {
  professor: ['professores', 'todos'],
  pai: ['pais', 'todos'],
  aluno: ['alunos', 'todos'],
  anonimo: ['todos'],
};

interface AvisoVisibilityCheckProps {
  aviso: Aviso;
  children: React.ReactNode;
}

/**
 * Componente que verifica se o aviso é visível para o perfil atual
 * Se não for visível: mostra mensagem de erro
 * Se for visível: renderiza children normalmente
 */
export function AvisoVisibilityCheck({
  aviso,
  children,
}: AvisoVisibilityCheckProps) {
  const { contexto } = useLeitor();

  const eVisivel = useMemo(() => {
    // Se não tem publico_alvo definido, assume "todos" (compatibilidade)
    if (!aviso.publico_alvo || aviso.publico_alvo.length === 0) {
      return true;
    }

    const publicosPermitidos = PERFIL_PARA_PUBLICO[contexto.perfil];
    return aviso.publico_alvo.some((p) => publicosPermitidos.includes(p));
  }, [aviso.publico_alvo, contexto.perfil]);

  // Se o aviso NÃO é visível para o perfil atual
  if (!eVisivel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md bg-white border-2 border-eensa-orange rounded-xl p-8 text-center shadow-lg">
          {/* Ícone de bloqueio */}
          <div className="text-6xl mb-4">🔒</div>

          {/* Título */}
          <h2 className="font-display font-bold text-xl text-eensa-text1 mb-3">
            Aviso Restrito
          </h2>

          {/* Mensagem */}
          <p className="text-sm text-eensa-text3 mb-6">
            Este aviso não é destinado ao seu perfil atual.
            {contexto.jaIdentificado ? (
              <span className="block mt-2 font-semibold">
                Perfil identificado: <strong>{contexto.perfil}</strong>
              </span>
            ) : (
              <span className="block mt-2">
                Você está navegando sem identificação.
              </span>
            )}
          </p>

          {/* Público-alvo do aviso */}
          {aviso.publico_alvo && aviso.publico_alvo.length > 0 && (
            <div className="bg-eensa-surface rounded-lg p-3 mb-6">
              <p className="text-xs text-eensa-text3 mb-2">
                Este aviso é destinado para:
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {aviso.publico_alvo.map((publico) => (
                  <span
                    key={publico}
                    className="inline-flex items-center gap-1.5 bg-white border border-eensa-border rounded-full px-3 py-1 text-xs font-semibold text-eensa-text2"
                  >
                    {publico === 'professores' && <Icons.Teacher size={14} />}
                    {publico === 'pais' && <Icons.Parents size={14} />}
                    {publico === 'alunos' && <Icons.Student size={14} />}
                    {publico === 'todos' && <Icons.UsersGroup size={14} />}
                    <span className="capitalize">{publico}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-eensa-green text-white rounded-lg font-semibold hover:bg-eensa-green-hover transition-colors"
            >
              Ver todos os avisos disponíveis
            </Link>

            {!contexto.jaIdentificado && (
              <Link
                href="/"
                className="inline-block px-6 py-2 text-eensa-teal hover:underline text-sm"
              >
                Identificar meu perfil para ver mais avisos
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Aviso é visível → renderizar normalmente
  return <>{children}</>;
}
