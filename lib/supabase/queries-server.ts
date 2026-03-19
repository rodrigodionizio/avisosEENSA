// lib/supabase/queries-server.ts
// Queries específicas para Server Components (SSR)
import { createClient } from './server';
import type { Aviso } from '@/types';

// Helper para logging de erros detalhados
function logSupabaseError(operation: string, error: any) {
  console.group('🚨 Erro Supabase: ' + operation);
  console.error('Código:', error?.code);
  console.error('Mensagem:', error?.message);
  console.error('Detalhes:', error?.details);
  console.error('Hint:', error?.hint);
  console.error('Erro completo:', error);
  console.groupEnd();
}

// ============================================================================
// BUSCA POR SLUG OU ID (URLs Amigáveis + Retrocompatibilidade)
// ============================================================================

/**
 * Retorna aviso por SLUG (preferencial) ou ID (fallback)
 * 
 * Prioriza busca por slug para SEO. Se identifier for numérico, tenta ID.
 * Suporta retrocompatibilidade com URLs antigas (/aviso/1, /aviso/2, etc).
 * 
 * @param identifier - Slug (string) ou ID (number/string numérico)
 * @returns Aviso encontrado ou null
 * 
 * @example
 * getAvisoBySlugOrId("bem-vindos-ao-novo-quadro") // Busca por slug
 * getAvisoBySlugOrId("1") // Busca por ID (retrocompatibilidade)
 * getAvisoBySlugOrId(1) // Busca por ID
 */
export async function getAvisoBySlugOrId(
  identifier: string | number
): Promise<Aviso | null> {
  console.log('📥 getAvisoBySlugOrId(' + identifier + ')');
  
  const supabase = await createClient();
  
  // Estratégia 1: Se for string não-numérica, buscar por slug
  if (typeof identifier === 'string' && !/^\d+$/.test(identifier)) {
    console.log('  → Buscando por slug: ' + identifier);
    
    const { data, error } = await supabase
      .from('avisos')
      .select('*')
      .eq('slug', identifier)
      .single();
    
    if (data) {
      console.log('✅ Aviso encontrado por slug: ' + data.titulo);
      return data as Aviso;
    }
    
    if (error && error.code !== 'PGRST116') {
      logSupabaseError('getAvisoBySlugOrId (slug)', error);
      throw error;
    }
  }
  
  // Estratégia 2: Fallback para busca por ID
  const id = typeof identifier === 'number' ? identifier : parseInt(identifier, 10);
  
  if (!isNaN(id) && id > 0) {
    console.log('  → Fallback: buscando por ID: ' + id);
    return await getAvisoPorId(id);
  }
  
  console.log('❌ Aviso não encontrado: ' + identifier);
  return null;
}

/** 
 * Retorna aviso específico por ID (para página /aviso/[id])
 * Aceita avisos ativos OU inativos (link deve funcionar sempre)
 * 
 * NOTA: Server-side only. Usa createClient() de './server'.
 * Acesso público OK - RLS policy 'prod_select_avisos' permite SELECT anônimo.
 */
export async function getAvisoPorId(id: number): Promise<Aviso | null> {
  console.log('📥 getAvisoPorId(' + id + ') - Buscando aviso...');
  
  // Criar instância server client
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('avisos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found - retorna null ao invés de throw
      console.log('❌ getAvisoPorId(' + id + ') - Aviso não encontrado');
      return null;
    }
    logSupabaseError('getAvisoPorId', error);
    throw error;
  }
  
  console.log('✅ getAvisoPorId(' + id + ') - Aviso carregado: ' + data.titulo);
  return data as Aviso;
}

/**
 * Retorna até 3 avisos ativos para sugestão (excluindo o aviso atual)
 * 
 * NOTA: Server-side only. Usa createClient() de './server'.
 */
export async function getOutrosAvisosAtivos(excludeId: number): Promise<Aviso[]> {
  console.log('📥 getOutrosAvisosAtivos(exclude=' + excludeId + ') - Buscando sugestões...');
  
  // Criar instância server client
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('avisos')
    .select('*')
    .eq('ativo', true)
    .or('expira_em.is.null,expira_em.gte.' + new Date().toISOString())
    .neq('id', excludeId)
    .order('criado_em', { ascending: false })
    .limit(3);

  if (error) {
    logSupabaseError('getOutrosAvisosAtivos', error);
    throw error;
  }
  
  // Reordenar: urgente → normal → info
  const ordem: Record<string, number> = { urgente: 0, normal: 1, info: 2 };
  const outros = (data as Aviso[]).sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
  
  console.log('✅ getOutrosAvisosAtivos() - ' + outros.length + ' avisos encontrados');
  return outros;
}