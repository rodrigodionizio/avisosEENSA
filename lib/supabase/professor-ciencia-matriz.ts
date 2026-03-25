import { createClient } from './client';

// Lista de e-mails de administradores que devem ser excluídos da visualização
const ADMIN_EMAILS = [
  'admin@eensa.com.br',
  'direcao@eensa.com.br',
  'coordenacao@eensa.com.br',
  'rodrigo.dionizio@gmail.com'
];

export interface ProfessorMatriz {
  user_id: string;
  nome_completo: string;
  email: string;
}

export interface AvisoMatriz {
  aviso_id: string;
  titulo: string;
  titulo_abreviado: string;
}

export interface ConfirmacaoMatriz {
  confirmou: boolean;
  horario: string | null;
}

export interface MatrizCiencia {
  professores: ProfessorMatriz[];
  avisos: AvisoMatriz[];
  confirmacoes: Map<string, Map<string, ConfirmacaoMatriz>>; // user_id -> (aviso_id -> confirmacao)
}

/**
 * Abrevia título de aviso para caber no cabeçalho da tabela
 * - 1 palavra: truncar em 15 caracteres
 * - 2 palavras: "PALAVRA. PALAVRA"
 * - 3+ palavras: "PAL. PALAVRA. PALAVRA"
 */
export function abreviarTitulo(titulo: string): string {
  const palavras = titulo.trim().split(/\s+/);
  
  if (palavras.length === 1) {
    return titulo.length > 15 ? titulo.substring(0, 15) + '...' : titulo.toUpperCase();
  }
  
  if (palavras.length === 2) {
    return `${palavras[0].toUpperCase()}. ${palavras[1].toUpperCase()}`;
  }
  
  // 3+ palavras: abrevia a primeira, mantém as outras
  const primeira = palavras[0].substring(0, 3).toUpperCase();
  const resto = palavras.slice(1).map(p => p.toUpperCase()).join('. ');
  return `${primeira}. ${resto}`;
}

/**
 * Busca matriz de ciência: professores (linhas) × avisos (colunas)
 * Retorna professores não-admin, avisos dos últimos 30 dias com publico_alvo=['professores'],
 * e mapa de confirmações
 */
export async function getMatrizCienciaProfessores(): Promise<MatrizCiencia> {
  const supabase = createClient();
  
  // 1. Buscar avisos dos últimos 30 dias que exigem ciência de professores
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - 30);
  
  const { data: avisos, error: avisosError } = await supabase
    .from('avisos')
    .select('id, titulo, criado_em')
    .contains('publico_alvo', ['professores'])
    .eq('ativo', true)
    .gte('publica_em', dataLimite.toISOString())
    .order('criado_em', { ascending: false })
    .limit(10);
  
  if (avisosError) {
    console.error('Erro ao buscar avisos:', avisosError);
    return { professores: [], avisos: [], confirmacoes: new Map() };
  }
  
  if (!avisos || avisos.length === 0) {
    return { professores: [], avisos: [], confirmacoes: new Map() };
  }
  
  // 2. Buscar todos os professores (exceto admins)
  const { data: professoresData, error: professoresError } = await supabase
    .from('leitor_perfis')
    .select('user_id, nome_completo, email')
    .eq('perfil', 'professor')
    .order('nome_completo');
  
  if (professoresError) {
    console.error('Erro ao buscar professores:', professoresError);
    return { professores: [], avisos: [], confirmacoes: new Map() };
  }
  
  // Filtrar admins
  const professoresFiltrados = (professoresData || []).filter(
    (p) => !ADMIN_EMAILS.includes(p.email?.toLowerCase() || '')
  );
  
  // 3. Buscar todas as confirmações para esses avisos
  const avisosIds = avisos.map(a => a.id);
  
  const { data: confirmacoesData, error: confirmacoesError } = await supabase
    .from('aviso_confirmacoes')
    .select('user_id, aviso_id, confirmado_em')
    .in('aviso_id', avisosIds);
  
  if (confirmacoesError) {
    console.error('Erro ao buscar confirmações:', confirmacoesError);
  }
  
  // 4. Construir mapa de confirmações: user_id -> (aviso_id -> {confirmou, horario})
  const mapaConfirmacoes = new Map<string, Map<string, ConfirmacaoMatriz>>();
  
  professoresFiltrados.forEach(prof => {
    mapaConfirmacoes.set(prof.user_id, new Map());
  });
  
  (confirmacoesData || []).forEach(conf => {
    if (mapaConfirmacoes.has(conf.user_id)) {
      const userMap = mapaConfirmacoes.get(conf.user_id)!;
      userMap.set(conf.aviso_id, {
        confirmou: true,
        horario: conf.confirmado_em
      });
    }
  });
  
  // 5. Preparar dados de saída
  const professores: ProfessorMatriz[] = professoresFiltrados.map(p => ({
    user_id: p.user_id,
    nome_completo: p.nome_completo || 'Nome não informado',
    email: p.email || ''
  }));
  
  const avisosMatriz: AvisoMatriz[] = avisos.map(a => ({
    aviso_id: a.id,
    titulo: a.titulo,
    titulo_abreviado: abreviarTitulo(a.titulo)
  }));
  
  return {
    professores,
    avisos: avisosMatriz,
    confirmacoes: mapaConfirmacoes
  };
}
