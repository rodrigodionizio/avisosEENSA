// lib/supabase/queries.ts
import { createClient } from './client';
import type { Aviso, AvisoFormData } from '@/types';
import { generateSlug } from '@/lib/utils';

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

/** Retorna todos os avisos ativos, já publicados e não expirados, ordenados por prioridade */
export async function getAvisosAtivos(): Promise<Aviso[]> {
  const now = new Date().toISOString();
  
  const { data, error } = await sb
    .from('avisos')
    .select('*')
    .eq('ativo', true)
    .lte('publica_em', now)  // ✅ Apenas avisos já publicados (agendamento)
    .or(`expira_em.is.null,expira_em.gte.${now}`)
    .order('criado_em', { ascending: false });

  if (error) {
    logSupabaseError('getAvisosAtivos', error);
    throw error;
  }

  // Reordenar: urgente → normal → info
  const ordem: Record<string, number> = { urgente: 0, normal: 1, info: 2 };
  return (data as Aviso[]).sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
}

/** Retorna TODOS os avisos (para o painel admin) */
export async function getTodosAvisos(): Promise<Aviso[]> {
  const { data, error } = await sb
    .from('avisos')
    .select('*')
    .order('criado_em', { ascending: false });
  
  if (error) {
    logSupabaseError('getTodosAvisos', error);
    throw error;
  }
  
  return data as Aviso[];
}

/** Cria novo aviso */
export async function criarAviso(form: AvisoFormData): Promise<Aviso> {
  // Gerar slug automaticamente a partir do título
  const slug = form.slug || generateSlug(form.titulo);
  
  const { data, error } = await sb
    .from('avisos')
    .insert([{ ...form, slug, ativo: true }])
    .select()
    .single();
  if (error) throw error;
  
  const aviso = data as Aviso;
  
  // 🔔 Se for urgente, envia push notification
  if (aviso.prioridade === 'urgente') {
    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avisoId: aviso.id,
          titulo: aviso.titulo,
          corpo: aviso.corpo.slice(0, 120), // Limita para 120 caracteres
        }),
      });
      
      if (!response.ok) {
        console.warn('⚠️ Falha ao enviar push notification:', response.statusText);
      } else {
        const resultado = await response.json();
        console.log(`✅ Push enviado: ${resultado.enviados} notificações`);
      }
    } catch (pushError) {
      // Não bloqueia a criação do aviso se push falhar
      console.error('❌ Erro ao enviar push:', pushError);
    }
  }
  
  return aviso;
}

/** Edita aviso existente */
export async function editarAviso(id: number, form: Partial<AvisoFormData>): Promise<Aviso> {
  // Se o título mudou, regenerar o slug
  const updateData = { ...form };
  if (form.titulo && !form.slug) {
    updateData.slug = generateSlug(form.titulo);
  }
  
  const { data, error} = await sb
    .from('avisos')
    .update(updateData)
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
// NOTA: Funções getAvisoPorId() e getOutrosAvisosAtivos() foram movidas para
// lib/supabase/queries-server.ts para compatibilidade com Server Components.
// Use queries-server.ts em Server Components e API Routes.
