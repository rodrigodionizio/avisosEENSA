// components/ui/ConfirmDialog.tsx
'use client';
import { Icons } from './Icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}: ConfirmDialogProps) {
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
  };

  const styles = variantStyles[variant];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-[rgba(26,58,34,0.4)] backdrop-blur-sm z-[600] flex items-center justify-center p-5 animate-[fadeOverlay_0.2s_ease]"
      onClick={onClose}
    >
      <div 
        className="bg-eensa-surface rounded-[20px] p-8 w-full max-w-[460px] shadow-[0_24px_64px_rgba(26,58,34,0.28)] animate-modal-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`w-20 h-20 ${styles.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
          {styles.icon}
        </div>

        {/* Title */}
        <h2 className="font-display font-extrabold text-[21px] text-eensa-green text-center mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-[15px] text-eensa-text2 text-center leading-relaxed mb-7">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 bg-eensa-surface2 border border-eensa-border rounded-xl font-display font-bold text-[14px] text-eensa-text2 cursor-pointer transition-all duration-200 hover:bg-eensa-surface3 hover:border-eensa-green-lt"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-5 py-3 rounded-xl font-display font-bold text-[14px] cursor-pointer transition-all duration-200 ${styles.confirmButton} shadow-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
