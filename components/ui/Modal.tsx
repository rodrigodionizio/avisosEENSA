// components/ui/Modal.tsx
'use client';
import type { ReactNode } from 'react';
import { Icons } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-[rgba(26,58,34,0.32)] backdrop-blur-sm z-[500] flex items-center justify-center p-5 animate-[fadeOverlay_0.2s_ease]"
      onClick={onClose}
    >
      <div 
        className="bg-eensa-surface rounded-[20px] p-7 w-full max-w-[520px] shadow-[0_24px_64px_rgba(26,58,34,0.22)] animate-modal-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display font-extrabold text-[19px] text-eensa-green">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none cursor-pointer bg-eensa-surface2 rounded-lg text-eensa-text2 flex items-center justify-center transition-all duration-150 hover:bg-eensa-green-xlt hover:text-eensa-green"
          >
            <Icons.X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
