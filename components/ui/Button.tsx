// components/ui/Button.tsx
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  icon?: boolean;
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  icon = false,
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-display font-bold inline-flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all duration-200 leading-none';
  
  const variantClasses = {
    primary: 'bg-eensa-green text-white hover:bg-eensa-green-mid hover:-translate-y-px hover:shadow-md active:translate-y-0',
    secondary: 'bg-eensa-surface2 text-eensa-green border-[1.5px] border-eensa-border hover:bg-eensa-green-xlt',
    danger: 'bg-eensa-red-lt text-eensa-red border-[1.5px] border-[#f5c5b8] hover:bg-[#fde5df]',
    ghost: 'bg-transparent text-eensa-text2 hover:bg-eensa-surface2 hover:text-eensa-green',
  };

  const sizeClasses = icon 
    ? 'min-w-[48px] min-h-[48px] text-[15px] rounded-lg'
    : size === 'sm' 
      ? 'text-xs px-[11px] py-2.5 rounded-md min-h-[44px]' 
      : 'text-[13px] px-4 py-2.5 rounded-lg min-h-[48px]';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonTVProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ButtonTV({ children, className = '', ...props }: ButtonTVProps) {
  return (
    <button
      className={`bg-eensa-green text-white/90 border-none rounded-full px-4 py-2.5 font-display font-bold text-xs cursor-pointer transition-all duration-200 hover:bg-eensa-green-mid hover:-translate-y-px min-h-[44px] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonNewProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ButtonNew({ children, className = '', ...props }: ButtonNewProps) {
  return (
    <button
      className={`bg-eensa-green text-white border-none rounded-lg px-[18px] py-2.5 font-display font-bold text-[13px] cursor-pointer inline-flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:bg-eensa-green-mid hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(26,107,46,0.25)] min-h-[48px] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
