// types/index.ts - Tipos TypeScript do sistema EENSA

export type Prioridade = 'urgente' | 'normal' | 'info';

export type Categoria =
  | 'Geral'
  | 'Reunião'
  | 'Avaliações'
  | 'Esportes'
  | 'Evento'
  | 'Cultura'
  | 'Regra'
  | 'Informativo';

// ── Segmentação de Público ───────────────────────────────────────────────────

export type PublicoAlvo = 'todos' | 'professores' | 'pais' | 'alunos';

export type PerfilLeitor = 'professor' | 'pai' | 'aluno' | 'anonimo';

export interface Aviso {
  id: number;
  titulo: string;
  corpo: string;
  prioridade: Prioridade;
  categoria: Categoria;
  autor: string;
  criado_em: string;        // ISO 8601
  publica_em: string;       // ISO 8601 — data/hora de publicação (agendamento)
  expira_em: string | null; // ISO 8601 — null = não expira
  ativo: boolean;
  slug: string;             // URL amigável (SEO slug)
  publico_alvo: PublicoAlvo[];  // Perfis que devem visualizar este aviso
  turmas: string[] | null;      // Turmas específicas (null = todas)
}

export interface AvisoFormData {
  titulo: string;
  corpo: string;
  prioridade: Prioridade;
  categoria: Categoria;
  autor: string;
  publica_em?: string;      // Opcional: default NOW() se omitido
  publico_alvo: PublicoAlvo[];  // Perfis que devem visualizar este aviso
  turmas: string[] | null;      // Turmas específicas (null = todas)
  expira_em: string | null;
  slug?: string;            // Opcional: gerado automaticamente se omitido
}

export interface AvisosGrouped {
  urgentes: Aviso[];
  normais: Aviso[];
  infos: Aviso[];
}

export interface StatsData {
  total: number;
  ativos: number;
  urgentes: number;
  agendados: number;
  expirados: number;
}

export interface TVSettings {
  id: number;
  timer_seconds: number;
  transition_duration: number;
  updated_at?: string;
  updated_by?: string;
}

// ── Confirmação de Leitura ───────────────────────────────────────────────────

export interface AvisoConfirmacao {
  id: number;
  aviso_id: number;
  user_id: string | null;
  device_hash: string;
  display_name: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  origem: 'web' | 'push' | 'tv' | 'qrcode';
  confirmado_em: string;
}

export interface AvisoConfirmacaoStats {
  aviso_id: number;
  total_confirmacoes: number;
  confirmacoes_autenticadas: number;
  confirmacoes_anonimas: number;
  via_push: number;
  via_qrcode: number;
  via_tv: number;
  primeira_confirmacao: string | null;
  ultima_confirmacao: string | null;
}


// ── Perfis de Leitores ───────────────────────────────────────────────────────

export interface LeitorPerfil {
  id: number;
  device_hash: string;
  perfil: PerfilLeitor;
  user_id: string | null;
  nome_completo: string | null;
  email: string | null;
  user_agent: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface ContextoLeitor {
  perfil: PerfilLeitor;
  deviceHash: string;
  nomeCompleto: string | null;
  email: string | null;
  userId: string | null;
  jaIdentificado: boolean;  // true se perfil foi selecionado (não-anônimo)
}
export interface ConfirmacaoStatus {
  jaConfirmou: boolean;
  confirmado_em: string | null;
}
