// components/layout/PerfilChip.tsx
'use client';

import { useLeitor } from '@/contexts/LeitorContext';
import type { PerfilLeitor } from '@/types';

/**
 * Chip de identificação do perfil atual do leitor
 * 
 * Mostra:
 * - Ícone do perfil (👨‍🏫, 👪, 🎓)
 * - Nome (professor) ou rótulo (Pai/Aluno)
 * - Botão para trocar/sair
 * 
 * Só aparece quando `jaIdentificado = true`
 */
export function PerfilChip() {
  const { contexto, logout } = useLeitor();

  // Não renderizar se ainda não identificou
  if (!contexto.jaIdentificado) return null;

  const handleTrocar = async () => {
    if (
      confirm(
        'Deseja trocar de perfil? Você será redirecionado para a seleção novamente.'
      )
    ) {
      await logout();
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Configuração visual por tipo de perfil
  // ══════════════════════════════════════════════════════════════════════════
  const config: Record<
    PerfilLeitor,
    { icone: string; label: string; cor: string; bgCor: string }
  > = {
    professor: {
      icone: '👨‍🏫',
      label: contexto.nomeCompleto
        ? `Prof. ${contexto.nomeCompleto.split(' ')[0]}`
        : 'Professor',
      cor: 'text-eensa-green',
      bgCor: 'bg-eensa-surface border-eensa-green',
    },
    pai: {
      icone: '👪',
      label: 'Pai/Responsável',
      cor: 'text-eensa-teal',
      bgCor: 'bg-[rgba(43,170,199,0.12)] border-eensa-teal',
    },
    aluno: {
      icone: '🎓',
      label: 'Aluno',
      cor: 'text-eensa-orange',
      bgCor: 'bg-eensa-orange-lt border-eensa-orange',
    },
    anonimo: {
      icone: '👤',
      label: 'Visitante',
      cor: 'text-eensa-text3',
      bgCor: 'bg-gray-100 border-gray-300',
    },
  };

  const { icone, label, cor, bgCor } = config[contexto.perfil];

  return (
    <div
      className={`inline-flex items-center gap-2 ${bgCor} border-[1.5px] rounded-full px-3 py-1.5 shadow-sm animate-fade-in`}
    >
      {/* Ícone do perfil */}
      <span className="text-base leading-none">{icone}</span>

      {/* Label */}
      <span className={`text-xs sm:text-sm font-display font-semibold ${cor}`}>
        {label}
      </span>

      {/* Botão Trocar/Sair */}
      <button
        onClick={handleTrocar}
        className={`ml-1 text-xs ${cor} hover:underline focus:outline-none focus:underline transition-all`}
        title="Trocar de perfil"
      >
        trocar
      </button>
    </div>
  );
}
