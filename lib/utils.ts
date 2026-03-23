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

// ============================================================================
// SLUG GENERATION (SEO-friendly URLs)
// ============================================================================

/**
 * Gera slug SEO-friendly a partir de um título
 * 
 * @param titulo - Título do aviso
 * @returns Slug formatado (lowercase, sem acentos, hífens)
 * 
 * @example
 * generateSlug("Reunião Importante: Provas Finais (2026)")
 * // => "reuniao-importante-provas-finais-2026"
 */
export function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD') // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, ' ') // Caracteres especiais → espaços
    .trim()
    .replace(/\s+/g, '-') // Espaços → hífens
    .replace(/-+/g, '-') // Múltiplos hífens → único
    .substring(0, 100); // Limitar tamanho (SEO best practice)
}

/**
 * Valida formato de slug
 * 
 * @param slug - String a validar
 * @returns true se o slug for válido
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Gera URL completa para um aviso
 * 
 * @param aviso - Objeto aviso com id e slug
 * @param useSlug - Se true, usa slug; se false, usa ID (padrão: true)
 * @returns URL relativa (/aviso/slug ou /aviso/id)
 */
export function getAvisoUrl(aviso: Aviso, useSlug: boolean = true): string {
  if (useSlug && aviso.slug) {
    return `/aviso/${aviso.slug}`;
  }
  return `/aviso/${aviso.id}`;
}

// ============================================================================
// TV MODE OPTIMIZATION
// ============================================================================

/**
 * Gera preview otimizado para Modo TV
 * 
 * Trunca o corpo do aviso de forma inteligente para o modo TV,
 * cortando no último espaço antes do limite para evitar palavras quebradas.
 * 
 * @param corpo - Texto completo do corpo do aviso
 * @param maxChars - Limite máximo de caracteres (padrão: 280)
 * @returns Texto truncado com "..." ou texto completo se menor que o limite
 * 
 * @example
 * getTVPreview("Lorem ipsum dolor sit amet...", 50)
 * // => "Lorem ipsum dolor sit amet consectetur..."
 * 
 * @remarks
 * - 280 caracteres é o tamanho ideal para modo TV (equivalente ao Twitter)
 * - Garante ~3-4 linhas em 1080p e ~2-3 linhas em 720p
 * - QR code direciona para visualização completa
 */
export function getTVPreview(corpo: string, maxChars: number = 280): string {
  // Se o corpo é menor ou igual ao limite, retorna completo
  if (corpo.length <= maxChars) {
    return corpo;
  }
  
  // Truncar no limite especificado
  const truncated = corpo.substring(0, maxChars);
  
  // Encontrar o último espaço para não cortar palavras
  const lastSpace = truncated.lastIndexOf(' ');
  
  // Se não encontrou espaço (palavra muito longa), usa o limite direto
  if (lastSpace === -1) {
    return truncated + '...';
  }
  
  // Corta no último espaço e adiciona reticências
  return truncated.substring(0, lastSpace) + '...';
}
