// lib/device-fingerprint.ts
// Gera um hash SHA-256 de propriedades do dispositivo.
// Não armazena dados pessoais. O hash não pode ser revertido.
// Objetivo: prevenir duplicatas por dispositivo, não identificar pessoas.

/**
 * Gera um hash único baseado em características do dispositivo.
 * Este hash é usado para identificar o dispositivo (não a pessoa) e prevenir
 * confirmações duplicadas do mesmo device.
 */
export async function getDeviceHash(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth.toString(),
    screen.width.toString(),
    screen.height.toString(),
    new Date().getTimezoneOffset().toString(),
    // Salt estático por deploy — impede correlação entre projetos
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.slice(0, 16) ?? 'eensa-salt',
  ].join('|');

  const encoder = new TextEncoder();
  const data = encoder.encode(components);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Versão com cache em sessionStorage (evita recalcular a cada render).
 * O cache dura apenas a sessão do navegador (até fechar a aba).
 */
export async function getDeviceHashCached(): Promise<string> {
  const KEY = '__eensa_dh__';
  
  // Verifica se está no browser (SSR safe)
  if (typeof window === 'undefined') {
    return getDeviceHash();
  }
  
  const cached = sessionStorage.getItem(KEY);
  if (cached) return cached;

  const hash = await getDeviceHash();
  sessionStorage.setItem(KEY, hash);
  return hash;
}
