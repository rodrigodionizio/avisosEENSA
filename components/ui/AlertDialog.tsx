// components/ui/AlertDialog.tsx
'use client';
import { Icons } from './Icons';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

/**
 * Modal de alerta customizado (substitui alert() nativo).
 * Mantém identidade visual EENSA.
 */
export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'OK',
  variant = 'info',
}: AlertDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <Icons.AlertTriangle size={48} className="text-red-500" />,
      iconBg: 'bg-red-50',
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: <Icons.AlertTriangle size={48} className="text-eensa-orange" />,
      iconBg: 'bg-orange-50',
      confirmButton: 'bg-eensa-orange hover:bg-orange-600 text-white',
    },
    info: {
      icon: <Icons.Info size={48} className="text-eensa-teal" />,
      iconBg: 'bg-teal-50',
      confirmButton: 'bg-eensa-teal hover:bg-teal-600 text-white',
    },
    success: {
      icon: <Icons.Check size={48} className="text-eensa-green" />,
      iconBg: 'bg-green-50',
      confirmButton: 'bg-eensa-green hover:bg-eensa-green-dk text-white',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Ícone */}
        <div className={`flex justify-center pt-6 pb-4 ${styles.iconBg}`}>
          {styles.icon}
        </div>

        {/* Conteúdo */}
        <div className="px-6 pb-4 pt-2">
          <h3 className="font-display font-bold text-lg text-eensa-text mb-2 text-center">
            {title}
          </h3>
          <p className="text-eensa-text2 text-sm leading-relaxed text-center">
            {message}
          </p>
        </div>

        {/* Botão */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className={`w-full px-4 py-2.5 rounded-lg font-display font-bold text-sm transition-all ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
