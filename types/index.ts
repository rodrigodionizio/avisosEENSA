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
}

export interface AvisoFormData {
  titulo: string;
  corpo: string;
  prioridade: Prioridade;
  categoria: Categoria;
  autor: string;
  publica_em?: string;      // Opcional: default NOW() se omitido
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
  expirados: number;
}

export interface TVSettings {
  id: number;
  timer_seconds: number;
  transition_duration: number;
  updated_at?: string;
  updated_by?: string;
}
