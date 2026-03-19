// lib/supabase/queries.ts
import { createClient } from './client';
import type { Aviso, AvisoFormData } from '@/types';

const sb = createClient();

// Helper para logging de erros detalhados
function logSupabaseError(operation: string, error: any) {
  console.group(`🚨 Erro Supabase: ${operation}`);
  console.error('Código:', error?.code);
  console.error('Mensagem:', error?.message);
  console.error('Detalhes:', error?.details);
  console.error('Hint:', error?.hint);
  console.error('Erro completo:', error);
  console.groupEnd();
}

/** Retorna todos os avisos ativos e não expirados, ordenados por prioridade */
export async function getAvisosAtivos(): Promise<Aviso[]> {
  console.log('📥 getAvisosAtivos() - Iniciando requisição...');
  
  const { data, error } = await sb
    .from('avisos')
    .select('*')
    .eq('ativo', true)
    .or(`expira_em.is.null,expira_em.gte.${new Date().toISOString()}`)
    .order('criado_em', { ascending: false });

  if (error) {
    logSupabaseError('getAvisosAtivos', error);
    throw error;
  }
  
  console.log(`✅ getAvisosAtivos() - ${data?.length || 0} avisos carregados`);

  // Reordenar: urgente → normal → info
  const ordem: Record<string, number> = { urgente: 0, normal: 1, info: 2 };
  return (data as Aviso[]).sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
}

/** Retorna TODOS os avisos (para o painel admin) */
export async function getTodosAvisos(): Promise<Aviso[]> {
  console.log('📥 getTodosAvisos() - Iniciando requisição...');
  
  const { data, error } = await sb
    .from('avisos')
    .select('*')
    .order('criado_em', { ascending: false });
  
  if (error) {
    logSupabaseError('getTodosAvisos', error);
    throw error;
  }
  
  console.log(`✅ getTodosAvisos() - ${data?.length || 0} avisos carregados`);
  return data as Aviso[];
}

/** Cria novo aviso */
export async function criarAviso(form: AvisoFormData): Promise<Aviso> {
  const { data, error } = await sb
    .from('avisos')
    .insert([{ ...form, ativo: true }])
    .select()
    .single();
  if (error) throw error;
  return data as Aviso;
}

/** Edita aviso existente */
export async function editarAviso(id: number, form: Partial<AvisoFormData>): Promise<Aviso> {
  const { data, error} = await sb
    .from('avisos')
    .update(form)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Aviso;
}

/** Remove aviso permanentemente */
export async function deletarAviso(id: number): Promise<void> {
  const { error } = await sb.from('avisos').delete().eq('id', id);
  if (error) throw error;
}

/** Assina canal real-time de mudanças na tabela avisos */
export function subscribeToAvisos(callback: () => void) {
  return sb
    .channel('avisos-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'avisos',
    }, callback)
    .subscribe();
}

// ============================================================================
// FEATURE 1: LINKS PERMANENTES
// ============================================================================

/** 
 * Retorna aviso específico por ID (para página /aviso/[id])
 * Aceita avisos ativos OU inativos (link deve funcionar sempre)
 */
export async function getAvisoPorId(id: number): Promise<Aviso | null> {
  console.log(`📥 getAvisoPorId(${id}) - Buscando aviso...`);
  
  const { data, error } = await sb
    .from('avisos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found - retorna null ao invés de throw
      console.log(`❌ getAvisoPorId(${id}) - Aviso não encontrado`);
      return null;
    }
    logSupabaseError('getAvisoPorId', error);
    throw error;
  }
  
  console.log(`✅ getAvisoPorId(${id}) - Aviso carregado: ${data.titulo}`);
  return data as Aviso;
}

/**
 * Retorna até 3 avisos ativos para sugestão (excluindo o aviso atual)
 */
export async function getOutrosAvisosAtivos(excludeId: number): Promise<Aviso[]> {
  console.log(`📥 getOutrosAvisosAtivos(exclude=${excludeId}) - Buscando sugestões...`);
  
  const avisos = await getAvisosAtivos();
  const outros = avisos.filter(a => a.id !== excludeId).slice(0, 3);
  
  console.log(`✅ getOutrosAvisosAtivos() - ${outros.length} avisos encontrados`);
  return outros;
}
