// app/admin/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { StatsRow } from '@/components/admin/StatsRow';
import { AvisosTable } from '@/components/admin/AvisosTable';
import { AvisoForm } from '@/components/avisos/AvisoForm';
import { Toast } from '@/components/ui/Toast';
import { ButtonNew } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icons';
import { getTodosAvisos, criarAviso, editarAviso, deletarAviso } from '@/lib/supabase/queries';
import { isExpirado } from '@/lib/utils';
import type { Aviso, AvisoFormData, StatsData } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const { logado, loading: authLoading } = useAuth();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [avisosAtivos, setAvisosAtivos] = useState<Aviso[]>([]);
  const [avisosExpirados, setAvisosExpirados] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ativos' | 'expirados'>('ativos');
  const [modalOpen, setModalOpen] = useState(false);
  const [avisoEditando, setAvisoEditando] = useState<Aviso | null>(null);
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
      
      const ativos = data.filter(a => a.ativo && !isExpirado(a));
      const expirados = data.filter(a => !a.ativo || isExpirado(a));
      
      // Ordenar por prioridade
      const ordem: Record<string, number> = { urgente: 0, normal: 1, info: 2 };
      ativos.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
      
      setAvisosAtivos(ativos);
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

  const handleNovo = () => {
    setAvisoEditando(null);
    setModalOpen(true);
  };

  const handleEdit = (aviso: Aviso) => {
    setAvisoEditando(aviso);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este aviso?')) return;

    try {
      await deletarAviso(id);
      await carregar();
      showToast('Aviso excluído com sucesso', 'success');
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      showToast(error?.message || 'Erro ao excluir aviso', 'error');
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
              Bem-vinda, <strong className="text-eensa-green">admin@eensa.edu.br</strong>
            </p>
          </div>
          <ButtonNew onClick={handleNovo}>
            <Icons.Plus size={18} /> Novo aviso
          </ButtonNew>
        </div>

        {/* Stats */}
        <StatsRow stats={stats} />

        {/* Tabs */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-[3px] bg-eensa-surface2 p-1 rounded-[10px]">
            <button
              onClick={() => setTab('ativos')}
              className={`px-[18px] py-[7px] rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'ativos'
                  ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                  : 'bg-transparent text-eensa-text2'
              }`}
            >
              <Icons.List size={16} /> Avisos ativos
            </button>
            <button
              onClick={() => setTab('expirados')}
              className={`px-[18px] py-[7px] rounded-[7px] font-display font-bold text-[13px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'expirados'
                  ? 'bg-eensa-surface text-eensa-green shadow-[0_1px_6px_rgba(26,107,46,0.1)]'
                  : 'bg-transparent text-eensa-text2'
              }`}
            >
              <Icons.Archive size={16} /> Expirados
            </button>
          </div>

          <span className="inline-flex items-center gap-1 bg-[rgba(43,170,199,0.12)] text-eensa-teal border border-[rgba(43,170,199,0.3)] rounded-full px-2.5 py-[3px] font-display font-bold text-[11px]">
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
            avisos={tab === 'ativos' ? avisosAtivos : avisosExpirados}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </PageWrapper>

      {/* Modal */}
      <AvisoForm
        isOpen={modalOpen}
        aviso={avisoEditando}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setAvisoEditando(null);
        }}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
