// components/ui/ShareButton.tsx
'use client';
import { useState } from 'react';
import { Button } from './Button';
import { Toast } from './Toast';
import { AlertDialog } from './AlertDialog';

interface ShareButtonProps {
  url: string;
  titulo?: string;
}

export function ShareButton({ url, titulo = 'Aviso EENSA' }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      setShowError(true);
    }
  };
  
  const handleShare = async () => {
    // Web Share API (disponível em mobile e alguns browsers modernos)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          text: `Confira este aviso da EENSA: ${titulo}`,
          url: url,
        });
        console.log('✅ Compartilhado com sucesso via Web Share API');
      } catch (err: any) {
        // User cancelou ou erro
        if (err.name !== 'AbortError') {
          console.error('Erro ao compartilhar:', err);
          // Fallback para copiar
          handleCopy();
        }
      }
    } else {
      // Fallback: copiar para clipboard
      handleCopy();
    }
  };
  
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Button 
          variant="primary" 
          onClick={handleShare}
          className="flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span>Compartilhar Aviso</span>
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={handleCopy}
          className="flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copiar Link</span>
        </Button>
      </div>
      
      {showToast && (
        <Toast 
          message="✅ Link copiado para a área de transferência!" 
          type="success"
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}

      <AlertDialog
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="Erro ao Copiar"
        message="Não foi possível copiar o link. Tente novamente."
        variant="danger"
        confirmText="OK"
      />
    </>
  );
}
