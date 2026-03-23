// components/avisos/AvisoForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import type { Aviso, AvisoFormData, Prioridade, Categoria } from '@/types';

interface AvisoFormProps {
  aviso?: Aviso | null;
  onSave: (data: AvisoFormData) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export function AvisoForm({ aviso, onSave, onClose, isOpen }: AvisoFormProps) {
  const [titulo, setTitulo] = useState('');
  const [corpo, setCorpo] = useState('');
  const [prioridade, setPrioridade] = useState<Prioridade>('normal');
  const [categoria, setCategoria] = useState<Categoria>('Geral');
  const [autor, setAutor] = useState('');
  const [publicaEm, setPublicaEm] = useState('');
  const [expiraEm, setExpiraEm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);

  useEffect(() => {
    if (aviso) {
      setTitulo(aviso.titulo);
      setCorpo(aviso.corpo);
      setPrioridade(aviso.prioridade);
      setCategoria(aviso.categoria);
      setAutor(aviso.autor);
      setPublicaEm(aviso.publica_em ? aviso.publica_em.slice(0, 16) : '');
      setExpiraEm(aviso.expira_em ? aviso.expira_em.slice(0, 16) : '');
    } else {
      // Valores padrão:
      // Publicação: AGORA
      setPublicaEm(new Date().toISOString().slice(0, 16));
      
      // Expiração: hoje + 7 dias
      const defaultExpira = new Date();
      defaultExpira.setDate(defaultExpira.getDate() + 7);
      setExpiraEm(defaultExpira.toISOString().slice(0, 16));
    }
  }, [aviso]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!titulo || titulo.length < 5) {
      newErrors.titulo = 'Título deve ter no mínimo 5 caracteres';
    }
    if (titulo.length > 120) {
      newErrors.titulo = 'Título deve ter no máximo 120 caracteres';
    }
    if (!corpo || corpo.length < 10) {
      newErrors.corpo = 'Corpo deve ter no mínimo 10 caracteres';
    }
    if (corpo.length > 2000) {
      newErrors.corpo = 'Corpo deve ter no máximo 2000 caracteres';
    }
    if (!autor || autor.length < 2) {
      newErrors.autor = 'Autor deve ter no mínimo 2 caracteres';
    }
    
    // Validar: publica_em deve ser <= expira_em
    if (publicaEm && expiraEm) {
      const publica = new Date(publicaEm);
      const expira = new Date(expiraEm);
      if (publica > expira) {
        newErrors.publicaEm = 'Data de publicação deve ser anterior à expiração';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        titulo,
        corpo,
        prioridade,
        categoria,
        autor,
        publica_em: publicaEm || undefined,
        expira_em: expiraEm || null,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const categorias: Categoria[] = [
    'Geral',
    'Reunião',
    'Avaliações',
    'Esportes',
    'Evento',
    'Cultura',
    'Regra',
    'Informativo',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={aviso ? 'Editar Aviso' : 'Novo Aviso'}>
      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="mb-[17px]">
          <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider mb-1.5">
            Título
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border-[1.5px] border-eensa-border rounded-lg px-[13px] py-2.5 font-body text-sm text-eensa-text bg-eensa-bg transition-all outline-none focus:border-eensa-green-mid focus:shadow-[0_0_0_3px_rgba(45,138,71,0.12)] focus:bg-white"
            placeholder="Ex: Reunião de Pais"
            maxLength={120}
          />
          {errors.titulo && <p className="text-eensa-red text-xs mt-1">{errors.titulo}</p>}
          <p className="text-[11px] text-eensa-text3 text-right mt-1">
            {titulo.length}/120
          </p>
        </div>

        {/*div className="flex items-center justify-between mb-1.5">
            <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider">
              Corpo do Aviso
            </label>
            <button
              type="button"
              onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
              className="text-[10px] text-eensa-teal hover:text-eensa-green font-semibold transition-colors"
            >
              {showMarkdownHelp ? '✕ Fechar guia' : '📝 Guia de formatação'}
            </button>
          </div>

          {/* Guia rápido de Markdown */}
          {showMarkdownHelp && (
            <div className="mb-3 p-3 bg-eensa-surface2 border border-eensa-border rounded-lg text-xs">
              <p className="font-bold text-eensa-text mb-2">📝 Formatação suportada:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-eensa-text3">
                <div><code className="bg-white px-1 rounded">**negrito**</code> → <strong>negrito</strong></div>
                <div><code className="bg-white px-1 rounded">*itálico*</code> → <em>itálico</em></div>
                <div><code className="bg-white px-1 rounded">~~riscado~~</code> → <del>riscado</del></div>
                <div><code className="bg-white px-1 rounded">[link](url)</code> → link</div>
                <div><code className="bg-white px-1 rounded">- lista</code> → • lista</div>
                <div><code className="bg-white px-1 rounded">&gt; citação</code> → citação destacada</div>
              </div>
              <p className="mt-2 text-[10px] text-eensa-text3">
                💡 Dica: Use <strong>Visualizar</strong> abaixo para ver como ficará formatado
              </p>
            </div>
          )}

          {/* Abas: Editar / Visualizar */}
          <div className="border-[1.5px] border-eensa-border rounded-lg overflow-hidden">
            <div className="flex border-b border-eensa-border bg-eensa-surface2/50">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`flex-1 px-4 py-2 text-xs font-bold transition-colors ${
                  !showPreview
                    ? 'bg-white text-eensa-green border-b-2 border-eensa-green'
                    : 'text-eensa-text3 hover:text-eensa-text2'
                }`}
              >
                ✏️ Editar
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`flex-1 px-4 py-2 text-xs font-bold transition-colors ${
                  showPreview
                    ? 'bg-white text-eensa-green border-b-2 border-eensa-green'
                    : 'text-eensa-text3 hover:text-eensa-text2'
                }`}
              >
                👁️ Visualizar
              </button>
            </div>

            {!showPreview ? (
              <textarea
                value={corpo}
                onChange={(e) => setCorpo(e.target.value)}
                className="w-full px-[13px] py-2.5 font-body text-sm text-eensa-text bg-white transition-all outline-none resize-vertical min-h-[120px] leading-relaxed"
                placeholder="Descreva o aviso com detalhes... 

Você pode usar formatação:
- **Negrito** para destacar
- *Itálico* para ênfase  
- Listas para organizar informações"
                maxLength={2000}
              />
            ) : (
              <div className="px-[13px] py-2.5 min-h-[120px] bg-white text-sm text-eensa-text2">
                {corpo ? (
                  <MarkdownRenderer content={corpo} />
                ) : (
                  <p className="text-eensa-text3 italic">Nenhum conteúdo para visualizar...</p>
                )}
              </div>
            )}
          </div>
placeholder="Descreva o aviso com detalhes..."
            maxLength={2000}
          />
          {errors.corpo && <p className="text-eensa-red text-xs mt-1">{errors.corpo}</p>}
          <p className="text-[11px] text-eensa-text3 text-right mt-1">
            {corpo.length}/2000
          </p>
        </div>

        {/* Prioridade */}
        <div className="mb-[17px]">
          <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider mb-1.5">
            Prioridade
          </label>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            {(['urgente', 'normal', 'info'] as Prioridade[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrioridade(p)}
                className={`flex-1 min-w-[90px] px-2 py-2.5 rounded-lg border-2 cursor-pointer text-center font-display font-bold text-xs transition-all leading-tight ${
                  prioridade === p
                    ? p === 'urgente'
                      ? 'border-eensa-orange bg-eensa-orange-lt text-[#A04010]'
                      : p === 'normal'
                      ? 'border-eensa-teal bg-eensa-teal-lt text-[#1A7A95]'
                      : 'border-eensa-yellow bg-eensa-yellow-lt text-[#8A6A00]'
                    : 'border-eensa-border bg-eensa-bg text-eensa-text2 hover:border-eensa-green-lt hover:bg-eensa-surface2'
                }`}
              >
                {p === 'urgente' ? '🔴 Urgente' : p === 'normal' ? '🔵 Normal' : '🟡 Informativo'}
              </button>
            ))}
          </div>
        </div>

        {/* Row: Categoria + Autor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-[17px]">
          <div>
            <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider mb-1.5">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className="w-full border-[1.5px] border-eensa-border rounded-lg px-[13px] py-2.5 font-body text-sm text-eensa-text bg-eensa-bg transition-all outline-none focus:border-eensa-green-mid focus:shadow-[0_0_0_3px_rgba(45,138,71,0.12)] focus:bg-white"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider mb-1.5">
              Autor
            </label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="w-full border-[1.5px] border-eensa-border rounded-lg px-[13px] py-2.5 font-body text-sm text-eensa-text bg-eensa-bg transition-all outline-none focus:border-eensa-green-mid focus:shadow-[0_0_0_3px_rgba(45,138,71,0.12)] focus:bg-white"
              placeholder="Ex: Direção"
              maxLength={80}
            />
            {errors.autor && <p className="text-eensa-red text-xs mt-1">{errors.autor}</p>}
          </div>
        </div>

        {/* Row: Publicação + Expiração */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-[17px]">
          <div>
            <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider mb-1.5">
              📅 Data de Publicação
            </label>
            <input
              type="datetime-local"
              value={publicaEm}
              onChange={(e) => setPublicaEm(e.target.value)}
              className="w-full border-[1.5px] border-eensa-border rounded-lg px-[13px] py-2.5 font-body text-sm text-eensa-text bg-eensa-bg transition-all outline-none focus:border-eensa-green-mid focus:shadow-[0_0_0_3px_rgba(45,138,71,0.12)] focus:bg-white"
              required
            />
            {errors.publicaEm && <p className="text-eensa-red text-xs mt-1">{errors.publicaEm}</p>}
            <p className="text-[10px] text-eensa-text3 mt-1">
              ℹ️ Quando o aviso ficará visível
            </p>
          </div>

          <div>
            <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider mb-1.5">
              ⏰ Data de Expiração
            </label>
            <input
              type="datetime-local"
              value={expiraEm}
              onChange={(e) => setExpiraEm(e.target.value)}
              className="w-full border-[1.5px] border-eensa-border rounded-lg px-[13px] py-2.5 font-body text-sm text-eensa-text bg-eensa-bg transition-all outline-none focus:border-eensa-green-mid focus:shadow-[0_0_0_3px_rgba(45,138,71,0.12)] focus:bg-white"
            />
            <p className="text-[10px] text-eensa-text3 mt-1">
              ℹ️ Quando o aviso será removido (opcional)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-5 border-t border-eensa-border">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Salvando...' : aviso ? 'Salvar Alterações' : 'Criar Aviso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
