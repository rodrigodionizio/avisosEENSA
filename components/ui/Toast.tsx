// components/ui/Toast.tsx
'use client';
import { useEffect } from 'react';
import { Icons } from './Icons';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-eensa-green' : 'bg-[#C04030]';

  return (
    <div 
      className={`fixed right-7 ${bgColor} text-white rounded-lg px-5 py-[13px] font-display font-bold text-sm shadow-[0_8px_28px_rgba(26,107,46,0.35)] z-[999] flex items-center gap-2 max-w-[340px]`}
      style={{ 
        animation: 'toastIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        bottom: 'max(1.75rem, calc(1.75rem + env(safe-area-inset-bottom)))'
      }}
    >
      <span className="flex-shrink-0">{type === 'success' ? <Icons.Check size={18} /> : <Icons.X size={18} />}</span>
      <span>{message}</span>
    </div>
  );
}
