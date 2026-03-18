// components/tv/TVUrgentBanner.tsx
'use client';
import { useState, useEffect } from 'react';
import { Aviso } from '@/types';
import { TV_CONFIG } from '@/lib/tv-config';
import { TVUrgentCard } from './TVUrgentCard';

interface TVUrgentBannerProps {
  urgentes: Aviso[];
}

/**
 * Banner de avisos urgentes para modo TV
 * Zona 2: Lógica adaptativa baseada na resolução
 * 
 * Comportamento:
 * - ≤1280px (720p): Carousel (1 item, rotação 8s)
 * - >1280px (1080p+):
 *   - 1 urgente: Exibição única
 *   - 2 urgentes: Grid lado a lado
 *   - 3+ urgentes: Carousel
 */
export function TVUrgentBanner({ urgentes }: TVUrgentBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Detectar largura da janela
  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Auto-rotação do carousel
  useEffect(() => {
    if (!shouldUseCarousel()) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urgentes.length);
    }, TV_CONFIG.carousel.interval);

    return () => clearInterval(interval);
  }, [urgentes.length, windowWidth]);

  // Determina se deve usar carousel
  const shouldUseCarousel = () => {
    if (urgentes.length === 0) return false;
    if (windowWidth <= TV_CONFIG.breakpoints.small) return true; // 720p sempre carousel
    if (urgentes.length >= 3) return true; // 3+ sempre carousel
    return false; // 1 ou 2 urgentes em tela grande: grid
  };

  // Se não há urgentes, não renderiza nada
  if (urgentes.length === 0) return null;

  const useCarousel = shouldUseCarousel();

  return (
    <div 
      className="py-6"
      style={{ 
        zIndex: TV_CONFIG.zIndex.urgents,
        background: 'linear-gradient(to bottom, var(--red-lt), #ffffff)',
        borderBottom: '4px solid var(--red)'
      }}
    >
      <div className="max-w-[2000px] mx-auto px-8">
        {useCarousel ? (
          // Modo Carousel
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {urgentes.map((aviso) => (
                  <div key={aviso.id} className="w-full flex-shrink-0">
                    <TVUrgentCard aviso={aviso} />
                  </div>
                ))}
              </div>
            </div>

            {/* Indicadores de posição (dots) */}
            {TV_CONFIG.carousel.showDots && urgentes.length > 1 && (
              <div className="flex justify-center gap-3 mt-7">
                {urgentes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className="h-4 rounded-full transition-all shadow-md"
                    style={{
                      width: index === currentIndex ? '32px' : '16px',
                      backgroundColor: index === currentIndex ? 'var(--red)' : 'rgba(224, 85, 48, 0.3)'
                    }}
                    aria-label={`Ir para urgente ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : urgentes.length === 1 ? (
          // Modo: 1 urgente em tela grande
          <TVUrgentCard aviso={urgentes[0]} />
        ) : (
          // Modo: 2 urgentes em grid lado a lado
          <div className="grid grid-cols-2 gap-6">
            {urgentes.map((aviso) => (
              <TVUrgentCard key={aviso.id} aviso={aviso} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
