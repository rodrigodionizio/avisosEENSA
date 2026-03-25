// components/admin/SegmentacaoDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { getEstatisticasSegmentacao } from '@/lib/supabase/leitor-queries';
import { getDesempenhoAvisosPorPublico } from '@/lib/supabase/queries';

interface Stats {
  visualizacoes_totais: number;
  professores_logados: number;
  pais_identificados: number;
  alunos_identificados: number;
  alcance_por_perfil: {
    professores: number;
    pais: number;
    alunos: number;
  };
  ciencia_conselho_classe: {
    total_destinatarios: number;
    confirmaram: number;
    pendentes: number;
    percentual: number;
  };
}

interface DesempenhoPublico {
  publico: string;
  total_avisos: number;
  avisos_urgentes: number;
  avisos_ativos: number;
  avisos_expirados: number;
}

export function SegmentacaoDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [desempenho, setDesempenho] = useState<DesempenhoPublico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const [dadosStats, dadosDesempenho] = await Promise.all([
        getEstatisticasSegmentacao(),
        getDesempenhoAvisosPorPublico(),
      ]);
      setStats(dadosStats);
      setDesempenho(dadosDesempenho);
    } catch (error) {
      console.error('Erro ao carregar dashboard de segmentação:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-eensa-green"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-700">Erro ao carregar estatísticas de segmentação.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-eensa-green mb-2">
          Dashboard — Segmentação de Público
        </h2>
        <p className="text-sm text-eensa-text3">
          Desempenho por perfil de audiência
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Visualizações */}
        <div className="bg-white border-[1.5px] border-eensa-border rounded-xl p-5">
          <div className="text-3xl font-extrabold text-eensa-green mb-1">
            {stats.visualizacoes_totais.toLocaleString()}
          </div>
          <div className="text-xs text-eensa-text3 font-semibold">Visualizações totais</div>
        </div>

        {/* Professores */}
        <div className="bg-purple-50 border-[1.5px] border-purple-200 rounded-xl p-5">
          <div className="text-3xl font-extrabold text-purple-700 mb-1">
            {stats.professores_logados}
          </div>
          <div className="text-xs text-purple-600 font-semibold">Professores logados</div>
        </div>

        {/* Pais */}
        <div className="bg-eensa-surface2 border-[1.5px] border-eensa-green-lt rounded-xl p-5">
          <div className="text-3xl font-extrabold text-eensa-green mb-1">
            {stats.pais_identificados}
          </div>
          <div className="text-xs text-eensa-green-mid font-semibold">Pais identificados</div>
        </div>

        {/* Alunos */}
        <div className="bg-eensa-teal-lt border-[1.5px] border-eensa-teal-border rounded-xl p-5">
          <div className="text-3xl font-extrabold text-[#1A7A95] mb-1">
            {stats.alunos_identificados}
          </div>
          <div className="text-xs text-[#1A7A95] font-semibold">Alunos identificados</div>
        </div>
      </div>

      {/* Alcance por Perfil */}
      <div className="bg-white border-[1.5px] border-eensa-border rounded-xl p-6">
        <h3 className="font-display font-extrabold text-lg text-eensa-text mb-4">
          📊 Alcance por Perfil
        </h3>
        <div className="space-y-3">
          {/* Professores */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-purple-700">Professores</span>
              <span className="text-sm font-bold text-purple-700">
                {stats.alcance_por_perfil.professores}%
              </span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.alcance_por_perfil.professores}%` }}
              />
            </div>
          </div>

          {/* Pais */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-eensa-green">Pais</span>
              <span className="text-sm font-bold text-eensa-green">
                {stats.alcance_por_perfil.pais}%
              </span>
            </div>
            <div className="w-full bg-eensa-surface2 rounded-full h-3 overflow-hidden">
              <div
                className="bg-eensa-green h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.alcance_por_perfil.pais}%` }}
              />
            </div>
          </div>

          {/* Alunos */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-[#1A7A95]">Alunos</span>
              <span className="text-sm font-bold text-[#1A7A95]">
                {stats.alcance_por_perfil.alunos}%
              </span>
            </div>
            <div className="w-full bg-eensa-teal-lt rounded-full h-3 overflow-hidden">
              <div
                className="bg-eensa-teal h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.alcance_por_perfil.alunos}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ciência - Conselho de Classe */}
      <div className="bg-white border-[1.5px] border-eensa-border rounded-xl p-6">
        <h3 className="font-display font-extrabold text-lg text-eensa-text mb-4">
          🎓 Ciência — Conselho de Classe
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-extrabold text-eensa-text mb-1">
              {stats.ciencia_conselho_classe.total_destinatarios}
            </div>
            <div className="text-xs text-eensa-text3">Total destinatários</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-green-600 mb-1">
              {stats.ciencia_conselho_classe.confirmaram}
            </div>
            <div className="text-xs text-green-600">Confirmaram</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-orange-600 mb-1">
              {stats.ciencia_conselho_classe.pendentes}
            </div>
            <div className="text-xs text-orange-600">Pendentes</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-eensa-green mb-1">
              {stats.ciencia_conselho_classe.percentual}%
            </div>
            <div className="text-xs text-eensa-text3">Taxa de ciência</div>
          </div>
        </div>
      </div>

      {/* Desempenho dos Avisos por Público-Alvo */}
      {desempenho.length > 0 && (
        <div className="bg-white border-[1.5px] border-eensa-border rounded-xl p-6">
          <h3 className="font-display font-extrabold text-lg text-eensa-text mb-4">
            📈 Desempenho dos Avisos por Público-Alvo
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-eensa-border">
                  <th className="text-left py-3 px-4 font-bold text-eensa-text2">Público</th>
                  <th className="text-right py-3 px-4 font-bold text-eensa-text2">Total</th>
                  <th className="text-right py-3 px-4 font-bold text-eensa-text2">Urgentes</th>
                  <th className="text-right py-3 px-4 font-bold text-eensa-text2">Ativos</th>
                  <th className="text-right py-3 px-4 font-bold text-eensa-text2">Expirados</th>
                </tr>
              </thead>
              <tbody>
                {desempenho.map((row) => (
                  <tr key={row.publico} className="border-b border-eensa-border last:border-0">
                    <td className="py-3 px-4 font-semibold text-eensa-text">
                      {row.publico === 'todos' && '👥 Todos'}
                      {row.publico === 'professores' && '🎓 Professores'}
                      {row.publico === 'pais' && '👨‍👩‍👧 Pais'}
                      {row.publico === 'alunos' && '👩‍🎓 Alunos'}
                    </td>
                    <td className="py-3 px-4 text-right text-eensa-text">{row.total_avisos}</td>
                    <td className="py-3 px-4 text-right text-red-600 font-semibold">
                      {row.avisos_urgentes}
                    </td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">
                      {row.avisos_ativos}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500">{row.avisos_expirados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nota de Rodapé */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>ℹ️ Nota:</strong> Os dados de alcance são calculados com base nos perfis
          identificados voluntariamente pelos usuários. Visitantes anônimos não são contabilizados
          nas estatísticas por perfil.
        </p>
      </div>
    </div>
  );
}
