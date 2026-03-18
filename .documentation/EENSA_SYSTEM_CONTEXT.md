# EENSA — Quadro de Avisos Digital
## Documento de Contexto do Sistema para GitHub Copilot + Claude Sonnet

> **Este documento é a fonte única de verdade da aplicação.**  
> Leia integralmente antes de gerar qualquer código. Siga todas as seções na ordem apresentada.

---

## 1. Visão Geral

### Problema
A EENSA (Escola Estadual Nilo Santos de Araújo) não possui um sistema digital de comunicação interna eficiente. Avisos são afixados em papel, perdem-se no tempo e não diferenciam urgência. Alunos, professores e pais não têm onde consultar comunicados ativos.

### Solução
Uma **PWA (Progressive Web App)** de página única que funciona como quadro de avisos digital inteligente:
- Tela pública consultável por qualquer pessoa (sem login)
- Painel administrativo protegido por autenticação
- Avisos com expiração automática — somem sozinhos quando vencem
- Diferenciação visual clara entre urgente / normal / informativo
- **Modo TV** para exibição em monitores nos corredores da escola
- Real-time: quando um aviso é publicado, todas as telas atualizam imediatamente

### Stack
| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend | **Next.js 14 (App Router)** | SSR + PWA + deploy estático |
| Linguagem | **TypeScript** | Tipagem, autocomplete, segurança |
| Estilo | **Tailwind CSS** | Utilitário, sem CSS custom desnecessário |
| Banco | **Supabase (PostgreSQL)** | Real-time nativo, auth embutida, gratuito |
| Auth | **Supabase Auth** | E-mail/senha, RLS integrada |
| Deploy | **GitHub Pages** (via `next export`) | Custo zero, sem servidor |
| Fontes | **Google Fonts: Nunito + Nunito Sans** | Identidade visual da escola |

---

## 2. Identidade Visual

### Logo
Arquivo: `public/logo_eensa.png`  
A logo da EENSA possui figuras humanas coloridas (teal, verde, amarelo, laranja) sobre ondas vermelhas com texto "EENSA — Construindo Histórias..." em verde escuro.

### Paleta de Cores — CSS Variables (globals.css)

```css
:root {
  /* Backgrounds */
  --bg-primary:    #F3F8F0;   /* verde menta suave — fundo da página */
  --bg-surface:    #FFFFFF;   /* branco puro — cards e modais */
  --bg-surface2:   #EBF4E6;   /* verde clarinho — inputs, tabs, hover */

  /* Verde institucional (cor primária) */
  --green-dark:    #1A6B2E;   /* texto, headers, botões primários */
  --green-mid:     #2D8A47;   /* hover de botões */
  --green-light:   #A8D8B4;   /* bordas suaves, destaques leves */

  /* Cores de prioridade */
  --urgente:       #F28C30;   /* laranja — aviso urgente */
  --urgente-bg:    #FDECD8;   /* fundo card urgente */
  --urgente-border:#F5C9A0;   /* borda card urgente */

  --normal:        #2BAAC7;   /* teal — aviso normal */
  --normal-bg:     #C4EAF4;   /* fundo card normal */
  --normal-border: #9ED8EC;   /* borda card normal */

  --info:          #F5C840;   /* amarelo — informativo */
  --info-bg:       #FEF7DC;   /* fundo card informativo */
  --info-border:   #F0DA90;   /* borda card informativo */

  /* Texto */
  --text-primary:  #1A3A22;   /* verde muito escuro — títulos */
  --text-secondary:#4A7A5A;   /* verde médio — corpo de texto */
  --text-muted:    #7DAA8A;   /* verde desbotado — meta, labels */

  /* Borders & Shadows */
  --border:        #D4EADB;
  --shadow-sm:     0 2px 8px rgba(26,107,46,0.07);
  --shadow-md:     0 4px 20px rgba(26,107,46,0.11);

  /* Tipografia */
  --font-display:  'Nunito', sans-serif;     /* títulos, botões, labels */
  --font-body:     'Nunito Sans', sans-serif; /* corpo de texto */

  /* Layout */
  --radius-sm:     8px;
  --radius-md:     14px;
  --radius-lg:     20px;
}
```

> **Regra de ouro:** Nunca usar `#000000`, `#333333` ou cinzas neutros. Todo texto usa a família verde acima. Nunca usar branco puro (`#fff`) como fundo de página — usar `--bg-primary`.

---

## 3. Estrutura de Arquivos

```
eensa-avisos/
├── public/
│   ├── logo_eensa.png
│   ├── manifest.json          ← PWA manifest
│   └── icons/                 ← ícones PWA 192x192 e 512x512
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← RootLayout com fontes e metadata
│   │   ├── page.tsx            ← Tela pública (/)
│   │   ├── admin/
│   │   │   ├── page.tsx        ← Painel admin (/admin)
│   │   │   └── layout.tsx      ← Guard de autenticação
│   │   ├── login/
│   │   │   └── page.tsx        ← Login (/login)
│   │   ├── tv/
│   │   │   └── page.tsx        ← Modo TV fullscreen (/tv)
│   │   └── globals.css         ← CSS variables + resets
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Badge.tsx       ← Badge de prioridade
│   │   │   ├── Button.tsx      ← Botão reutilizável
│   │   │   ├── Toast.tsx       ← Notificação temporária
│   │   │   └── Modal.tsx       ← Modal genérico
│   │   ├── avisos/
│   │   │   ├── AvisoCard.tsx   ← Card de um aviso
│   │   │   ├── AvisoForm.tsx   ← Formulário criar/editar
│   │   │   ├── AvisoList.tsx   ← Lista agrupada por prioridade
│   │   │   └── AvisoFilters.tsx← Filtros da tela pública
│   │   ├── layout/
│   │   │   ├── Header.tsx      ← Cabeçalho global
│   │   │   ├── Clock.tsx       ← Relógio em tempo real
│   │   │   └── PageWrapper.tsx ← Container de página
│   │   └── admin/
│   │       ├── StatsRow.tsx    ← Cards de estatísticas
│   │       └── AvisosTable.tsx ← Tabela de gestão
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       ← Supabase browser client
│   │   │   ├── server.ts       ← Supabase server client (SSR)
│   │   │   └── queries.ts      ← Todas as queries do banco
│   │   └── utils.ts            ← Helpers de data, formatação
│   │
│   ├── hooks/
│   │   ├── useAvisos.ts        ← Fetch + realtime de avisos
│   │   ├── useAuth.ts          ← Estado de autenticação
│   │   └── useClock.ts         ← Relógio atualizado a cada segundo
│   │
│   └── types/
│       └── index.ts            ← Tipos TypeScript globais
│
├── .env.local                  ← Variáveis de ambiente (não comitar)
├── .env.example                ← Template de variáveis
├── next.config.js              ← Config Next.js (export estático)
├── tailwind.config.ts          ← Configuração Tailwind
└── tsconfig.json
```

---

## 4. Tipos TypeScript

```typescript
// src/types/index.ts

export type Prioridade = 'urgente' | 'normal' | 'info';

export type Categoria =
  | 'Geral'
  | 'Reunião'
  | 'Avaliações'
  | 'Esportes'
  | 'Evento'
  | 'Cultura'
  | 'Regra'
  | 'Informativo';

export interface Aviso {
  id: number;
  titulo: string;
  corpo: string;
  prioridade: Prioridade;
  categoria: Categoria;
  autor: string;
  criado_em: string;        // ISO 8601
  expira_em: string | null; // ISO 8601 — null = não expira
  ativo: boolean;
}

export interface AvisoFormData {
  titulo: string;
  corpo: string;
  prioridade: Prioridade;
  categoria: Categoria;
  autor: string;
  expira_em: string | null;
}

export interface AvisosGrouped {
  urgentes: Aviso[];
  normais: Aviso[];
  infos: Aviso[];
}

export interface StatsData {
  total: number;
  ativos: number;
  urgentes: number;
  expirados: number;
}
```

---

## 5. Banco de Dados — Supabase

### Schema SQL (executar no SQL Editor do Supabase)

```sql
-- ─────────────────────────────────────────────
--  EENSA — Quadro de Avisos
--  Execute no Supabase SQL Editor
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS avisos (
  id          BIGSERIAL PRIMARY KEY,
  titulo      TEXT        NOT NULL CHECK (char_length(titulo) BETWEEN 5 AND 120),
  corpo       TEXT        NOT NULL CHECK (char_length(corpo) BETWEEN 10 AND 2000),
  prioridade  TEXT        NOT NULL DEFAULT 'normal'
                CHECK (prioridade IN ('urgente', 'normal', 'info')),
  categoria   TEXT        NOT NULL DEFAULT 'Geral'
                CHECK (categoria IN (
                  'Geral','Reunião','Avaliações','Esportes',
                  'Evento','Cultura','Regra','Informativo'
                )),
  autor       TEXT        NOT NULL CHECK (char_length(autor) BETWEEN 2 AND 80),
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira_em   TIMESTAMPTZ,
  ativo       BOOLEAN     NOT NULL DEFAULT TRUE
);

-- Índices de performance
CREATE INDEX idx_avisos_ativos_expira
  ON avisos(ativo, expira_em)
  WHERE ativo = TRUE;

CREATE INDEX idx_avisos_prioridade
  ON avisos(prioridade, criado_em DESC);

-- ─── Row Level Security ───────────────────────
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode LER avisos ativos e não expirados
CREATE POLICY "leitura_publica" ON avisos
  FOR SELECT USING (true);

-- Apenas usuários autenticados podem ESCREVER
CREATE POLICY "escrita_autenticada" ON avisos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "edicao_autenticada" ON avisos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "exclusao_autenticada" ON avisos
  FOR DELETE USING (auth.role() = 'authenticated');

-- ─── Dados iniciais ───────────────────────────
INSERT INTO avisos (titulo, corpo, prioridade, categoria, autor, expira_em)
VALUES
  (
    'Bem-vindos ao novo Quadro de Avisos Digital!',
    'A EENSA estreia o seu quadro de avisos digital. Aqui você encontra todos os comunicados da escola, organizados por urgência e sempre atualizados. Qualquer dúvida, procure a secretaria.',
    'info', 'Geral', 'Direção',
    NOW() + INTERVAL '30 days'
  );
```

### Supabase — Criar usuário admin

```
Supabase Dashboard → Authentication → Users → Add User
E-mail: admin@eensa.edu.br
Senha:  (defina uma senha forte, mínimo 12 caracteres)
```

---

## 6. Variáveis de Ambiente

```bash
# .env.example — copie para .env.local e preencha

NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_publica_aqui
```

---

## 7. Configurações Base

### next.config.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // gera pasta /out para GitHub Pages
  trailingSlash: true,        // compatibilidade com Pages
  images: { unoptimized: true },
  experimental: {
    // permite usar Supabase SSR no App Router
  },
};

module.exports = nextConfig;
```

### tailwind.config.ts

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body:    ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        eensa: {
          green:       '#1A6B2E',
          'green-mid': '#2D8A47',
          'green-lt':  '#A8D8B4',
          teal:        '#2BAAC7',
          'teal-lt':   '#C4EAF4',
          orange:      '#F28C30',
          'orange-lt': '#FDECD8',
          yellow:      '#F5C840',
          'yellow-lt': '#FEF7DC',
          bg:          '#F3F8F0',
          surface:     '#FFFFFF',
          surface2:    '#EBF4E6',
          text:        '#1A3A22',
          text2:       '#4A7A5A',
          text3:       '#7DAA8A',
          border:      '#D4EADB',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(26,107,46,0.07)',
        md: '0 4px 20px rgba(26,107,46,0.11)',
        lg: '0 8px 40px rgba(26,107,46,0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### src/app/globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Nunito+Sans:wght@400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary:     #F3F8F0;
  --bg-surface:     #FFFFFF;
  --bg-surface2:    #EBF4E6;
  --green-dark:     #1A6B2E;
  --green-mid:      #2D8A47;
  --green-light:    #A8D8B4;
  --urgente:        #F28C30;
  --urgente-bg:     #FDECD8;
  --urgente-border: #F5C9A0;
  --normal:         #2BAAC7;
  --normal-bg:      #C4EAF4;
  --normal-border:  #9ED8EC;
  --info:           #F5C840;
  --info-bg:        #FEF7DC;
  --info-border:    #F0DA90;
  --text-primary:   #1A3A22;
  --text-secondary: #4A7A5A;
  --text-muted:     #7DAA8A;
  --border:         #D4EADB;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: 'Nunito Sans', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Nunito', sans-serif;
  color: var(--text-primary);
}

/* Animações globais */
@keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp   { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
@keyframes slideLeft { from { transform: translateX(40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
@keyframes pulse     { 0%,100% { opacity: 1 } 50% { opacity: 0.6 } }

.animate-fade-in  { animation: fadeIn  0.2s ease; }
.animate-slide-up { animation: slideUp 0.25s ease; }
.animate-pulse-soft { animation: pulse 2s ease-in-out infinite; }

/* Scrollbar discreta */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-surface2); }
::-webkit-scrollbar-thumb { background: var(--green-light); border-radius: 3px; }
```

---

## 8. Supabase Client

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// src/lib/supabase/queries.ts
import { createClient } from './client';
import type { Aviso, AvisoFormData } from '@/types';

const sb = createClient();

/** Retorna todos os avisos ativos e não expirados, ordenados por prioridade */
export async function getAvisosAtivos(): Promise<Aviso[]> {
  const { data, error } = await sb
    .from('avisos')
    .select('*')
    .eq('ativo', true)
    .or(`expira_em.is.null,expira_em.gte.${new Date().toISOString()}`)
    .order('prioridade', { ascending: true }) // urgente < normal < info alfabeticamente
    .order('criado_em', { ascending: false });

  if (error) throw error;

  // Reordenar: urgente → normal → info
  const ordem: Record<string, number> = { urgente: 0, normal: 1, info: 2 };
  return (data as Aviso[]).sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
}

/** Retorna TODOS os avisos (para o painel admin) */
export async function getTodosAvisos(): Promise<Aviso[]> {
  const { data, error } = await sb
    .from('avisos')
    .select('*')
    .order('criado_em', { ascending: false });
  if (error) throw error;
  return data as Aviso[];
}

/** Cria novo aviso */
export async function criarAviso(form: AvisoFormData): Promise<Aviso> {
  const { data, error } = await sb
    .from('avisos')
    .insert([{ ...form, ativo: true }])
    .select()
    .single();
  if (error) throw error;
  return data as Aviso;
}

/** Edita aviso existente */
export async function editarAviso(id: number, form: Partial<AvisoFormData>): Promise<Aviso> {
  const { data, error } = await sb
    .from('avisos')
    .update(form)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Aviso;
}

/** Remove aviso permanentemente */
export async function deletarAviso(id: number): Promise<void> {
  const { error } = await sb.from('avisos').delete().eq('id', id);
  if (error) throw error;
}

/** Assina canal real-time de mudanças na tabela avisos */
export function subscribeToAvisos(callback: () => void) {
  return sb
    .channel('avisos-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'avisos',
    }, callback)
    .subscribe();
}
```

---

## 9. Hooks

```typescript
// src/hooks/useAvisos.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { getAvisosAtivos, subscribeToAvisos } from '@/lib/supabase/queries';
import type { Aviso, AvisosGrouped } from '@/types';

export function useAvisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAvisosAtivos();
      setAvisos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    const channel = subscribeToAvisos(carregar);
    return () => { channel.unsubscribe(); };
  }, [carregar]);

  const grouped: AvisosGrouped = {
    urgentes: avisos.filter(a => a.prioridade === 'urgente'),
    normais:  avisos.filter(a => a.prioridade === 'normal'),
    infos:    avisos.filter(a => a.prioridade === 'info'),
  };

  return { avisos, grouped, loading, error, recarregar: carregar };
}
```

```typescript
// src/hooks/useClock.ts
'use client';
import { useState, useEffect } from 'react';

export function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return now;
}
```

```typescript
// src/hooks/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const [logado, setLogado]   = useState(false);
  const [loading, setLoading] = useState(true);
  const sb = createClient();

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setLogado(!!data.session);
      setLoading(false);
    });
    const { data: listener } = sb.auth.onAuthStateChange((_event, session) => {
      setLogado(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, senha: string) => {
    const { error } = await sb.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
  };

  const logout = async () => {
    await sb.auth.signOut();
  };

  return { logado, loading, login, logout };
}
```

---

## 10. Utilitários

```typescript
// src/lib/utils.ts
import type { Aviso, Prioridade } from '@/types';

/** Formata data para pt-BR */
export const formatData = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Formata data + hora para pt-BR */
export const formatDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

/** Dias restantes até expiração (negativo = expirado) */
export const diasRestantes = (expira_em: string | null): number | null => {
  if (!expira_em) return null;
  return Math.ceil((new Date(expira_em).getTime() - Date.now()) / 86_400_000);
};

/** Verifica se aviso está expirado */
export const isExpirado = (aviso: Aviso): boolean => {
  if (!aviso.expira_em) return false;
  return new Date(aviso.expira_em) < new Date();
};

/** Labels e cores por prioridade */
export const prioridadeConfig: Record<Prioridade, {
  label: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  barColor: string;
}> = {
  urgente: {
    label: 'Urgente',
    emoji: '🔴',
    bgColor: 'bg-[#FDECD8]',
    textColor: 'text-[#A04010]',
    borderColor: 'border-[#F5C9A0]',
    barColor: 'bg-[#F28C30]',
  },
  normal: {
    label: 'Normal',
    emoji: '🔵',
    bgColor: 'bg-[#C4EAF4]',
    textColor: 'text-[#1A7A95]',
    borderColor: 'border-[#9ED8EC]',
    barColor: 'bg-[#2BAAC7]',
  },
  info: {
    label: 'Informativo',
    emoji: '🟡',
    bgColor: 'bg-[#FEF7DC]',
    textColor: 'text-[#9A7A00]',
    borderColor: 'border-[#F0DA90]',
    barColor: 'bg-[#F5C840]',
  },
};
```

---

## 11. Componentes — Especificações Detalhadas

### 11.1 AvisoCard

```typescript
// src/components/avisos/AvisoCard.tsx
// Props:
interface AvisoCardProps {
  aviso: Aviso;
  isAdmin?: boolean;              // exibe botões editar/deletar
  onEdit?: (aviso: Aviso) => void;
  onDelete?: (id: number) => void;
}

// Comportamento visual:
// - Borda esquerda colorida de 5px (cor = prioridade)
// - Background suave da cor da prioridade (ver prioridadeConfig)
// - Hover: translateY(-2px) + shadow maior
// - Expiração:
//     dias < 0     → badge cinza "Expirado"
//     dias === 0   → vermelho "⏰ Expira hoje"
//     dias <= 2    → laranja "⚡ Expira em N dia(s)"
//     dias > 2     → muted "📅 Até DD/MM/YYYY"
// - Título urgente usa cor #A04010 (laranja escuro)
// - Título normal/info usa --text-primary
// - Badges: prioridade (colorido) + categoria (chip neutro)
```

### 11.2 AvisoForm (Modal)

```typescript
// src/components/avisos/AvisoForm.tsx
// Props:
interface AvisoFormProps {
  aviso?: Aviso | null;           // null = criação, Aviso = edição
  onSave: (data: AvisoFormData) => Promise<void>;
  onClose: () => void;
}

// Campos:
// 1. titulo          → input text, required, max 120 chars
// 2. corpo           → textarea, required, min 10 chars, mostra contador
// 3. prioridade      → 3 botões visuais (urgente/normal/info) com cores
// 4. categoria       → select com as 8 opções do tipo Categoria
// 5. autor           → input text, required
// 6. expira_em       → datetime-local, valor padrão = hoje + 7 dias

// Validação client-side antes de chamar onSave:
// - titulo: não vazio, mínimo 5 chars
// - corpo: não vazio, mínimo 10 chars
// - autor: não vazio
// Exibir mensagem de erro inline abaixo de cada campo inválido
```

### 11.3 Header

```typescript
// src/components/layout/Header.tsx
// Fixo no topo (sticky), altura 68px
// Esquerda: logo_eensa.png (height 44px) + nome "EENSA" + subtítulo "Construindo Histórias"
// Centro/direita: tabs "📢 Avisos" | "⚙️ Gestão"
// Se logado: botão "Sair" à direita
// Background: white, border-bottom: var(--border), box-shadow suave
// Em mobile (<640px): esconder subtítulo, comprimir logo
```

### 11.4 Clock (Modo TV)

```typescript
// src/components/layout/Clock.tsx
// Barra verde escuro (--green-dark) no topo, altura 44px
// Esquerda: data por extenso "Quarta-feira, 18 de março de 2025"
// Direita: hora "14:32:07" — atualiza via useClock() a cada segundo
// Apenas exibida no /tv
```

### 11.5 StatsRow

```typescript
// src/components/admin/StatsRow.tsx
// 4 cards em grid
// Card 1: "Ativos"    — número verde
// Card 2: "Urgentes"  — número laranja, borda laranja-claro
// Card 3: "Total"     — número teal
// Card 4: "Expirados" — número muted
// Cada card: fundo branco, borda --border, padding 20px, border-radius md
// Número: Nunito 800 28px; Label: 12px text-muted
```

---

## 12. Páginas — Especificações

### 12.1 Tela Pública — `/` (page.tsx)

```typescript
// Comportamento:
// 1. Usa useAvisos() para buscar e receber real-time
// 2. Mostra loading skeleton (3 cards placeholder) enquanto carrega
// 3. Se houver urgentes: banner laranja no topo antes dos cards
//    "🔔 N aviso(s) urgente(s) — leia com atenção"
// 4. Seções separadas:
//    - 🔴 Urgentes
//    - 🔵 Comunicados
//    - 🟡 Informativos
// 5. Cada seção tem um divisor com label
// 6. Se nenhuma seção: empty state com ícone 📭
// 7. Botão "📺 Modo TV" no canto superior direito → navega para /tv
// 8. Botão flutuante de filtro no mobile (filtrar por categoria)
```

### 12.2 Modo TV — `/tv` (page.tsx)

```typescript
// Comportamento:
// 1. Clock no topo (barra verde)
// 2. Logo centralizada, maior
// 3. Avisos com fonte ~30% maior que tela normal
// 4. Auto-scroll lento (CSS scroll-behavior + interval) se houver muitos avisos
// 5. Atualização automática via real-time (sem necessidade de reload)
// 6. Botão discreto "← Sair do modo TV" canto inferior direito
// 7. Remover Header padrão (tem layout próprio)
// Uso: monitor/TV no corredor da escola — deixar em fullscreen (F11)
```

### 12.3 Painel Admin — `/admin` (page.tsx)

```typescript
// Guard: se não logado, redireciona para /login
// Usa getTodosAvisos() (incluindo expirados)
//
// Layout:
// 1. StatsRow no topo
// 2. Tabs: "📋 Avisos ativos" | "📦 Expirados"
// 3. Botão "+ Novo aviso" abre AvisoForm em modal
// 4. Lista de avisos com botões Editar / Excluir em cada item
// 5. Confirmação antes de excluir (window.confirm ou modal simples)
// 6. Toast de feedback após cada ação (sucesso / erro)
//
// Ações:
// - Criar: abre AvisoForm vazio → chama criarAviso() → recarrega lista
// - Editar: abre AvisoForm preenchido → chama editarAviso() → recarrega
// - Excluir: confirmação → chama deletarAviso() → remove da lista
```

### 12.4 Login — `/login` (page.tsx)

```typescript
// Card centralizado na tela (max-width 380px)
// Logo da escola acima do formulário
// Campos: e-mail + senha
// Enter no campo senha faz submit
// Erro exibido inline (não alert)
// Após login bem-sucedido: redirect para /admin
// Se já logado: redirect imediato para /admin
```

---

## 13. PWA Manifest

```json
// public/manifest.json
{
  "name": "EENSA — Quadro de Avisos",
  "short_name": "EENSA Avisos",
  "description": "Quadro de avisos digital da Escola Estadual Nilo Santos de Araújo",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F3F8F0",
  "theme_color": "#1A6B2E",
  "orientation": "any",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```typescript
// src/app/layout.tsx — metadata para PWA
export const metadata: Metadata = {
  title: 'EENSA — Quadro de Avisos',
  description: 'Quadro de avisos digital da EENSA',
  manifest: '/manifest.json',
  themeColor: '#1A6B2E',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'EENSA Avisos' },
};
```

---

## 14. Deploy — GitHub Pages

### package.json scripts

```json
{
  "scripts": {
    "dev":    "next dev",
    "build":  "next build",
    "export": "next build && next export",
    "deploy": "npm run export && touch out/.nojekyll"
  }
}
```

### GitHub Actions — `.github/workflows/deploy.yml`

```yaml
name: Deploy EENSA Avisos

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          NEXT_PUBLIC_SUPABASE_URL:      ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Add .nojekyll
        run: touch out/.nojekyll

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out/

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Configurar Secrets no GitHub
```
Repositório → Settings → Secrets → Actions → New repository secret
NEXT_PUBLIC_SUPABASE_URL      = https://seu_projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sua_chave_anon_aqui
```

---

## 15. Checklist de Implementação

Use esta ordem para construir com o Copilot/Claude Sonnet:

```
[ ] 1. Criar projeto:  npx create-next-app@latest eensa-avisos --typescript --tailwind --app
[ ] 2. Instalar deps:  npm install @supabase/ssr @supabase/supabase-js
[ ] 3. Configurar:     .env.local, next.config.js, tailwind.config.ts, globals.css
[ ] 4. Criar tipos:    src/types/index.ts
[ ] 5. Supabase:       src/lib/supabase/client.ts + queries.ts
[ ] 6. Hooks:          useAvisos.ts, useAuth.ts, useClock.ts
[ ] 7. Utils:          src/lib/utils.ts
[ ] 8. Componentes UI: Badge, Button, Toast, Modal
[ ] 9. Componentes Aviso: AvisoCard, AvisoForm, AvisoList
[ ] 10. Layout:        Header, Clock, PageWrapper
[ ] 11. Admin:         StatsRow, AvisosTable
[ ] 12. Páginas:       /, /login, /admin, /tv
[ ] 13. PWA:           manifest.json + metadata no layout.tsx
[ ] 14. GitHub Actions: .github/workflows/deploy.yml
[ ] 15. Supabase SQL:  executar schema no dashboard
[ ] 16. GitHub Secrets: configurar variáveis
[ ] 17. Push → deploy automático via Actions
```

---

## 16. Instruções para o Copilot / Claude Sonnet

> Cole este bloco como contexto inicial em cada sessão de geração de código.

```
Você está construindo o sistema EENSA — Quadro de Avisos Digital.
Stack: Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase.

REGRAS INVIOLÁVEIS:
1. Nunca usar cores pretas (#000), cinzas neutros ou branco puro como fundo de página
2. Sempre usar a paleta de cores definida em globals.css (família verde/teal/laranja/amarelo)
3. Fonte display = Nunito (800 para títulos), fonte body = Nunito Sans
4. Todos os tipos estão em src/types/index.ts — não recriar
5. Toda lógica de banco está em src/lib/supabase/queries.ts — usar só essas funções
6. Componentes devem ser Server Components por padrão; adicionar 'use client' só quando necessário
7. Seguir a estrutura de arquivos definida no documento de contexto
8. Avisos urgentes sempre exibidos primeiro, com destaque visual
9. Real-time via Supabase Realtime já configurado no useAvisos hook — não duplicar
10. O sistema é para uma escola pública brasileira — tom amigável, acessível, sem jargão técnico na UI
```

---

*Documento gerado para a EENSA — Escola Estadual Nilo Santos de Araújo*  
*"Construindo Histórias..." · Sistema de Avisos Digital v1.0*
