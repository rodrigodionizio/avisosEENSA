// components/admin/TVSettingsForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { updateTVSettings } from '@/lib/supabase/settings-queries';
import { useAuth } from '@/hooks/useAuth';
import type { TVSettings } from '@/types';

interface TVSettingsFormProps {
  currentSettings: TVSettings;
  onClose: () => void;
  onSave: () => void;
  isOpen: boolean;
  embedded?: boolean; // Se true, renderiza sem Modal wrapper
}

export function TVSettingsForm({ currentSettings, onClose, onSave, isOpen, embedded = false }: TVSettingsFormProps) {
  const { usuario } = useAuth();
  const [timerSeconds, setTimerSeconds] = useState(20);
  const [transitionDuration, setTransitionDuration] = useState(500);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTimerSeconds(currentSettings.timer_seconds);
    setTransitionDuration(currentSettings.transition_duration);
  }, [currentSettings]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (timerSeconds < 15 || timerSeconds > 35) {
      newErrors.timer = 'Timer deve estar entre 15 e 35 segundos';
    }
    if (transitionDuration < 300 || transitionDuration > 1000) {
      newErrors.transition = 'Transição deve estar entre 300 e 1000 ms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);
    try {
      await updateTVSettings(timerSeconds, transitionDuration, usuario?.email);
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setErrors({ submit: 'Erro ao salvar. Tente novamente.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTimerSeconds(20);
    setTransitionDuration(500);
    setErrors({});
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Timer do Slider */}
      <div>
        <label className="block text-sm font-semibold text-eensa-text mb-2">
          Tempo por Aviso (segundos)
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="15"
            max="35"
            step="1"
            value={timerSeconds}
            onChange={(e) => setTimerSeconds(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-eensa-teal"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-eensa-text3">15s (rápido)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="15"
                max="35"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(Number(e.target.value))}
                className="w-16 px-2 py-1 text-center border border-eensa-border rounded-md text-sm font-semibold text-eensa-text"
              />
              <span className="text-sm text-eensa-text3">segundos</span>
            </div>
            <span className="text-xs text-eensa-text3">35s (lento)</span>
          </div>
        </div>
        {errors.timer && (
          <p className="mt-1 text-xs text-red-600">{errors.timer}</p>
        )}
        <p className="mt-2 text-xs text-eensa-text3">
          Define quanto tempo cada aviso permanece na tela antes de avançar automaticamente.
        </p>
      </div>

      {/* Duração da Transição */}
      <div>
        <label className="block text-sm font-semibold text-eensa-text mb-2">
          Velocidade da Transição (milissegundos)
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="300"
            max="1000"
            step="50"
            value={transitionDuration}
            onChange={(e) => setTransitionDuration(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-eensa-teal"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-eensa-text3">300ms (rápida)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="300"
                max="1000"
                step="50"
                value={transitionDuration}
                onChange={(e) => setTransitionDuration(Number(e.target.value))}
                className="w-20 px-2 py-1 text-center border border-eensa-border rounded-md text-sm font-semibold text-eensa-text"
              />
              <span className="text-sm text-eensa-text3">ms</span>
            </div>
            <span className="text-xs text-eensa-text3">1000ms (suave)</span>
          </div>
        </div>
        {errors.transition && (
          <p className="mt-1 text-xs text-red-600">{errors.transition}</p>
        )}
        <p className="mt-2 text-xs text-eensa-text3">
          Define a velocidade da animação ao trocar entre avisos.
        </p>
      </div>

      {/* Erro de submit */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Preview */}
      <div className="bg-eensa-bg border border-eensa-border rounded-lg p-4">
        <p className="text-xs font-semibold text-eensa-text3 mb-2">PREVIEW:</p>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-eensa-text3">Troca:</span>
            <span className="font-bold text-eensa-teal">{timerSeconds}s</span>
          </div>
          <span className="text-eensa-text3">•</span>
          <div className="flex items-center gap-2">
            <span className="text-eensa-text3">Transição:</span>
            <span className="font-bold text-eensa-teal">{transitionDuration}ms</span>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          onClick={handleReset}
          variant="secondary"
          disabled={submitting}
        >
          🔄 Restaurar Padrão
        </Button>
        
        <div className="flex gap-3">
          {!embedded && (
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={submitting}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : '✓ Salvar Configurações'}
          </Button>
        </div>
      </div>
    </form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Configurações Modo TV">
      {formContent}
    </Modal>
  );
}
