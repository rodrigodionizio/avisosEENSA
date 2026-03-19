// components/tv/TVSlider.tsx
'use client';
import { useState, useEffect } from 'react';
import { Aviso } from '@/types';
import { Icons } from '@/components/ui/Icons';
import { formatDataHora } from '@/lib/utils';

interface TVSliderProps {
  avisos: Aviso[];
}

const TIMER_INTERVAL = 30000; // 30 segundos

export function TVSlider({ avisos }: TVSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-avanço
  useEffect(() => {
    if (avisos.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % avisos.length);
    }, TIMER_INTERVAL);

    return () => clearInterval(interval);
  }, [avisos.length, isPaused]);

  // Navegação manual
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % avisos.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + avisos.length) % avisos.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  if (avisos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-3xl text-eensa-text3 font-semibold">
          Nenhum comunicado disponível no momento.
        </p>
      </div>
    );
  }

  const aviso = avisos[currentIndex];

  // Estilos por prioridade (identidade visual original)
  const bgGradient = {
    urgente: 'bg-gradient-to-br from-[#FFFAF5] to-eensa-orange-lt',
    normal: 'bg-gradient-to-br from-[#FAFEFF] to-[#F0FAFD]',
    info: 'bg-gradient-to-br from-[#FFFEF5] to-eensa-yellow-lt',
  };

  const borderColor = {
    urgente: 'border-eensa-orange-border',
    normal: 'border-eensa-teal-border',
    info: 'border-eensa-yellow-border',
  };

  const barGradient = {
    urgente: 'bg-gradient-to-b from-eensa-orange to-eensa-red',
    normal: 'bg-eensa-teal',
    info: 'bg-eensa-yellow',
  };

  const titleColor = {
    urgente: 'text-[#8A3208]',
    normal: 'text-eensa-text',
    info: 'text-eensa-text',
  };

  // Badge styles (versão maior para TV)
  const badgeStyles = {
    urgente: 'bg-eensa-orange-lt text-[#A04010] border-eensa-orange-border',
    normal: 'bg-eensa-teal-lt text-[#1A7A95] border-eensa-teal-border',
    info: 'bg-eensa-yellow-lt text-[#8A6A00] border-eensa-yellow-border',
  };

  const badgeIcons = {
    urgente: <Icons.Urgent size={20} />,
    normal: <Icons.Normal size={20} />,
    info: <Icons.Info size={20} />,
  };

  const badgeLabels = {
    urgente: 'Urgente',
    normal: 'Normal',
    info: 'Informativo',
  };

  return (
    <div className="flex-1 flex flex-col p-8 relative">
      {/* Card do Aviso (GRANDE) */}
      <div className="flex-1 flex items-center justify-center max-w-[1400px] mx-auto w-full">
        <div 
          className={`relative ${bgGradient[aviso.prioridade]} rounded-2xl border-[3px] ${borderColor[aviso.prioridade]} p-12 shadow-2xl w-full transition-all duration-500 animate-fade-in overflow-hidden`}
          style={{ minHeight: '500px' }}
        >
          {/* Barra colorida esquerda */}
          <div className={`absolute left-0 top-0 bottom-0 w-3 ${barGradient[aviso.prioridade]} rounded-l-2xl`} />

          {/* Badges (versão TV - maior) */}
          <div className="flex gap-3 flex-wrap items-center mb-6 ml-4">
            <span 
              className={`inline-flex items-center gap-2 font-display font-bold text-lg px-5 py-2 rounded-full border ${badgeStyles[aviso.prioridade]}`}
            >
              {badgeIcons[aviso.prioridade]} {badgeLabels[aviso.prioridade]}
            </span>
            <span className="inline-block bg-eensa-surface2 text-eensa-text2 rounded-full px-5 py-2 text-lg font-semibold border border-eensa-border font-display">
              {aviso.categoria}
            </span>
          </div>

          {/* Título */}
          <h2 
            className={`font-display font-extrabold text-5xl leading-tight mb-6 ml-4 ${titleColor[aviso.prioridade]}`}
          >
            {aviso.titulo}
          </h2>

          {/* Corpo */}
          <p className="text-eensa-text2 text-3xl leading-relaxed mb-8 ml-4">
            {aviso.corpo}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-8 text-xl text-eensa-text3 ml-4">
            <span className="flex items-center gap-3">
              <Icons.User size={24} className="opacity-70" /> {aviso.autor}
            </span>
            <span className="flex items-center gap-3">
              <Icons.Clock size={24} className="opacity-70" /> {formatDataHora(aviso.criado_em)}
            </span>
          </div>
        </div>
      </div>

      {/* Controles de Navegação */}
      {avisos.length > 1 && (
        <>
          {/* Setas */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-eensa-green/90 hover:bg-eensa-green text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
            aria-label="Anterior"
          >
            <Icons.Arrow size={32} className="rotate-180" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-eensa-green/90 hover:bg-eensa-green text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
            aria-label="Próximo"
          >
            <Icons.Arrow size={32} />
          </button>

          {/* Dots + Contador */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-3">
              {avisos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className="rounded-full transition-all hover:scale-110"
                  style={{
                    width: index === currentIndex ? '48px' : '16px',
                    height: '16px',
                    backgroundColor: index === currentIndex ? 'var(--green)' : 'var(--green-lt)',
                  }}
                  aria-label={`Ir para aviso ${index + 1}`}
                />
              ))}
            </div>
            <div className="text-2xl font-bold text-eensa-text3">
              {currentIndex + 1} / {avisos.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
