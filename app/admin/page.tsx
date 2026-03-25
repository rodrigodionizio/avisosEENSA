// app/admin/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { StatsRow } from '@/components/admin/StatsRow';
import { AvisosTable } from '@/components/admin/AvisosTable';
import { AvisoForm } from '@/components/avisos/AvisoForm';
import { TVSettingsForm } from '@/components/admin/TVSettingsForm';
import { SegmentacaoDashboard } from '@/components/admin/SegmentacaoDashboard';
import { Toast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ButtonNew } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icons';
import { getTodosAvisos, criarAviso, editarAviso, deletarAviso } from '@/lib/supabase/queries';
import { isExpirado } from '@/lib/utils';
import type { Aviso, AvisoFormData, StatsData } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const { logado, loading: authLoading, usuario, getNome } = useAuth();
  const { settings } = useSettings();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [avisosAtivos, setAvisosAtivos] = useState<Aviso[]>([]);
  const [avisosAgendados, setAvisosAgendados] = useState<Aviso[]>([]);
  const [avisosExpirados, setAvisosExpirados] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState<'dashboard' | 'avisos' | 'tv'>('dashboard');
  const [avisosTab, setAvisosTab] = useState<'ativos' | 'agendados' | 'expirados'>('ativos');
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [avisoEditando, setAvisoEditando] = useState<Aviso | null>(null);
  const [avisoParaDeletar, setAvisoParaDeletar] = useState<Aviso | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // 🔒 Proteção de rota: redirecionar para login se não autenticado
  useEffect(() => {
    if (!authLoading && !logado) {
      router.push('/login');
    }
  }, [logado, authLoading, router]);

  const carregar = async () => {
    try {
      const data = await getTodosAvisos();
      setAvisos(data);
      
      const now = new Date().toISOString();
      const ativos = data.filter(a => a.ativo && !isExpirado(a) && a.publica_em <= now);
      const agendados = data.filter(a => a.ativo && a.publica_em > now);
      const expirados = data.filter(a => !a.ativo || isExpirado(a));
      
      // Ordenar por prioridade
      const ordem: Record<string, number> = { urgente: 0, normal: 1, info: 2 };
      ativos.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
      agendados.sort((a, b) => new Date(a.publica_em).getTime() - new Date(b.publica_em).getTime());
      
      setAvisosAtivos(ativos);
      setAvisosAgendados(agendados);
      setAvisosExpirados(expirados);
    } catch (error: any) {
      console.error('Erro ao carregar avisos:', error);
      const mensagem = error?.message || 'Erro desconhecido ao carregar avisos';
      showToast(mensagem, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };


  const handleSettingsSave = () => {
    showToast('Configurações do Modo TV atualizadas com sucesso! 🎉', 'success');
  };
  const handleNovo = () => {
    setAvisoEditando(null);
    setModalOpen(true);
  };

  const handleEdit = (aviso: Aviso) => {
    setAvisoEditando(aviso);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    const aviso = avisos.find(a => a.id === id);
    if (aviso) {
      setAvisoParaDeletar(aviso);
      setConfirmDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!avisoParaDeletar) return;

    try {
      await deletarAviso(avisoParaDeletar.id);
      await carregar();
      showToast('Aviso excluído com sucesso', 'success');
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      showToast(error?.message || 'Erro ao excluir aviso', 'error');
    } finally {
      setAvisoParaDeletar(null);
    }
  };

  const handleSave = async (data: AvisoFormData) => {
    try {
      if (avisoEditando) {
        await editarAviso(avisoEditando.id, data);
        showToast('Aviso atualizado com sucesso', 'success');
      } else {
        await criarAviso(data);
        showToast('Aviso criado com sucesso', 'success');
      }
      await carregar();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      showToast(error?.message || 'Erro ao salvar aviso', 'error');
      throw error;
    }
  };

  const stats: StatsData = {
    total: avisos.length,
    ativos: avisosAtivos.length,
    urgentes: avisosAtivos.filter(a => a.prioridade === 'urgente').length,
    agendados: avisosAgendados.length,
    expirados: avisosExpirados.length,
  };

  return (
    <>
      <Header />
      <PageWrapper wide>
        {/* Page Header */}
        <div className="flex justify-between items-start mb-7 animate-fade-in">
          <div>
            <h1 className="font-display font-extrabold text-[22px] text-eensa-green leading-tight">
              Painel de Gestão
            </h1>
            <p className="text-[13px] text-eensa-text3 mt-[3px]">
              {usuario?.user_metadata?.nome ? (
                <>
                  Bem-vindo(a), <strong className="text-eensa-green">{usuario.user_metadata.nome}</strong>
                </>
              ) : usuario?.user_metadata?.display_name ? (
                <>
                  Bem-vindo(a), <strong className="text-eensa-green">{usuario.user_metadata.display_name}</strong>
                </>
              ) : usuario?.email ? (
                <>
                  Bem-vindo(a), <strong className="text-eensa-green">{usuario.email}</strong>
                </>
              ) : (
                'Bem-vindo(a) ao painel de gestão'
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {mainTab === 'avisos' && (
              <ButtonNew onClick={handleNovo} className="whitespace-nowrap">
                <Icons.Plus size={18} /> <span className="hidden xs:inline">Novo aviso</span><span className="xs:hidden">Novo</span>
              </ButtonNew>
            )}
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-[3px] bg-eensa-surface2 p-1 rounded-[10px] overflow-x-auto scrollbar-hide mb-6">
          <button
            onClick={() => setMainTab('dashboard')}
            className={`px-[18px] py-[7px] rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
              mainTab === 'dashboard'
                ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                : 'bg-transparent text-eensa-text2'
            }`}
          >
            <Icons.BarChart size={16} /> Dashboard
          </button>
          <button
            onClick={() => setMainTab('avisos')}
            className={`px-[18px] py-[7px] rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
              mainTab === 'avisos'
                ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                : 'bg-transparent text-eensa-text2'
            }`}
          >
            <Icons.List size={16} /> Avisos
          </button>
          <button
            onClick={() => setMainTab('tv')}
            className={`px-[18px] py-[7px] rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
              mainTab === 'tv'
                ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                : 'bg-transparent text-eensa-text2'
            }`}
          >
            <Icons.Settings size={16} /> Config TV
          </button>
        </div>

        {/* Dashboard Tab */}
        {mainTab === 'dashboard' && (
          <SegmentacaoDashboard />
        )}

        {/* Avisos Tab */}
        {mainTab === 'avisos' && (
          <>
            {/* Stats */}
            <StatsRow stats={stats} />

            {/* Sub-tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
              <div className="flex gap-[3px] bg-eensa-surface2 p-1 rounded-[10px] overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setAvisosTab('ativos')}
                  className={`px-[18px] py-[7px] rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                    avisosTab === 'ativos'
                      ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                      : 'bg-transparent text-eensa-text2'
                  }`}
                >
                  <Icons.List size={16} /> Avisos ativos
                </button>
                <button
                  onClick={() => setAvisosTab('agendados')}
                  className={`px-[18px] py-[7px] rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                    avisosTab === 'agendados'
                      ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                      : 'bg-transparent text-eensa-text2'
                  }`}
                >
                  <Icons.Clock size={16} /> Agendados
                </button>
                <button
                  onClick={() => setAvisosTab('expirados')}
                  className={`px-[18px] py-[7px] rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                    avisosTab === 'expirados'
                      ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                      : 'bg-transparent text-eensa-text2'
                  }`}
                >
                  <Icons.Archive size={16} /> Expirados
                </button>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 bg-[rgba(43,170,199,0.12)] text-eensa-teal border border-[rgba(43,170,199,0.3)] rounded-full px-2.5 py-[3px] font-display font-bold text-[11px] flex-shrink-0">
                <span 
                  className="w-1.5 h-1.5 rounded-full bg-eensa-teal"
                  style={{animation: 'blink 1.2s ease-in-out infinite'}}
                />
                Sincronizado
              </span>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-10 text-eensa-text3">Carregando...</div>
            ) : (
              <AvisosTable
                avisos={avisosTab === 'ativos' ? avisosAtivos : avisosTab === 'agendados' ? avisosAgendados : avisosExpirados}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            )}
          </>
        )}

        {/* Config TV Tab */}
        {mainTab === 'tv' && (
          <div className="max-w-2xl">
            <div className="bg-white border-[1.5px] border-eensa-border rounded-xl p-6">
              <h3 className="font-display font-extrabold text-lg text-eensa-text mb-4">
                ⚙️ Configurações do Modo TV
              </h3>
              <TVSettingsForm
                isOpen={true}
                currentSettings={settings}
                onSave={handleSettingsSave}
                onClose={() => setMainTab('dashboard')}
                embedded={true}
              />
            </div>
          </div>
        )}
      </PageWrapper>

      {/*  Modal */}
      <AvisoForm
        isOpen={modalOpen}
        aviso={avisoEditando}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setAvisoEditando(null);
        }}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setAvisoParaDeletar(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Excluir aviso?"
        message={
          avisoParaDeletar
            ? `Tem certeza que deseja excluir o aviso "${avisoParaDeletar.titulo}"? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este aviso?'
        }
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Footer />
    </>
  );
}
