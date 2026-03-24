// lib/ip-hash.ts (usado na API Route — server only)
// Nunca armazena o IP bruto do usuário. Apenas hash SHA-256 com salt rotativo diário.

import { createHash } from 'crypto';

/**
 * Gera um hash SHA-256 do IP com salt rotativo diário.
 * Objetivo: registrar contexto sem armazenar dados pessoais identificáveis.
 * O salt muda diariamente, impedindo correlação temporal entre registros.
 */
export function hashIP(ip: string): string {
  // Salt rotativo diário — impede correlação temporal
  const today = new Date().toISOString().slice(0, 10); // "2026-03-24"
  return createHash('sha256')
    .update(ip + today + 'eensa-ip-salt')
    .digest('hex');
}

/**
 * Extrai o IP do cliente considerando proxies (Vercel, Cloudflare etc).
 * Ordem de precedência: x-forwarded-for → x-real-ip → fallback
 */
export function getClientIP(req: Request): string {
  // Ordem de precedência para proxies (Vercel)
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  
  return 'unknown';
}
