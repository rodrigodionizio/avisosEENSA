// hooks/useAvisosSegmentados.ts
// Hook de filtragem de avisos baseado no perfil do leitor
'use client';

import { useMemo } from 'react';
import { useAvisos } from '@/hooks/useAvisos';
import { useLeitor } from '@/contexts/LeitorContext';
import type { Aviso, PublicoAlvo, PerfilLeitor, AvisosGrouped } from '@/types';

/**
 * Mapeamento: perfil do leitor → públicos que ele pode visualizar
 * 
 * Lógica:
 * - Professores veem: avisos marcados como "professores" OU "todos"
 * - Pais veem: avisos marcados como "pais" OU "todos"
 * - Alunos veem: avisos marcados como "alunos" OU "todos"
 * - Anônimos veem: APENAS avisos marcados como "todos"
 */
const PERFIL_PARA_PUBLICO: Record<PerfilLeitor, PublicoAlvo[]> = {
  professor: ['professores', 'todos'],
  pai: ['pais', 'todos'],
  aluno: ['alunos', 'todos'],
  anonimo: ['todos'],
};

/**
 * Verifica se um aviso é visível para os públicos permitidos
 * 
 * @param aviso - Aviso a ser verificado
 * @param publicosPermitidos - Lista de públicos que o leitor pode visualizar
 * @returns true se o aviso deve ser exibido
 */
function avisoVisivelPara(
  aviso: Aviso,
  publicosPermitidos: PublicoAlvo[]
): boolean {
  // Se o aviso não tem publico_alvo definido ou está vazio, assume "todos"
  // (compatibilidade com avisos antigos antes da migração)
  if (!aviso.publico_alvo || aviso.publico_alvo.length === 0) {
    return true;
  }

  // Verifica se pelo menos UM dos públicos do aviso está nos públicos permitidos
  return aviso.publico_alvo.some((p) => publicosPermitidos.includes(p));
}

/**
 * Hook que estende useAvisos com filtragem por perfil do leitor
 * 
 * Retorna os mesmos dados de useAvisos, mas com avisos filtrados
 * baseado no perfil identificado (professor, pai, aluno, anônimo)
 * 
 * @returns Avisos filtrados + grouped + metadata (mesmo interface que useAvisos)
 */
export function useAvisosSegmentados() {
  const { avisos, grouped, loading, error, recarregar } = useAvisos();
  const { contexto } = useLeitor();

  // Determinar quais públicos o perfil atual pode visualizar
  const publicosPermitidos = PERFIL_PARA_PUBLICO[contexto.perfil];

  // Filtrar avisos baseado no perfil
  const avisosFiltrados = useMemo(() => {
    return avisos.filter((aviso) => avisoVisivelPara(aviso, publicosPermitidos));
  }, [avisos, publicosPermitidos]);

  // Reagrupar avisos filtrados por prioridade
  const groupedFiltrados = useMemo<AvisosGrouped>(() => {
    return {
      urgentes: avisosFiltrados.filter((a) => a.prioridade === 'urgente'),
      normais: avisosFiltrados.filter((a) => a.prioridade === 'normal'),
      infos: avisosFiltrados.filter((a) => a.prioridade === 'info'),
    };
  }, [avisosFiltrados]);

  return {
    avisos: avisosFiltrados,
    grouped: groupedFiltrados,
    loading,
    error,
    recarregar,
    // Metadados adicionais (úteis para debug/analytics)
    perfil: contexto.perfil,
    totalOriginal: avisos.length,
    totalFiltrado: avisosFiltrados.length,
    filtroAtivo: contexto.perfil !== 'anonimo',
  };
}
