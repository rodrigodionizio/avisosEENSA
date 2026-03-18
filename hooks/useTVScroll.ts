// hooks/useTVScroll.ts
'use client';
import { useEffect, useRef, useState } from 'react';
import { TV_CONFIG } from '@/lib/tv-config';

/**
 * Hook para scroll infinito suave usando requestAnimationFrame
 * Quando atinge o final, volta suavemente ao início
 */
export function useTVScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(true);
  const scrollPositionRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isScrolling) return;

    const scroll = () => {
      if (!container) return;

      // Incrementa posição
      scrollPositionRef.current += TV_CONFIG.scroll.speed;

      // Verifica se chegou ao final (com margem de segurança)
      const maxScroll = container.scrollHeight - container.clientHeight;
      
      if (scrollPositionRef.current >= maxScroll) {
        // Volta ao início suavemente
        scrollPositionRef.current = 0;
      }

      // Aplica scroll
      container.scrollTop = scrollPositionRef.current;

      // Continua animação
      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    // Inicia animação
    animationFrameRef.current = requestAnimationFrame(scroll);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScrolling]);

  return {
    containerRef,
    isScrolling,
    toggleScroll: () => setIsScrolling(!isScrolling),
    pauseScroll: () => setIsScrolling(false),
    resumeScroll: () => setIsScrolling(true),
  };
}
