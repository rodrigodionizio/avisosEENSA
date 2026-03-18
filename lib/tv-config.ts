// lib/tv-config.ts
/**
 * Configurações do Modo TV
 * Centralize todas as constantes para fácil ajuste
 */

export const TV_CONFIG = {
  // Scroll automático
  scroll: {
    speed: 0.5, // pixels por frame (ajustar conforme necessário)
    pauseOnHover: false, // TV não tem hover, sempre false
    smoothness: 60, // FPS target para requestAnimationFrame
  },

  // Carousel de urgentes
  carousel: {
    interval: 8000, // 8 segundos por slide
    autoPlay: true,
    showDots: true,
  },

  // Layout responsivo
  breakpoints: {
    small: 1280, // ≤1280px = 720p (carousel forçado)
    large: 1920, // ≥1920px = 1080p+ (grid permitido)
  },

  // Z-index hierarchy (nunca alterar sem revisar toda estrutura)
  zIndex: {
    topBar: 100,
    header: 20,
    fades: 15,
    urgents: 5,
    cards: 1,
  },

  // Tipografia (tamanhos para leitura a 3+ metros)
  typography: {
    topBar: {
      logo: 'text-3xl', // 30px
      date: 'text-xl',  // 20px
      clock: 'text-2xl', // 24px
    },
    header: {
      title: 'text-2xl', // 24px
    },
    urgents: {
      title: 'text-3xl font-bold', // 30px bold
      description: 'text-xl', // 20px
    },
    cards: {
      title: 'text-2xl font-semibold', // 24px semibold
      description: 'text-lg', // 18px
      meta: 'text-base', // 16px
    },
  },

  // Cores e opacidades
  colors: {
    backdropBlur: 'backdrop-blur-md', // blur do header sticky
    fadeGradient: 'from-transparent via-white/95 to-white', // fade bottom
  },
} as const;
