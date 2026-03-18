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
  expira_em: string | null; // ISO 8601 — null = não expira
  ativo: boolean;
}

export interface AvisoFormData {
  titulo: string;
  corpo: string;
  prioridade: Prioridade;
  categoria: Categoria;
  autor: string;
  expira_em: string | null;
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
