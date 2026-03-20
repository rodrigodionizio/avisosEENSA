// components/ui/PushPromoBanner.tsx
'use client';
import { useState, useEffect } from 'react';
import { PushButton } from './PushButton';
import { Icons } from './Icons';

export function PushPromoBanner() {
  const [dismissed, setDismissed] = useState(true); // Começa true para evitar flash

  useEffect(() => {
    // Verificar se foi dismissed anteriormente
    const isDismissed = localStorage.getItem('push-promo-dismissed') === 'true';
    setDismissed(isDismissed);
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem('push-promo-dismissed', 'true');
    setDismissed(true);
  };

  return (
    <div className="bg-gradient-to-r from-eensa-teal-lt via-[#D0F0F8] to-eensa-green-xlt border-2 border-eensa-teal-border rounded-lg p-4 sm:p-5 mb-6 animate-fade-in shadow-sm">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Ícone */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-eensa-teal rounded-full flex items-center justify-center shadow-md">
            <Icons.Bell size={24} className="text-white" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-extrabold text-sm sm:text-base text-eensa-green mb-1.5">
            📢 Não perca avisos importantes!
          </h3>
          <p className="text-xs sm:text-sm text-eensa-text2 mb-3 leading-relaxed">
            Ative as notificações para receber <strong>alertas instantâneos</strong> de avisos urgentes 
            diretamente no seu celular, mesmo com o app fechado.
          </p>
          
          {/* Benefícios */}
          <div className="flex flex-wrap gap-2 mb-3 text-[10px] sm:text-xs text-eensa-text3">
            <span className="inline-flex items-center gap-1">
              <Icons.Check size={14} className="text-eensa-teal" />
              Notificações instantâneas
            </span>
            <span className="inline-flex items-center gap-1">
              <Icons.Check size={14} className="text-eensa-teal" />
              Funciona offline
            </span>
            <span className="inline-flex items-center gap-1">
              <Icons.Check size={14} className="text-eensa-teal" />
              Nenhum dado pessoal coletado
            </span>
          </div>

          {/* Nota sobre compatibilidade */}
          <p className="text-[10px] sm:text-xs text-eensa-text3 italic mb-3">
            💡 Funciona melhor no <strong>Android Chrome</strong>. iOS Safari requer instalação do PWA.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <PushButton />
            <button
              onClick={handleDismiss}
              className="text-xs sm:text-sm text-eensa-text3 hover:text-eensa-text2 underline transition-colors py-2 sm:py-0"
            >
              Agora não
            </button>
          </div>
        </div>

        {/* Botão Fechar (Desktop) */}
        <button
          onClick={handleDismiss}
          className="hidden sm:flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-lg hover:bg-eensa-surface2 transition-colors"
          title="Dispensar"
        >
          <Icons.X size={16} className="text-eensa-text3" />
        </button>
      </div>
    </div>
  );
}
