// components/layout/ProfileSelector.tsx
'use client';

import { useState } from 'react';
import { useLeitor } from '@/contexts/LeitorContext';
import { AlertDialog } from '@/components/ui/AlertDialog';

/**
 * Componente de seleção de perfil (Professores, Pais, Alunos)
 * 
 * Exibido na página inicial quando o usuário não está identificado.
 * - Professores: Redireciona para Google OAuth
 * - Pais e Alunos: Registra perfil direto (sem autenticação)
 */
export function ProfileSelector() {
  const { setPerfilSimples, loginGoogle } = useLeitor();
  const [loading, setLoading] = useState<string | null>(null);
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info' | 'success';
  }>({ isOpen: false, title: '', message: '', variant: 'info' });

  const handleProfessores = async () => {
    try {
      setLoading('professor');
      await loginGoogle();
      // O usuário será redirecionado para Google OAuth
      // Callback em /auth/callback validará o domínio
    } catch (error) {
      console.error('Erro ao iniciar login Google:', error);
      setLoading(null);
      setAlertState({
        isOpen: true,
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar com o Google. Tente novamente.',
        variant: 'danger',
      });
    }
  };

  const handlePais = async () => {
    try {
      setLoading('pai');
      await setPerfilSimples('pai');
      // Contexto será atualizado automaticamente
    } catch (error: any) {
      console.error('Erro ao definir perfil Pai:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      });
      setLoading(null);
      setAlertState({
        isOpen: true,
        title: 'Erro ao Definir Perfil',
        message: 'Não foi possível registrar seu perfil. Tente novamente.',
        variant: 'danger',
      });
    }
  };

  const handleAlunos = async () => {
    try {
      setLoading('aluno');
      await setPerfilSimples('aluno');
      // Contexto será atualizado automaticamente
    } catch (error: any) {
      console.error('Erro ao definir perfil Aluno:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      });
      setLoading(null);
      setAlertState({
        isOpen: true,
        title: 'Erro ao Definir Perfil',
        message: 'Não foi possível registrar seu perfil. Tente novamente.',
        variant: 'danger',
      });
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Título */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-eensa-green mb-3">
          Bem-vindo ao Quadro de Avisos
        </h1>
        <p className="text-sm sm:text-base text-eensa-text3 max-w-md mx-auto">
          Para ver os avisos relevantes para você, selecione seu perfil:
        </p>
      </div>

      {/* Grid de Botões */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
        {/* Botão: Professores */}
        <button
          onClick={handleProfessores}
          disabled={loading !== null}
          className="group relative bg-white hover:bg-eensa-surface border-2 border-eensa-green hover:border-eensa-green-hover rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
        >
          {/* Ícone */}
          <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
            👨‍🏫
          </div>

          {/* Título */}
          <h2 className="font-display font-bold text-xl text-eensa-green mb-2">
            Professores
          </h2>

          {/* Descrição */}
          <p className="text-sm text-eensa-text3">
            Login com conta Google
          </p>

          {/* Loading Spinner */}
          {loading === 'professor' && (
            <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-eensa-green border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>

        {/* Botão: Pais */}
        <button
          onClick={handlePais}
          disabled={loading !== null}
          className="group relative bg-white hover:bg-eensa-surface border-2 border-eensa-teal hover:border-[#2ab3d8] rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
        >
          {/* Ícone */}
          <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
            👪
          </div>

          {/* Título */}
          <h2 className="font-display font-bold text-xl text-eensa-teal mb-2">
            Pais e Responsáveis
          </h2>

          {/* Descrição */}
          <p className="text-sm text-eensa-text3 mb-3">
            Acesso direto sem cadastro
          </p>

          {/* Indicador */}
          <div className="inline-flex items-center gap-1.5 bg-[rgba(43,170,199,0.12)] text-eensa-teal rounded-full px-3 py-1">
            <span className="text-xs font-semibold">Acesso rápido</span>
          </div>

          {/* Loading Spinner */}
          {loading === 'pai' && (
            <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-eensa-teal border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>

        {/* Botão: Alunos */}
        <button
          onClick={handleAlunos}
          disabled={loading !== null}
          className="group relative bg-white hover:bg-eensa-surface border-2 border-eensa-orange hover:border-[#E67E22] rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
        >
          {/* Ícone */}
          <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
            🎓
          </div>

          {/* Título */}
          <h2 className="font-display font-bold text-xl text-eensa-orange mb-2">
            Alunos
          </h2>

          {/* Descrição */}
          <p className="text-sm text-eensa-text3 mb-3">
            Acesso direto sem cadastro
          </p>

          {/* Indicador */}
          <div className="inline-flex items-center gap-1.5 bg-eensa-orange-lt text-eensa-orange rounded-full px-3 py-1">
            <span className="text-xs font-semibold">Acesso rápido</span>
          </div>

          {/* Loading Spinner */}
          {loading === 'aluno' && (
            <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-eensa-orange border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>

      {/* Footer com informação */}
      <div className="mt-8 text-center text-xs text-eensa-text3 max-w-lg animate-fade-in">
        <p>
          💡 <strong>Modo TV:</strong> Acesse{' '}
          <a href="/tv" className="text-eensa-teal hover:underline">
            /tv
          </a>{' '}
          para visualizar todos os avisos em modo apresentação (sem necessidade de
          seleção de perfil)
        </p>
      </div>

      {/* Modal de Alerta */}
      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ ...alertState, isOpen: false })}
        title={alertState.title}
        message={alertState.message}
        variant={alertState.variant}
        confirmText="Entendi"
      />
    </div>
  );
}
