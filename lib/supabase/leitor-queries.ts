// lib/supabase/leitor-queries.ts
// Queries relacionadas à tabela leitor_perfis (identificação de leitores)

import { createClient } from './client';
import type { LeitorPerfil, PerfilLeitor } from '@/types';

const sb = createClient();

/**
 * Busca o perfil de um leitor pelo device hash
 * 
 * @param deviceHash - Hash único do dispositivo
 * @returns Perfil do leitor ou null se não encontrado
 */
export async function getPerfilByDeviceHash(
  deviceHash: string
): Promise<LeitorPerfil | null> {
  const { data, error } = await sb
    .from('leitor_perfis')
    .select('*')
    .eq('device_hash', deviceHash)
    .single();

  if (error) {
    // Not found é esperado para novos dispositivos
    if (error.code === 'PGRST116') return null;
    console.error('Erro ao buscar perfil do leitor:', error);
    throw error;
  }

  return data;
}

/**
 * Registra ou atualiza o perfil de um leitor
 * Usa upsert para evitar duplicatas (constraint UNIQUE no device_hash)
 * 
 * @param data - Dados do perfil a ser persistido
 */
export async function upsertPerfilLeitor(data: {
  device_hash: string;
  perfil: PerfilLeitor;
  user_id?: string | null;
  nome_completo?: string | null;
  email?: string | null;
  user_agent?: string;
}): Promise<void> {
  const { error } = await sb
    .from('leitor_perfis')
    .upsert(
      {
        device_hash: data.device_hash,
        perfil: data.perfil,
        user_id: data.user_id ?? null,
        nome_completo: data.nome_completo ?? null,
        email: data.email ?? null,
        user_agent: data.user_agent ?? null,
      },
      {
        onConflict: 'device_hash', // Atualiza se device_hash já existir
      }
    );

  if (error) {
    console.error('Erro ao registrar perfil do leitor:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }
}

/**
 * Remove o perfil de um leitor (usado no logout ou reset)
 * 
 * @param deviceHash - Hash do dispositivo a ser removido
 */
export async function removerPerfilLeitor(deviceHash: string): Promise<void> {
  const { error } = await sb
    .from('leitor_perfis')
    .delete()
    .eq('device_hash', deviceHash);

  if (error) {
    console.error('Erro ao remover perfil do leitor:', error);
    throw error;
  }
}

/**
 * Busca todos os perfis vinculados a um user_id (útil para admin)
 * Um professor pode ter múltiplos devices (computador, celular, etc)
 * 
 * @param userId - UUID do usuário autenticado
 * @returns Array de perfis vinculados ao usuário
 */
export async function getPerfisByUserId(
  userId: string
): Promise<LeitorPerfil[]> {
  const { data, error } = await sb
    .from('leitor_perfis')
    .select('*')
    .eq('user_id', userId)
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('Erro ao buscar perfis do usuário:', error);
    throw error;
  }

  return data || [];
}

/**
 * Retorna estatísticas de perfis (para dashboard admin)
 * Usa a view leitor_perfis_stats se disponível, ou calcula manualmente
 * 
 * @returns Distribuição de perfis e contadores
 */
export async function getEstatisticasPerfis(): Promise<{
  total: number;
  professores: number;
  pais: number;
  alunos: number;
  anonimos: number;
  comGoogleAuth: number;
  ultimos7Dias: number;
}> {
  // Tentar usar a view otimizada primeiro
  const { data: statsView, error: viewError } = await sb
    .from('leitor_perfis_stats')
    .select('*');

  if (!viewError && statsView && statsView.length > 0) {
    // View existe e tem dados, processar resultado
    const stats = {
      total: 0,
      professores: 0,
      pais: 0,
      alunos: 0,
      anonimos: 0,
      comGoogleAuth: 0,
      ultimos7Dias: 0,
    };

    for (const row of statsView) {
      stats.total += row.total_devices || 0;
      stats.comGoogleAuth += row.com_google_auth || 0;
      stats.ultimos7Dias += row.novos_7d || 0;

      if (row.perfil === 'professor') stats.professores = row.total_devices || 0;
      if (row.perfil === 'pai') stats.pais = row.total_devices || 0;
      if (row.perfil === 'aluno') stats.alunos = row.total_devices || 0;
      if (row.perfil === 'anonimo') stats.anonimos = row.total_devices || 0;
    }

    return stats;
  }

  // Fallback: calcular manualmente
  const { data, error } = await sb.from('leitor_perfis').select('*');

  if (error) {
    console.error('Erro ao buscar estatísticas de perfis:', error);
    throw error;
  }

  const now = new Date();
  const sete_dias_atras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const stats = {
    total: data?.length || 0,
    professores: data?.filter((p) => p.perfil === 'professor').length || 0,
    pais: data?.filter((p) => p.perfil === 'pai').length || 0,
    alunos: data?.filter((p) => p.perfil === 'aluno').length || 0,
    anonimos: data?.filter((p) => p.perfil === 'anonimo').length || 0,
    comGoogleAuth: data?.filter((p) => p.user_id !== null).length || 0,
    ultimos7Dias:
      data?.filter((p) => new Date(p.criado_em) > sete_dias_atras).length || 0,
  };

  return stats;
}

/**
 * Retorna estatísticas detalhadas de segmentação para o dashboard admin
 * Combina dados de leitor_perfis com avisos_confirmacoes e avisos
 * 
 * @returns Métricas de visualizações, alcance por perfil, e ciência
 */
export async function getEstatisticasSegmentacao(): Promise<{
  visualizacoes_totais: number;
  professores_logados: number;
  pais_identificados: number;
  alunos_identificados: number;
  alcance_por_perfil: {
    professores: number; // % de professores que visualizaram
    pais: number;
    alunos: number;
  };
  ciencia_conselho_classe: {
    total_destinatarios: number;
    confirmaram: number;
    pendentes: number;
    percentual: number;
  };
}> {
  try {
    // 1. Buscar estatísticas de perfis
    const perfisStats = await getEstatisticasPerfis();
    
    // 2. Buscar total de confirmações ÚNICAS por professor
    // CORREÇÃO: Contar professores únicos, não total de confirmações
    const { data: professoresUnicos } = await sb
      .from('aviso_confirmacoes')
      .select('user_id')
      .not('user_id', 'is', null); // Apenas autenticados (professores)
    
    // Contar user_ids únicos
    const professoresQueConfirmaram = new Set(
      professoresUnicos?.map(p => p.user_id) || []
    ).size;
    
    // 3. Buscar aviso "Conselho de Classe" (exemplo de ciência específica)
    // TODO: Implementar query específica quando tivermos avisos com público-alvo 'professores'
    const { data: avisoConselho } = await sb
      .from('avisos')
      .select('id, publico_alvo')
      .ilike('titulo', '%conselho%classe%')
      .limit(1)
      .maybeSingle();
    
    let cienciaConselho = {
      total_destinatarios: 0,
      confirmaram: 0,
      pendentes: 0,
      percentual: 0,
    };
    
    if (avisoConselho) {
      // Contar professores ÚNICOS que confirmaram este aviso específico
      const { data: confirmacoesUnicas } = await sb
        .from('aviso_confirmacoes')
        .select('user_id')
        .eq('aviso_id', avisoConselho.id)
        .not('user_id', 'is', null);
      
      const professoresConfirmaram = new Set(
        confirmacoesUnicas?.map(c => c.user_id) || []
      ).size;
      
      cienciaConselho = {
        total_destinatarios: perfisStats.professores,
        confirmaram: professoresConfirmaram,
        pendentes: Math.max(0, perfisStats.professores - professoresConfirmaram),
        percentual: perfisStats.professores > 0 
          ? Math.round(professoresConfirmaram / perfisStats.professores * 100)
          : 0,
      };
    }
    
    // 4. Calcular alcance (visualizações / total de perfis identificados)
    const totalIdentificados = perfisStats.professores + perfisStats.pais + perfisStats.alunos;
    
    return {
      visualizacoes_totais: professoresQueConfirmaram,
      professores_logados: perfisStats.professores,
      pais_identificados: perfisStats.pais,
      alunos_identificados: perfisStats.alunos,
      alcance_por_perfil: {
        professores: perfisStats.professores > 0 
          ? Math.round((perfisStats.professores / totalIdentificados) * 100) 
          : 0,
        pais: perfisStats.pais > 0 
          ? Math.round((perfisStats.pais / totalIdentificados) * 100) 
          : 0,
        alunos: perfisStats.alunos > 0 
          ? Math.round((perfisStats.alunos / totalIdentificados) * 100) 
          : 0,
      },
      ciencia_conselho_classe: cienciaConselho,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas de segmentação:', error);
    // Retornar valores zerados em caso de erro
    return {
      visualizacoes_totais: 0,
      professores_logados: 0,
      pais_identificados: 0,
      alunos_identificados: 0,
      alcance_por_perfil: {
        professores: 0,
        pais: 0,
        alunos: 0,
      },
      ciencia_conselho_classe: {
        total_destinatarios: 0,
        confirmaram: 0,
        pendentes: 0,
        percentual: 0,
      },
    };
  }
}
