// components/layout/Header.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { EensaLogo } from '@/components/ui/Logo';
import { Icons } from '@/components/ui/Icons';

export function Header() {
  const pathname = usePathname();
  const { logado, logout } = useAuth();

  return (
    <header className="bg-eensa-surface border-b-2 border-eensa-border px-7 flex items-center justify-between h-[68px] sticky top-0 z-[100] shadow-sm animate-slide-down pt-safe-or-4">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3.5">
        <EensaLogo variant="default" size={44} className="flex-shrink-0" />
        <div>
          <div className="font-display font-extrabold text-lg text-eensa-green leading-tight">
            EENSA
          </div>
          <div className="text-[11px] text-eensa-text3 font-medium tracking-wide hidden sm:block">
            Construindo Histórias...
          </div>
        </div>
      </Link>

      {/* Nav */}
      <div className="flex items-center gap-2">
        <div className="flex gap-[3px] bg-eensa-surface2 p-1 rounded-[10px]">
          <Link
            href="/"
            className={`px-[18px] py-2.5 rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 min-h-[44px] ${
              pathname === '/'
                ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                : 'bg-transparent text-eensa-text2 hover:text-eensa-green'
            }`}
          >
            <Icons.List size={16} /> Avisos
          </Link>
          <Link
            href="/admin"
            className={`px-[18px] py-2.5 rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 min-h-[44px] ${
              pathname === '/admin'
                ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                : 'bg-transparent text-eensa-text2 hover:text-eensa-green'
            }`}
          >
            <Icons.User size={16} /> Gestão
          </Link>
        </div>
        
        {logado && (
          <button
            onClick={logout}
            className="ml-1 px-[10px] py-2.5 bg-transparent text-eensa-text2 border-none cursor-pointer rounded-lg font-display font-bold text-xs hover:bg-eensa-surface2 hover:text-eensa-green transition-all duration-200 min-h-[44px]"
          >
            Sair
          </button>
        )}
      </div>
    </header>
  );
}
