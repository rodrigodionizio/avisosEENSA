// components/admin/ProfessoresCienciaDashboard.tsx
'use client';
import { useState, useEffect } from 'react';
import { getProfessoresCiencia } from '@/lib/supabase/professor-confirmacao-queries';
import type { ProfessorCiencia } from '@/lib/supabase/professor-confirmacao-queries';

interface Props {
  avisoId: number;
  tituloAviso?: string; // Ex: "Conselho de Classe"
}

/**
 * Dashboard de ciência de professores para um aviso específico
 * 
 * Exibe lista nominal de professores com status:
 * - Cientes: com nome, horário e badge verde
 * - Pendentes: com nome, sem horário e badge vermelho
 * 
 * Atualiza automaticamente ao montar ou quando avisoId mudar.
 */
export function ProfessoresCienciaDashboard({ avisoId, tituloAviso }: Props) {
  const [professores, setProfessores] = useState<ProfessorCiencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getProfessoresCiencia(avisoId);
        setProfessores(data);
      } catch (error) {
        console.error('Erro ao carregar professores:', error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [avisoId]);

  if (loading) {
    return (
      <div className="bg-white border border-eensa-border rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const cientes = professores.filter((p) => p.confirmou);
  const pendentes = professores.filter((p) => !p.confirmou);

  return (
    <div className="bg-white border-[1.5px] border-eensa-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <h3 className="text-xs font-extrabold text-eensa-text3 uppercase tracking-wide">
          Ciência — {tituloAviso || 'Aviso'}
        </h3>
        <div className="ml-auto text-xs font-bold text-purple-700">
          {cientes.length}/{professores.length}
        </div>
      </div>

      {/* Lista de Professores */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {/* Professores Cientes */}
        {cientes.map((prof) => (
          <div
            key={prof.user_id}
            className="flex items-center gap-3 bg-eensa-surface rounded-lg px-3 py-2 transition-all hover:bg-eensa-surface2"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
              {prof.nome_completo.substring(0, 2).toUpperCase()}
            </div>

            {/* Nome */}
            <span className="flex-1 text-sm font-semibold text-eensa-text truncate">
              {prof.nome_completo}
            </span>

            {/* Horário */}
            <span className="text-xs text-eensa-text3 flex-shrink-0">
              {prof.horario}
            </span>

            {/* Badge Ciente */}
            <span className="bg-eensa-surface border border-eensa-green text-eensa-green text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0">
              Ciente
            </span>
          </div>
        ))}

        {/* Professores Pendentes */}
        {pendentes.map((prof) => (
          <div
            key={prof.user_id}
            className="flex items-center gap-3 bg-gray-50 border border-eensa-border rounded-lg px-3 py-2 transition-all hover:bg-gray-100"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
              {prof.nome_completo.substring(0, 2).toUpperCase()}
            </div>

            {/* Nome */}
            <span className="flex-1 text-sm font-semibold text-eensa-text2 truncate">
              {prof.nome_completo}
            </span>

            {/* Sem horário */}
            <span className="text-xs text-red-600 flex-shrink-0">—</span>

            {/* Badge Pendente */}
            <span className="bg-red-50 border border-red-300 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0">
              Pendente
            </span>
          </div>
        ))}
      </div>

      {/* Mensagem se vazio */}
      {professores.length === 0 && (
        <div className="text-center py-8 text-sm text-eensa-text3">
          Nenhum professor cadastrado ainda.
        </div>
      )}

      {/* Footer com resumo */}
      {professores.length > 0 && (
        <div className="mt-4 pt-4 border-t border-eensa-border flex justify-between text-xs text-eensa-text3">
          <span>
            <strong className="text-eensa-green">{cientes.length}</strong> cientes
          </span>
          <span>
            <strong className="text-red-600">{pendentes.length}</strong> pendentes
          </span>
        </div>
      )}
    </div>
  );
}
