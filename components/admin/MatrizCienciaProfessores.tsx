'use client';

import { useEffect, useState } from 'react';
import { getMatrizCienciaProfessores, type MatrizCiencia } from '@/lib/supabase/professor-ciencia-matriz';

export default function MatrizCienciaProfessores() {
  const [matriz, setMatriz] = useState<MatrizCiencia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMatriz() {
      setLoading(true);
      const dados = await getMatrizCienciaProfessores();
      setMatriz(dados);
      setLoading(false);
    }
    carregarMatriz();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando matriz de ciência...</span>
        </div>
      </div>
    );
  }

  if (!matriz || matriz.professores.length === 0 || matriz.avisos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ciência de Professores - Matriz
        </h3>
        <p className="text-gray-600 text-sm">
          Nenhum aviso para professores encontrado nos últimos 30 dias.
        </p>
      </div>
    );
  }

  // Calcula porcentagem de ciência por professor
  const calcularPorcentagem = (userId: string): number => {
    const userConfirmacoes = matriz.confirmacoes.get(userId);
    if (!userConfirmacoes) return 0;
    
    const confirmados = Array.from(userConfirmacoes.values()).filter(c => c.confirmou).length;
    return Math.round((confirmados / matriz.avisos.length) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Ciência de Professores - Matriz
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {matriz.professores.length} professor(es) × {matriz.avisos.length} aviso(s) dos últimos 30 dias
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="sticky left-0 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900 z-10"
              >
                Professor
              </th>
              {matriz.avisos.map((aviso) => (
                <th
                  key={aviso.aviso_id}
                  scope="col"
                  className="px-3 py-3 text-center font-semibold text-gray-900 min-w-[120px]"
                  title={aviso.titulo}
                >
                  <div className="text-xs leading-tight">
                    {aviso.titulo_abreviado}
                  </div>
                </th>
              ))}
              <th 
                scope="col" 
                className="px-4 py-3 text-center font-semibold text-gray-900"
              >
                %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matriz.professores.map((professor) => {
              const userConfirmacoes = matriz.confirmacoes.get(professor.user_id);
              const porcentagem = calcularPorcentagem(professor.user_id);
              
              return (
                <tr key={professor.user_id} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-white px-4 py-3 font-medium text-gray-900 z-10">
                    <div className="flex items-center gap-2">
                      {/* Avatar com iniciais */}
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-700">
                          {professor.nome_completo
                            .split(' ')
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {professor.nome_completo}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {matriz.avisos.map((aviso) => {
                    const confirmacao = userConfirmacoes?.get(aviso.aviso_id);
                    const confirmou = confirmacao?.confirmou || false;
                    const horario = confirmacao?.horario;
                    
                    return (
                      <td 
                        key={aviso.aviso_id} 
                        className="px-3 py-3 text-center"
                      >
                        {confirmou ? (
                          <div 
                            className="inline-flex items-center justify-center"
                            title={horario ? `Confirmado em ${new Date(horario).toLocaleString('pt-BR')}` : 'Confirmado'}
                          >
                            <span className="text-green-600 text-lg">✅</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center">
                            <span className="text-red-400 text-lg">❌</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      porcentagem === 100 
                        ? 'bg-green-100 text-green-800' 
                        : porcentagem >= 50 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {porcentagem}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span className="text-green-600">✅</span>
          <span>Ciente</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-red-400">❌</span>
          <span>Pendente</span>
        </div>
        <div className="ml-auto text-gray-500">
          Passe o mouse sobre ✅ para ver data/hora da confirmação
        </div>
      </div>
    </div>
  );
}
