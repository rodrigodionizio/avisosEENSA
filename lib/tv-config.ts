// lib/tv-config.ts
/**
 * Configurações do Modo TV
 * Centralize todas as constantes para fácil ajuste
 */

export const TV_CONFIG = {
  // Slider de avisos
  slider: {
    autoPlayInterval: 30000, // 30 segundos (ajustável entre 25000-35000)
    transitionDuration: 500, // duração da transição em ms
    pauseOnHover: false, // TV não tem hover
  },

  // Tipografia (tamanhos para leitura a 3+ metros)
  typography: {
    title: 'text-5xl', // 48px
    body: 'text-3xl', // 30px
    meta: 'text-xl', // 20px
    badge: 'text-lg', // 18px
  },
} as const;
