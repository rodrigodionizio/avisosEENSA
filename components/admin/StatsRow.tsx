// components/admin/StatsRow.tsx
import type { StatsData } from '@/types';

interface StatsRowProps {
  stats: StatsData;
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-[30px]"
      style={{animation: 'fadeIn 0.45s ease 0.1s both'}}
    >
      {/* Ativos */}
      <div className="bg-eensa-surface border-[1.5px] border-eensa-border rounded-md p-5 pb-[18px] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-sm">
        <div className="font-display font-black text-[30px] leading-none mb-[5px] text-eensa-green">
          {stats.ativos}
        </div>
        <div className="text-xs text-eensa-text3 font-medium">Avisos ativos</div>
      </div>

      {/* Urgentes */}
      <div className="bg-eensa-surface border-[1.5px] border-eensa-orange-border rounded-md p-5 pb-[18px] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-sm">
        <div className="font-display font-black text-[30px] leading-none mb-[5px] text-eensa-orange">
          {stats.urgentes}
        </div>
        <div className="text-xs text-eensa-text3 font-medium">Urgentes</div>
      </div>

      {/* Total */}
      <div className="bg-eensa-surface border-[1.5px] border-eensa-teal-border rounded-md p-5 pb-[18px] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-sm">
        <div className="font-display font-black text-[30px] leading-none mb-[5px] text-eensa-teal">
          {stats.total}
        </div>
        <div className="text-xs text-eensa-text3 font-medium">Total criados</div>
      </div>

      {/* Expirados */}
      <div className="bg-eensa-surface border-[1.5px] border-eensa-border rounded-md p-5 pb-[18px] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-sm">
        <div className="font-display font-black text-[30px] leading-none mb-[5px] text-eensa-text3">
          {stats.expirados}
        </div>
        <div className="text-xs text-eensa-text3 font-medium">Expirados</div>
      </div>
    </div>
  );
}
