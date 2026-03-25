// lib/supabase/professor-confirmacao-queries.ts
// Queries para dashboard de ciência de professores
'use client';

import { createClient } from './client';

// Lista de e-mails de administradores que devem ser excluídos da visualização
const ADMIN_EMAILS = [
  'admin@eensa.com.br',
  'direcao@eensa.com.br',
  'coordenacao@eensa.com.br',
  'rodrigo.dionizio@gmail.com'
];

export interface ProfessorCiencia {
  user_id: string;
  nome_completo: string;
  confirmou: boolean;
  confirmado_em: string | null;
  horario?: string; // Formatado "09:14"
}

/**
 * Busca lista de professores com status de ciência para um aviso específico
 * 
 * Retorna:
 * - Professores que confirmaram (com nome e horário)
 * - Professores pendentes (não confirmaram ainda)
 * 
 * @param avisoId - ID do aviso
 * @returns Lista de professores ordenada (cientes primeiro, depois pendentes)
 */
export async function getProfessoresCiencia(
  avisoId: number
): Promise<ProfessorCiencia[]> {
  const sb = createClient();

  // 1. Buscar todos os professores cadastrados (apenas autenticados)
  const { data: professores, error: profError } = await sb
    .from('leitor_perfis')
    .select('user_id, nome_completo, email')
    .eq('perfil', 'professor')
    .not('user_id', 'is', null); // Apenas autenticados via Google OAuth

  if (profError) {
    console.error('Erro ao buscar professores:', profError);
    throw profError;
  }

  if (!professores || professores.length === 0) {
    return [];
  }

  // 1.1. Filtrar administradores da lista de professores
  const professoresFiltrados = professores.filter(
    (p) => !ADMIN_EMAILS.includes(p.email?.toLowerCase() || '')
  );

  if (professoresFiltrados.length === 0) {
    return [];
  }

  // 2. Buscar confirmações deste aviso (apenas professores autenticados)
  const userIds = professoresFiltrados.map((p) => p.user_id!).filter(Boolean);

  const { data: confirmacoes, error: confError } = await sb
    .from('aviso_confirmacoes')
    .select('user_id, confirmado_em')
    .eq('aviso_id', avisoId)
    .in('user_id', userIds);

  if (confError) {
    console.error('Erro ao buscar confirmações:', confError);
    throw confError;
  }

  // 3. Mapear confirmações (key = user_id)
  const confirmMap = new Map<string, string>();
  confirmacoes?.forEach((c) => {
    if (c.user_id) {
      confirmMap.set(c.user_id, c.confirmado_em);
    }
  });

  // 4. Combinar dados
  const resultado: ProfessorCiencia[] = professoresFiltrados.map((prof) => {
    const confirmadoEm = confirmMap.get(prof.user_id!);
    const confirmou = !!confirmadoEm;

    // Formatar horário "09:14"
    let horario: string | undefined;
    if (confirmadoEm) {
      const date = new Date(confirmadoEm);
      horario = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return {
      user_id: prof.user_id!,
      nome_completo: prof.nome_completo || 'Professor',
      confirmou,
      confirmado_em: confirmadoEm || null,
      horario,
    };
  });

  // 5. Ordenar: confirmados primeiro (por horário), depois pendentes (alfabético)
  resultado.sort((a, b) => {
    if (a.confirmou && !b.confirmou) return -1;
    if (!a.confirmou && b.confirmou) return 1;

    if (a.confirmou && b.confirmou) {
      // Ordenar confirmados por horário (mais antigo primeiro)
      return (a.confirmado_em || '').localeCompare(b.confirmado_em || '');
    }

    // Ordenar pendentes alfabeticamente
    return a.nome_completo.localeCompare(b.nome_completo);
  });

  return resultado;
}

/**
 * Retorna estatísticas resumidas de ciência de um aviso para professores
 * 
 * @param avisoId - ID do aviso
 * @returns Total de professores e quantos confirmaram
 */
export async function getEstatisticasProfessoresCiencia(
  avisoId: number
): Promise<{ total: number; cientes: number; pendentes: number }> {
  const professores = await getProfessoresCiencia(avisoId);

  const cientes = professores.filter((p) => p.confirmou).length;

  return {
    total: professores.length,
    cientes,
    pendentes: professores.length - cientes,
  };
}
