// components/layout/Footer.tsx
'use client';
import { Icons } from '@/components/ui/Icons';

export function Footer() {
  return (
    <footer className="bg-eensa-surface border-t-[1.5px] border-eensa-border mt-12 py-8 px-7">
      <div className="max-w-5xl mx-auto">
        {/* Informações da Escola */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Escola Info */}
          <div>
            <h3 className="font-display font-extrabold text-base text-eensa-green mb-2">
              Escola Estadual Nossa Senhora Aparecida
            </h3>
            <div className="text-xs text-eensa-text3 space-y-1">
              <div className="flex items-center gap-2">
                <Icons.MapPin size={14} className="text-eensa-teal flex-shrink-0" />
                <span>Mendes Pimentel/MG</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.BookOpen size={14} className="text-eensa-teal flex-shrink-0" />
                <span className="italic">Construindo Histórias...</span>
              </div>
            </div>
          </div>

          {/* Créditos */}
          <div className="text-xs text-eensa-text3 text-left md:text-right">
            <div className="font-display font-bold text-eensa-green mb-2">
              Desenvolvido por
            </div>
            <a 
              href="https://www.instagram.com/rodrigodionizio/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-eensa-text2 hover:text-eensa-green transition-colors duration-200 md:justify-end"
            >
              <Icons.Instagram size={16} className="flex-shrink-0" />
              <span className="font-medium">Rodrigo Dionízio</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-eensa-border my-5" />

        {/* Copyright */}
        <div className="text-center text-[11px] text-eensa-text3">
          © {new Date().getFullYear()} E.E.N.S.A - Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
