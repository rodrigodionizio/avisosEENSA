// components/tv/TVSlider.tsx
'use client';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Aviso } from '@/types';
import { Icons } from '@/components/ui/Icons';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { getTVPreview, getAvisoUrl } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';

interface TVSliderProps {
  avisos: Aviso[];
}

export function TVSlider({ avisos }: TVSliderProps) {
  const { timerMs } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-avanço
  useEffect(() => {
    if (avisos.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % avisos.length);
    }, timerMs);

    return () => clearInterval(interval);
  }, [avisos.length, isPaused, timerMs]);

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
  
  // URL para o QR Code (sempre com slug quando disponível)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const avisoUrl = `${baseUrl}${getAvisoUrl(aviso)}`;

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
      {/* Card do Aviso (COMPACTO) */}
      <div className="flex-1 flex items-center justify-center max-w-[1100px] mx-auto w-full">
        <div 
          className={`relative ${bgGradient[aviso.prioridade]} rounded-xl border-2 ${borderColor[aviso.prioridade]} p-5 shadow-2xl w-full transition-all duration-500 animate-fade-in overflow-hidden`}
          style={{ minHeight: '240px', maxHeight: '340px' }}
        >
          {/* Barra colorida esquerda */}
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${barGradient[aviso.prioridade]} rounded-l-xl`} />

          {/* Container de conteúdo com espaço reservado para QR code */}
          <div className="pr-24">
          {/* Badges (versão TV - compacta) */}
          <div className="flex gap-2.5 flex-wrap items-center mb-3 ml-3">
            <span 
              className={`inline-flex items-center gap-1.5 font-display font-bold text-xs lg:text-sm px-4 py-1.5 rounded-full border ${badgeStyles[aviso.prioridade]}`}
            >
              {badgeIcons[aviso.prioridade]} {badgeLabels[aviso.prioridade]}
            </span>
            <span className="inline-block bg-eensa-surface2 text-eensa-text2 rounded-full px-4 py-1.5 text-xs lg:text-sm font-semibold border border-eensa-border font-display">
              {aviso.categoria}
            </span>
          </div>

          {/* Título */}
          <h2 
            className={`font-display font-extrabold text-2xl lg:text-3xl leading-tight mb-3 ml-3 ${titleColor[aviso.prioridade]}`}
          >
            {aviso.titulo}
          </h2>

          {/* Corpo - versão TV otimizada com preview truncado */}
          <div className="text-eensa-text2 text-base lg:text-lg leading-relaxed mb-3 ml-3 line-clamp-4">
            <MarkdownRenderer content={getTVPreview(aviso.corpo, 280)} />
          </div>

          {/* Badge informativo - Ver completo */}
          <div className="flex items-center gap-2 text-xs text-eensa-teal ml-3">
            <Icons.Info size={14} />
            <span className="font-semibold">Escaneie o QR code para ver o aviso completo</span>
          </div>
          </div>
          {/* /Container de conteúdo */}
          
          {/* QR Code discreto no canto inferior direito */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg 
                          shadow-lg p-2.5 border border-eensa-border/60 flex flex-col items-center gap-1.5">
            <QRCodeSVG 
              value={avisoUrl}
              size={64}
              level="M"
              includeMargin={false}
              fgColor="#1A6B2E"
              bgColor="#FFFFFF"
            />
            <div className="text-center">
              <p className="text-[10px] font-bold text-eensa-green uppercase tracking-wide">
                📱 Ver no Celular
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Navegação */}
      {avisos.length > 1 && (
        <>
          {/* Setas */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-eensa-green/90 hover:bg-eensa-green text-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
            aria-label="Anterior"
          >
            <Icons.Arrow size={20} className="rotate-180" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-eensa-green/90 hover:bg-eensa-green text-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
            aria-label="Próximo"
          >
            <Icons.Arrow size={20} />
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
                    width: index === currentIndex ? '28px' : '10px',
                    height: '10px',
                    backgroundColor: index === currentIndex ? 'var(--green)' : 'var(--green-lt)',
                  }}
                  aria-label={`Ir para aviso ${index + 1}`}
                />
              ))}
            </div>
            <div className="text-sm font-bold text-eensa-text3">
              {currentIndex + 1} / {avisos.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
