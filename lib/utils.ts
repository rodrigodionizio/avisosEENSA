// lib/utils.ts
import type { Aviso, Prioridade } from '@/types';

/** Formata data para pt-BR */export const formatData = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Formata data + hora para pt-BR */
export const formatDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

/** Dias restantes até expiração (negativo = expirado) */
export const diasRestantes = (expira_em: string | null): number | null => {
  if (!expira_em) return null;
  return Math.ceil((new Date(expira_em).getTime() - Date.now()) / 86_400_000);
};

/** Verifica se aviso está expirado */
export const isExpirado = (aviso: Aviso): boolean => {
  if (!aviso.expira_em) return false;
  return new Date(aviso.expira_em) < new Date();
};

/** Labels e cores por prioridade */
export const prioridadeConfig: Record<Prioridade, {
  label: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  barColor: string;
}> = {
  urgente: {
    label: 'Urgente',
    emoji: '🔴',
    bgColor: 'bg-eensa-orange-lt',
    textColor: 'text-[#A04010]',
    borderColor: 'border-eensa-orange-border',
    barColor: 'bg-eensa-orange',
  },
  normal: {
    label: 'Normal',
    emoji: '🔵',
    bgColor: 'bg-eensa-teal-lt',
    textColor: 'text-[#1A7A95]',
    borderColor: 'border-eensa-teal-border',
    barColor: 'bg-eensa-teal',
  },
  info: {
    label: 'Informativo',
    emoji: '🟡',
    bgColor: 'bg-eensa-yellow-lt',
    textColor: 'text-[#8A6A00]',
    borderColor: 'border-eensa-yellow-border',
    barColor: 'bg-eensa-yellow',
  },
};
