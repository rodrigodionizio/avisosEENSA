# 📚 Histórico Completo de Desenvolvimento - Sistema de Avisos EENSA

> **Documentação Técnica Completa**  
> Projeto: Sistema de Avisos Digitais E.E.N.S.A  
> Período: Março 2026  
> Autor: Rodrigo Dionizio  
> Última Atualização: 19/03/2026

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Cronologia de Desenvolvimento](#cronologia-de-desenvolvimento)
4. [Commits Detalhados](#commits-detalhados)
5. [Problemas Encontrados e Soluções](#problemas-encontrados-e-soluções)
6. [Arquitetura do Sistema](#arquitetura-do-sistema)
7. [Guia de Deploy](#guia-de-deploy)
8. [Referências e Recursos](#referências-e-recursos)

---

## 🎯 Visão Geral do Projeto

### Objetivo
Desenvolver um sistema web moderno e responsivo para gerenciamento e exibição de avisos escolares na E.E.N.S.A (Escola Estadual Nossa Senhora Aparecida), com suporte a:

- ✅ Gestão administrativa de avisos
- ✅ Modo TV para exibição pública em monitores/TVs
- ✅ Links permanentes para compartilhamento via QR Code
- ✅ URLs amigáveis para SEO
- ✅ Sistema de prioridades (Urgente, Normal, Info)
- ✅ Configurações dinâmicas em tempo real

### Funcionalidades Principais

#### 1. Painel Administrativo
- Autenticação via Supabase Auth
- CRUD completo de avisos
- Dashboard com estatísticas
- Configurações do Modo TV
- Visualização de usuário logado

#### 2. Modo TV
- Slider automático de avisos ativos
- QR Code para acesso rápido via mobile
- Design responsivo para projetores/TVs
- Configurações dinâmicas (timer, velocidade)
- Sincronização em tempo real

#### 3. Links Permanentes
- URLs amigáveis para SEO (`/aviso/slug-do-titulo`)
- Compatibilidade com IDs numéricos (redirect automático)
- Metadata OpenGraph para redes sociais
- Canonical URLs para SEO

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 16.1.7** - Framework React com SSR/SSG
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Turbopack** - Build tool ultrarrápido

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL 14+ (banco de dados)
  - Authentication (gestão de usuários)
  - Row Level Security (RLS)
  - Realtime Subscriptions (sincronização)

### DevOps
- **Vercel** - Hosting e deploy automático
- **GitHub** - Controle de versão
- **Git Flow** - Estratégia de branches

### Bibliotecas Auxiliares
- `qrcode.react` - Geração de QR Codes
- `@supabase/ssr` - Cliente Supabase para SSR
- `date-fns` - Manipulação de datas

---

## 📅 Cronologia de Desenvolvimento

### Fase 1: Setup Inicial (Commit cb2d56c)
**Data:** Início do projeto  
**Objetivo:** Estrutura base e configuração inicial

### Fase 2: Deploy e Configurações (Commits 47d4139 - 0252359)
**Data:** Primeiros dias  
**Objetivo:** Configurar deploy e corrigir ambiente

### Fase 3: Modo TV Profissional (Commits 5c65962 - 51f67db)
**Data:** Desenvolvimento intermediário  
**Objetivo:** Implementar visualização para TVs públicas

### Fase 4: Configurações Dinâmicas (Commits 46ecc91 - 9a1fd8c)
**Data:** Evolução do Modo TV  
**Objetivo:** Sistema de configurações persistentes

### Fase 5: Links Permanentes (Commit 6896563)
**Data:** 19/03/2026 09:44  
**Objetivo:** Rotas dinâmicas para avisos individuais

### Fase 6: URLs Amigáveis (Commit 38f6e76) ⭐
**Data:** 19/03/2026 10:38  
**Objetivo:** SEO e UX com slugs

### Fase 7: Sistema de Agendamento (Commits 228963f) 🚀
**Data:** 19/03/2026 (tarde)  
**Objetivo:** Permitir agendamento de avisos para publicação futura

**Funcionalidades Implementadas:**
- Campo `publica_em` adicionado aos formulários
- Validação: data de publicação deve ser antes da expiração
- Filtros nas queries: apenas avisos com `publica_em <= NOW()` são exibidos
- UI com dois campos datetime: 📅 Publicação + ⏰ Expiração
- Valor padrão: NOW() para publicação imediata

**Arquivos Modificados:**
- `types/index.ts` - Adicionado campo `publica_em`
- `components/avisos/AvisoForm.tsx` - UI de agendamento
- `lib/supabase/queries.ts` - Filtro `.lte('publica_em', now)`
- `lib/supabase/queries-server.ts` - Filtro server-side

**Benefícios:**
- ✅ Admins podem preparar avisos com antecedência
- ✅ Publicação automática no horário agendado
- ✅ Melhor controle de conteúdo

### Fase 8: Aba "Agendados" no Dashboard (Commit e434851) 📋
**Data:** 19/03/2026 (tarde)  
**Objetivo:** Visualizar avisos que ainda não foram publicados

**Funcionalidades Implementadas:**
- Nova aba "Agendados" entre "Ativos" e "Expirados"
- Filtro: `publica_em > NOW()`
- Ordenação por data de publicação (próximos primeiro)
- Card de estatísticas roxo para avisos agendados
- Grid responsivo: 2 cols (mobile) → 3 (tablet) → 5 (desktop)

**Arquivos Modificados:**
- `app/admin/page.tsx` - Lógica de filtragem e aba
- `components/admin/StatsRow.tsx` - Card de estatísticas
- `types/index.ts` - Campo `agendados` em `StatsData`

**Benefícios:**
- ✅ Visibilidade de avisos programados
- ✅ UX: admins sabem quando cada aviso será publicado
- ✅ Organização: separação clara entre estados

### Fase 9: Modal de Confirmação Customizado (Commit 95c089f) 🎨
**Data:** 19/03/2026 (tarde)  
**Objetivo:** Melhorar UX ao excluir avisos

**Funcionalidades Implementadas:**
- Componente `ConfirmDialog.tsx` com identidade EENSA
- Substituição do `confirm()` nativo do browser
- Ícone de alerta triangular + mensagem personalizada
- Botões estilizados: "Cancelar" (secundário) e "Sim, excluir" (danger)
- Animações suaves (fadeOverlay + modal-up)
- Backdrop com blur

**Arquivos Criados:**
- `components/ui/ConfirmDialog.tsx` - Modal customizado
- `components/ui/Icons.tsx` - Ícone `AlertTriangle`

**Arquivos Modificados:**
- `app/admin/page.tsx` - Lógica de confirmação

**Benefícios:**
- ✅ UX profissional e consistente
- ✅ Mensagem clara com título do aviso
- ✅ Reduz erros de exclusão acidental

### Fase 10: Otimizações e Performance (Commit a3ab39c) ⚡
**Data:** 19/03/2026 (tarde)  
**Objetivo:** Limpar console e otimizar Modo TV

**Otimizações Implementadas:**

1. **Console Limpo:**
   - Removidos `console.log()` excessivos de queries
   - Configurado `autoRefreshToken` no Supabase client
   - Mantidos apenas logs de erro relevantes

2. **Modo TV Compacto:**
   - Largura: `1400px` → `1100px`
   - Altura: `500px` → `360-480px` (com max-height)
   - Padding: `p-12` → `p-8`
   - Título: `text-5xl` (48px) → `text-4xl` (36px)
   - Corpo: `text-3xl` (30px) → `text-2xl` (24px)
   - Badges: `text-lg` (18px) → `text-base` (16px)

3. **Documentação Criada:**
   - `.documentation/CONFIGURACOES_VISUAIS.md`
   - Guia completo de onde configurar tamanhos
   - Classes Tailwind úteis
   - Breakpoints responsivos

**Arquivos Modificados:**
- `components/tv/TVSlider.tsx` - Tamanhos reduzidos
- `lib/supabase/client.ts` - Configuração otimizada
- `lib/supabase/queries.ts` - Logs removidos
- `lib/supabase/settings-queries.ts` - Logs removidos

**Benefícios:**
- ✅ Console limpo facilita debug
- ✅ Cards menores cabem melhor em TVs
- ✅ Performance: menos re-renders desnecessários
- ✅ Documentação: manutenção facilitada

---

## 📝 Commits Detalhados

### Commit #1: Initial Commit
```
🎉 Initial commit: Sistema de Avisos EENSA
Hash: cb2d56c
Autor: Rodrigo Dionizio
Data: [Início do projeto]
```

**Descrição:**
Setup inicial do projeto Next.js com Tailwind CSS e estrutura base.

**Arquivos Criados:**
- Estrutura completa do projeto Next.js
- Configuração Tailwind CSS
- Componentes base (Header, Button, Modal, Toast)
- Hooks customizados (useAuth, useAvisos)
- Types TypeScript
- README.md inicial

**Tecnologias Configuradas:**
- Next.js com App Router
- TypeScript strict mode
- Tailwind CSS com custom colors (identidade EENSA)
- ESLint e Prettier

---

### Commit #2-4: Deploy e Ajustes
```
📚 Adiciona guia de deploy Vercel (47d4139)
🔄 Trigger GitHub Pages deploy (489f676)
🔧 Fix: Adiciona basePath para GitHub Pages (0252359)
🔧 Fix: Remove configuração obsoleta de eslint (01bd7e6)
```

**Contexto:**
Tentativas iniciais de deploy em diferentes plataformas.

**Problemas Encontrados:**

1. **GitHub Pages não suporta SSR**
   - Erro: Pages exige `output: 'export'` (modo estático)
   - Solução: Migrar para Vercel (suporta SSR nativo)

2. **Configuração basePath conflitante**
   - Erro: `basePath` causava 404 em arquivos estáticos
   - Solução: Remover `basePath` ao migrar para Vercel

3. **ESLint deprecated config**
   - Aviso: Configuração antiga do ESLint
   - Solução: Atualizar para flat config do ESLint 9

**Lições Aprendidas:**
- GitHub Pages é limitado a sites estáticos
- Vercel é a escolha ideal para Next.js SSR
- Sempre verificar compatibilidade antes de configurar

---

### Commit #5: Trigger Deploy
```
🚀 Trigger Vercel redeploy - Security patches applied
Hash: aa42037
```

**Objetivo:**
Forçar novo deploy após patches de segurança.

**Ação:**
- Adicionado comentário no README para trigger deploy
- Deploy automático via GitHub integration

---

### Commit #6: Footer e Informações
```
✏️ Atualiza informações da escola e adiciona Footer
Hash: ff4c841
```

**Modificações:**
- Atualização de textos institucionais
- Componente Footer com informações da escola
- Correção de links e contatos

---

### Commit #7: Exibição de Usuário
```
✨ Adiciona exibição do nome do usuário no Painel
Hash: bf90e42
```

**Feature:**
Header do painel admin agora mostra nome do usuário logado.

**Implementação:**
```typescript
// Extração do nome do email
const userName = user.email?.split('@')[0] || 'Usuário';
```

**UX:**
Melhor identificação visual de quem está logado.

---

### Commit #8-13: Modo TV Profissional
```
✨ Implementa Modo TV Profissional completo (5c65962)
🎨 Corrige identidade visual EENSA no Modo TV (e9603b0)
🔧 Otimiza espaçamento do Modo TV para melhor visualização (212657b)
🎨 Compacta header e suaviza cores dos avisos urgentes (f17dec0)
♻️ Reformula Modo TV: slider único + identidade visual EENSA (399cd2e)
```

**Contexto:**
Desenvolvimento iterativo do Modo TV através do branch `dev`.

#### Commit 5c65962: Base do Modo TV

**Arquivos Criados:**
- `app/tv/page.tsx` - Página principal do Modo TV
- `components/tv/TVSlider.tsx` - Componente slider
- `components/tv/TVTopBar.tsx` - Header do Modo TV
- `lib/tv-config.ts` - Configurações do slider

**Funcionalidades:**
- Slider automático de avisos ativos
- QR Code para acesso via mobile
- Design fullscreen para TVs
- Transições suaves entre slides
- Badge "Ao Vivo" animado

**Tecnologias:**
- React Hooks (useState, useEffect)
- qrcode.react para QR Codes
- Tailwind CSS para animações

#### Commit e9603b0: Identidade Visual

**Problema:**
Cores não seguiam identidade visual da EENSA.

**Solução:**
- Refatoração do design system
- Cores oficiais: Verde (#2D7E3E), Teal (#007A7A)
- Logo vetorial customizado

#### Commit 399cd2e: Reformulação UI

**Problema:**
Layout fragmentado, múltiplos sliders confusos.

**Solução:**
- Slider único unificado
- Card design inspirado em material design
- Melhor hierarquia visual

**Antes:**
```
[Slider Urgente] [Slider Normal] [Slider Info]
```

**Depois:**
```
[Slider Único com Todos Avisos]
```

#### Commit 51f67db: Merge para Main

**Release:**
Merge do branch `dev` para `main` com todas as features do Modo TV.

**Validação:**
- Build bem-sucedido
- Zero TypeScript errors
- Testes manuais em diferentes resoluções

---

### Commit #14: Configurações Dinâmicas
```
✨ Adiciona configurações dinâmicas do Modo TV via banco
Hash: 46ecc91
Data: 19/03/2026 08:09
```

**Motivação:**
Permitir que administradores ajustem parâmetros do Modo TV sem redeployar.

**Arquivos Criados:**

1. **SQL Migration:**
```sql
-- .supabase/CREATE_TV_SETTINGS.sql
CREATE TABLE tv_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slider_timer INTEGER DEFAULT 20,
  transition_speed INTEGER DEFAULT 500,
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
CREATE POLICY "tv_settings_select_public"
  ON tv_settings FOR SELECT TO public USING (true);

CREATE POLICY "tv_settings_update_authenticated"
  ON tv_settings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL);
```

2. **Queries Server:**
```typescript
// lib/supabase/settings-queries.ts
export async function getTVSettings(): Promise<TVSettings> { ... }
export async function updateTVSettings(settings: TVSettings): Promise<void> { ... }
export function subscribeTVSettings(callback: (settings: TVSettings) => void) { ... }
```

3. **Hook Customizado:**
```typescript
// hooks/useSettings.ts
export function useSettings() {
  const [settings, setSettings] = useState<TVSettings>(DEFAULT_SETTINGS);
  
  useEffect(() => {
    getTVSettings().then(setSettings);
    const unsubscribe = subscribeTVSettings(setSettings);
    return unsubscribe;
  }, []);
  
  return settings;
}
```

4. **Componente Admin:**
```typescript
// components/admin/TVSettingsForm.tsx
export function TVSettingsForm() {
  // Modal com sliders para ajuste
  // Preview em tempo real
  // Botão restaurar padrão
}
```

**Funcionalidades:**
- ✅ Slider para timer (15-35 segundos)
- ✅ Slider para velocidade de transição (300-1000ms)
- ✅ Preview instantâneo no modal
- ✅ Sincronização real-time (admin → TV)
- ✅ Validação de ranges
- ✅ Fallback para valores padrão

**Fluxo de Uso:**
1. Admin abre painel administrativo
2. Clica em "⚙️ Configurações Modo TV"
3. Ajusta sliders no modal
4. Clica "Salvar"
5. **TV atualiza automaticamente sem reload!**

---

### Commit #15: Fix Permissões RLS
```
🔧 Corrige permissões RLS da tabela tv_settings
Hash: 9a1fd8c
Data: 19/03/2026 08:14
```

**Problema Crítico:**
```
Error: permission denied for table tv_settings
Status: 403 Forbidden
```

**Causa Raiz:**
1. Policy RLS usando `auth.role()` (função não disponível no Supabase)
2. Faltavam GRANTs explícitos para roles `anon` e `authenticated`
3. Policy de UPDATE sem cláusula `WITH CHECK`

**Solução Implementada:**

```sql
-- .supabase/FIX_TV_SETTINGS_PERMISSIONS.sql

-- 1. Dropar policies antigas
DROP POLICY IF EXISTS "tv_settings_select_public" ON tv_settings;
DROP POLICY IF EXISTS "tv_settings_update_authenticated" ON tv_settings;

-- 2. Recriar com sintaxe correta
CREATE POLICY "tv_settings_select_public"
  ON tv_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "tv_settings_update_authenticated"
  ON tv_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);  -- CRÍTICO!

-- 3. GRANTs explícitos
GRANT SELECT ON tv_settings TO anon, authenticated;
GRANT UPDATE ON tv_settings TO authenticated;
GRANT USAGE ON tv_settings_id_seq TO authenticated;
```

**Lições Aprendidas:**
- Supabase não tem função `auth.role()`
- Usar `auth.uid() IS NOT NULL` para verificar autenticação
- Sempre incluir `WITH CHECK` em policies de UPDATE
- GRANTs explícitos são necessários mesmo com RLS

**Validação:**
- Testado com usuário anônimo (SELECT funcionando)
- Testado com usuário autenticado (UPDATE funcionando)
- Zero erros 403

---

### Commit #16: Header TV Melhorado
```
✨ Melhora header TV: logo clicável + timestamp atualização
Hash: de49906
Data: 19/03/2026 08:34
```

**Melhorias UX:**

1. **Logo Clicável:**
```tsx
<Link href="/" className="flex items-center gap-3">
  <EensaLogo variant="default" size={44} />
  <div>
    <div className="font-display font-extrabold text-xl">EENSA</div>
    <div className="text-xs">Construindo Histórias...</div>
  </div>
</Link>
```

2. **Timestamp de Atualização:**
```tsx
// Antes: Badge "Ao Vivo" genérico
<Badge>🔴 Ao Vivo</Badge>

// Depois: Timestamp específico
<div className="flex items-center gap-2">
  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
  <span>Atualizado: {formatDataHora(lastUpdate)}</span>
</div>
```

3. **Hook de Tracking:**
```typescript
// hooks/useAvisos.ts - Adicionar lastUpdate
export function useAvisos() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  useEffect(() => {
    const subscription = supabase
      .channel('avisos-realtime')
      .on('postgres_changes', { ... }, () => {
        setLastUpdate(new Date());  // Atualizar timestamp
      })
      .subscribe();
  }, []);
  
  return { avisos, lastUpdate };
}
```

**Resultados:**
- Melhor percepção de dados ao vivo
- Navegação facilitada (logo clicável)
- Informação mais precisa que "Ao Vivo"

---

### Commit #17: Links Permanentes
```
feat: implement dynamic aviso page with detailed view and sharing options
Hash: 6896563
Data: 19/03/2026 09:44
```

**Motivação:**
QR Codes no Modo TV precisavam apontar para páginas individuais de avisos.

**Feature Completa: Rotas Dinâmicas**

#### Arquivos Criados:

1. **Rota Dinâmica:**
```typescript
// app/aviso/[id]/page.tsx
interface AvisoPageProps {
  params: Promise<{ id: string }>;  // Next.js 15+ requires Promise
}

export default async function AvisoPage({ params }: AvisoPageProps) {
  const { id } = await params;  // Async params!
  const avisoId = parseInt(id, 10);
  
  if (isNaN(avisoId) || avisoId <= 0) {
    notFound();
  }
  
  const aviso = await getAvisoPorId(avisoId);
  
  if (!aviso) {
    notFound();
  }
  
  // Renderizar página...
}
```

2. **Componente de Detalhes:**
```typescript
// components/avisos/AvisoDetailCard.tsx
export function AvisoDetailCard({ aviso }: { aviso: Aviso }) {
  return (
    <article className="bg-white rounded-2xl shadow-lg p-8">
      <Badge prioridade={aviso.prioridade} />
      <h1 className="text-3xl font-bold">{aviso.titulo}</h1>
      <p className="text-lg whitespace-pre-wrap">{aviso.corpo}</p>
      <footer>
        <time>Publicado em: {formatDataHora(aviso.criado_em)}</time>
      </footer>
    </article>
  );
}
```

3. **Lista de Sugestões:**
```typescript
// components/avisos/AvisoLinksList.tsx
export function AvisoLinksList({ avisos }: { avisos: Aviso[] }) {
  return (
    <aside>
      <h2>Outros Avisos</h2>
      {avisos.map(aviso => (
        <Link key={aviso.id} href={`/aviso/${aviso.id}`}>
          {aviso.titulo}
        </Link>
      ))}
    </aside>
  );
}
```

4. **Botão de Compartilhamento:**
```typescript
// components/ui/ShareButton.tsx
export function ShareButton({ url, titulo }: ShareButtonProps) {
  const share = async () => {
    if (navigator.share) {
      // Web Share API (mobile)
      await navigator.share({ title: titulo, url });
    } else {
      // Fallback: clipboard
      await navigator.clipboard.writeText(url);
    }
  };
  
  return <Button onClick={share}>Compartilhar</Button>;
}
```

5. **Metadata SEO:**
```typescript
// app/aviso/[id]/page.tsx
export async function generateMetadata({ params }: AvisoPageProps) {
  const { id } = await params;
  const aviso = await getAvisoPorId(parseInt(id));
  
  if (!aviso) return { title: 'Aviso não encontrado' };
  
  return {
    title: `${aviso.titulo} - EENSA`,
    description: aviso.corpo.substring(0, 160),
    openGraph: {
      title: aviso.titulo,
      description: aviso.corpo,
      type: 'article',
      siteName: 'EENSA - Avisos Escolares',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary',
      title: aviso.titulo,
      description: aviso.corpo,
    },
  };
}
```

#### Configuração Next.js:

**Problema Inicial:**
```javascript
// next.config.js - ANTES
module.exports = {
  output: 'export',  // Modo estático (incompatível com rotas dinâmicas!)
  trailingSlash: true,
}
```

**Erro:**
```
Error: Dynamic routes require server-side rendering
Routes with [id] cannot be exported as static HTML
```

**Solução:**
```javascript
// next.config.js - DEPOIS
module.exports = {
  // Remover 'output: export'
  trailingSlash: false,  // Melhor para SEO
}
```

#### Migration SQL:

```sql
-- .supabase/MIGRATION_FEATURES_COMPLETO.sql
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS publica_em TIMESTAMP DEFAULT NOW();
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS expira_em TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days');

-- Index para performance
CREATE INDEX IF NOT EXISTS idx_avisos_publicacao 
  ON avisos(publica_em, expira_em);

-- Função para avisos ativos
CREATE OR REPLACE FUNCTION get_avisos_ativos()
RETURNS SETOF avisos AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM avisos
  WHERE publica_em <= NOW()
    AND expira_em >= NOW()
  ORDER BY criado_em DESC;
END;
$$ LANGUAGE plpgsql;
```

**PROBLEMA CRÍTICO ENCONTRADO:**
```
Error creating index: functions in index predicate must be marked IMMUTABLE
```

**Causa:**
```sql
-- ERRADO: NOW() é STABLE, não IMMUTABLE
CREATE INDEX idx_avisos_ativos 
  ON avisos(id) 
  WHERE publica_em <= NOW() AND expira_em >= NOW();
```

**Solução:**
```sql
-- CERTO: Remover WHERE clause do índice
CREATE INDEX idx_avisos_publicacao 
  ON avisos(publica_em, expira_em);
-- Filtrar no SELECT, não no índice
```

#### Queries Server-Side:

```typescript
// lib/supabase/queries-server.ts
export async function getAvisoPorId(id: number): Promise<Aviso | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('avisos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Erro ao buscar aviso:', error);
    return null;
  }
  
  return data;
}

export async function getOutrosAvisosAtivos(excludeId: number): Promise<Aviso[]> {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('avisos')
    .select('*')
    .neq('id', excludeId)
    .lte('publica_em', new Date().toISOString())
    .gte('expira_em', new Date().toISOString())
    .order('criado_em', { ascending: false })
    .limit(5);
  
  return data || [];
}
```

#### Problema: 404 em Rotas Dinâmicas

**Erro:**
```
GET /aviso/1 → 404 Not Found (esperado: 200 OK)
```

**Diagnóstico:**

1. **Verificar Build:**
```bash
npm run build
# Output esperado:
# ƒ /aviso/[id] (Dynamic) ✅
```

2. **Testar RLS:**
```sql
-- Verificar se RLS permite SELECT anônimo
SELECT * FROM avisos WHERE id = 1;  -- Deve retornar dados
```

3. **Debug Queries:**
```typescript
console.log('🔍 Buscando aviso ID:', id);
const aviso = await getAvisoPorId(id);
console.log('📦 Aviso retornado:', aviso);
```

**Causa Raiz:**
```typescript
// PROBLEMA: app/aviso/[id]/page.tsx importando cliente browser
import { createClient } from '@/lib/supabase/client';  // ❌ Browser only!

export default async function AvisoPage() {
  const supabase = createClient();  // Falha silenciosa no SSR!
  const { data } = await supabase.from('avisos').select('*');
  // data é sempre null em Server Components!
}
```

**Explicação Técnica:**
- `createClient()` em `lib/supabase/client.ts` usa `createBrowserClient()`
- Browser client requer `window` object
- Server Components não têm `window`
- Operação falha silenciosamente, retorna `null`

**Solução: Dual Client Architecture**

Criar cliente separado para Server Components:

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called in Server Component (read-only context)
            // Safe to ignore in read-only operations
          }
        },
      },
    }
  );
}
```

**Atualizar Imports:**
```typescript
// app/aviso/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';  // ✅ Server client

export default async function AvisoPage() {
  const supabase = await createClient();  // Agora funciona!
  const { data } = await supabase.from('avisos').select('*');
  // data retorna corretamente!
}
```

#### Problema: Next.js 15+ Async Params

**Erro de Build:**
```
Type error: Property 'id' does not exist on type 'Promise<{ id: string }>'
```

**Causa:**
Next.js 15+ mudou `params` de síncrono para assíncrono.

**ERRADO (Next.js 14-):**
```typescript
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;  // Síncrono
}
```

**CERTO (Next.js 15+):**
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  // Async/await obrigatório!
}
```

**Atualização Completa:**
```typescript
interface AvisoPageProps {
  params: Promise<{ id: string }>;  // Promise!
}

export default async function AvisoPage({ params }: AvisoPageProps) {
  const { id } = await params;  // Await!
  // ... resto do código
}

export async function generateMetadata({ params }: AvisoPageProps) {
  const { id } = await params;  // Await também no metadata!
  // ... resto do código
}
```

#### Build Final:

```bash
npm run build

✓ Compiled successfully in 2.3s
✓ Finished TypeScript in 2.4s
✓ Collecting page data using 11 workers in 561.1ms
✓ Generating static pages using 11 workers (6/6) in 1280.8ms
✓ Finalizing page optimization in 13.4ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /admin
├ ƒ /aviso/[id]        ← Dynamic route! ✅
├ ○ /login
└ ○ /tv

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**Validação:**
- ✅ Build sem erros TypeScript
- ✅ Rota detectada como Dynamic
- ✅ Server Components funcionando
- ✅ Queries retornando dados
- ✅ QR Code gerando URL correta
- ✅ `/aviso/1` retorna 200 OK

---

### Commit #18: URLs Amigáveis para SEO ⭐
```
feat: implementar URLs amigáveis (slugs) para SEO
Hash: 38f6e76
Data: 19/03/2026 10:38
```

**Motivação:**
URLs numéricas `/aviso/1` não são descritivas nem SEO-friendly. URLs como `/aviso/bem-vindos-ao-novo-quadro-de-avisos-digital` são:
- ✅ Mais descritivas
- ✅ Melhor para SEO (keywords na URL)
- ✅ Melhor UX (usuário sabe o conteúdo antes de clicar)
- ✅ Compartilhamento mais profissional

#### Fase 1: Migration SQL

**Adicionar Coluna Slug:**
```sql
-- Adicionar coluna slug
ALTER TABLE avisos 
  ADD COLUMN slug TEXT;

-- Constraint de formato (apenas lowercase, números e hífens)
ALTER TABLE avisos
  ADD CONSTRAINT avisos_slug_format_check
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

-- Unique constraint
ALTER TABLE avisos
  ADD CONSTRAINT avisos_slug_unique UNIQUE (slug);

-- Índice para performance
CREATE UNIQUE INDEX idx_avisos_slug 
  ON avisos(slug) 
  WHERE slug IS NOT NULL;
```

**Popular Slugs Existentes:**

**PROBLEMA 1: Função UNACCENT não existe**
```sql
-- TENTATIVA INICIAL (FALHOU)
UPDATE avisos
SET slug = LOWER(REGEXP_REPLACE(
  UNACCENT(titulo),  -- ❌ function unaccent does not exist
  '[^a-z0-9]+', '-', 'g'
));
```

**Erro:**
```
ERROR: function unaccent(text) does not exist
HINT: No function matches the given name and argument types
```

**Solução:**
```sql
-- Habilitar extensão unaccent
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Testar
SELECT UNACCENT('Atenção à Acentuação');
-- Output: 'Atencao a Acentuacao' ✅
```

**PROBLEMA 2: Constraint de formato falhando**

```sql
-- TENTATIVA COM UNACCENT (FALHOU)
UPDATE avisos
SET slug = LOWER(REGEXP_REPLACE(
  UNACCENT(titulo),
  '[^a-z0-9]+', '-', 'g'
));
```

**Erro:**
```
ERROR: new row violates check constraint "avisos_slug_format_check"
DETAIL: Failing row contains slug: "--atencao---ao-ded---acesso-liberado--"
```

**Causa:**
- Múltiplos hífens consecutivos: `---`
- Hífens no início/fim: `--texto--`

**Solução: Pipeline Multi-Estágio**
```sql
-- Pipeline completo de geração de slug
UPDATE avisos
SET slug = (
  -- Etapa 5: Trim hífens no início/fim
  TRIM(BOTH '-' FROM
    -- Etapa 4: Colapsar múltiplos hífens em um único
    REGEXP_REPLACE(
      -- Etapa 3: Substituir não-alfanuméricos por hífen
      REGEXP_REPLACE(
        -- Etapa 2: Lowercase
        LOWER(
          -- Etapa 1: Remover acentos
          UNACCENT(titulo)
        ),
        '[^a-z0-9]+', '-', 'g'
      ),
      '-+', '-', 'g'  -- Colapsar hífens
    )
  )
)
WHERE slug IS NULL;
```

**Exemplo de Transformação:**
```
Título Original: "Atenção! DED - Acesso Liberado 🔓"
↓ UNACCENT
"Atencao! DED - Acesso Liberado 🔓"
↓ LOWER
"atencao! ded - acesso liberado 🔓"
↓ REGEXP_REPLACE (special chars)
"atencao--ded---acesso-liberado-"
↓ REGEXP_REPLACE (collapse hyphens)
"atencao-ded-acesso-liberado-"
↓ TRIM
"atencao-ded-acesso-liberado" ✅
```

**Validação:**
```sql
-- Verificar slugs gerados
SELECT id, titulo, slug FROM avisos;

-- Resultado:
-- 1 | Bem-vindos ao novo Quadro de Avisos Digital! | bem-vindos-ao-novo-quadro-de-avisos-digital
-- 2 | Atenção! DED - Acesso Liberado              | atencao-ded-acesso-liberado
-- 3 | Ações - ENEM MG 2026 - Memorando nº 24/2026 | acoes-enem-mg-2026-memorando-n-24-2026
-- 4 | Uniformes da escola - Atenção               | uniformes-da-escola-atencao

-- Todos passam no constraint! ✅
```

#### Fase 2: TypeScript Types

```typescript
// types/index.ts
export interface Aviso {
  id: number;
  titulo: string;
  corpo: string;
  prioridade: 'urgente' | 'normal' | 'info';
  criado_em: string;
  publica_em: string;
  expira_em: string;
  slug: string;  // ✅ Novo campo obrigatório
}

export interface AvisoFormData {
  titulo: string;
  corpo: string;
  prioridade: 'urgente' | 'normal' | 'info';
  slug?: string;  // ✅ Opcional no form (gerado automático)
}
```

#### Fase 3: Helper Functions

```typescript
// lib/utils.ts

/**
 * Gera slug a partir de um título
 * @example generateSlug("Atenção! Novo Aviso 🔔") → "atencao-novo-aviso"
 */
export function generateSlug(titulo: string): string {
  return titulo
    .normalize('NFD')  // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')  // Remover diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Substituir não-alfanuméricos por hífen
    .replace(/-+/g, '-')  // Colapsar múltiplos hífens
    .replace(/^-|-$/g, '')  // Remover hífens no início/fim
    .slice(0, 100);  // Limitar comprimento
}

/**
 * Valida formato de slug
 * @example isValidSlug("bem-vindos") → true
 * @example isValidSlug("Bem-Vindos") → false (uppercase)
 * @example isValidSlug("bem--vindos") → false (duplo hífen)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Gera URL completa para um aviso (com slug ou ID)
 * @example getAvisoUrl(aviso) → "/aviso/bem-vindos-ao-novo-quadro"
 */
export function getAvisoUrl(aviso: Aviso, useSlug = true): string {
  if (useSlug && aviso.slug) {
    return `/aviso/${aviso.slug}`;
  }
  return `/aviso/${aviso.id}`;
}
```

**Testes Unitários (Mentais):**
```typescript
// Casos de teste
generateSlug("Bem-Vindos!")  // "bem-vindos"
generateSlug("Atenção à Comunidade")  // "atencao-a-comunidade"
generateSlug("COVID-19: Avisos Importantes")  // "covid-19-avisos-importantes"
generateSlug("   Título   ")  // "titulo"
generateSlug("🔔 Novo Aviso 🎉")  // "novo-aviso"

isValidSlug("bem-vindos")  // true ✅
isValidSlug("Bem-Vindos")  // false (uppercase)
isValidSlug("bem--vindos")  // false (duplo hífen)
isValidSlug("bem_vindos")  // false (underscore)
isValidSlug("-bem-vindos")  // false (hífen inicial)

getAvisoUrl({ id: 1, slug: "bem-vindos", ... })  // "/aviso/bem-vindos"
getAvisoUrl({ id: 1, slug: null, ... })  // "/aviso/1"
getAvisoUrl({ id: 1, slug: "bem-vindos", ... }, false)  // "/aviso/1"
```

#### Fase 4: Server Queries

```typescript
// lib/supabase/queries-server.ts

/**
 * Busca aviso por slug ou ID (dual-strategy)
 * @param identifier - Slug (string não-numérica) ou ID (número/string numérica)
 * @returns Aviso encontrado ou null
 */
export async function getAvisoBySlugOrId(
  identifier: string | number
): Promise<Aviso | null> {
  const supabase = await createClient();
  
  console.log('🔍 Buscando aviso:', identifier);
  
  // Estratégia 1: Se string não-numérica, buscar por slug
  if (typeof identifier === 'string' && !/^\d+$/.test(identifier)) {
    console.log('📌 Estratégia: SLUG lookup');
    
    const { data, error } = await supabase
      .from('avisos')
      .select('*')
      .eq('slug', identifier)
      .single();
    
    if (error) {
      console.error('❌ Erro slug lookup:', error.message);
    } else if (data) {
      console.log('✅ Aviso encontrado via SLUG:', data.id);
      return data;
    }
  }
  
  // Estratégia 2: Se numérico, buscar por ID
  const id = typeof identifier === 'number' ? identifier : parseInt(identifier);
  
  if (!isNaN(id)) {
    console.log('📌 Estratégia: ID lookup (fallback)');
    return await getAvisoPorId(id);
  }
  
  console.log('❌ Nenhuma estratégia funcionou');
  return null;
}
```

**Fluxo de Decisão:**
```
Identifier: "bem-vindos"
  ↓
É string não-numérica? SIM
  ↓
SELECT * FROM avisos WHERE slug = 'bem-vindos'
  ↓
Encontrado? SIM → Retornar
           NÃO → Tentar ID


Identifier: "1"
  ↓
É string não-numérica? NÃO (é numérica)
  ↓
parseInt("1") = 1
  ↓
SELECT * FROM avisos WHERE id = 1
  ↓
Retornar resultado


Identifier: 42 (número)
  ↓
É string não-numérica? NÃO
  ↓
SELECT * FROM avisos WHERE id = 42
  ↓
Retornar resultado
```

#### Fase 5: Atualizar Rota

```typescript
// app/aviso/[id]/page.tsx

interface AvisoPageProps {
  params: Promise<{ id: string }>;  // "id" aceita slug ou ID
}

export default async function AvisoPage({ params }: AvisoPageProps) {
  const { id } = await params;
  
  // ✅ Buscar por slug OU ID automaticamente
  const aviso = await getAvisoBySlugOrId(id);
  
  if (!aviso) {
    notFound();
  }
  
  // 🔀 REDIRECT CANÔNICO: Se acessado via ID numérico, redirecionar para slug
  // Exemplo: /aviso/1 → 301 /aviso/bem-vindos-ao-novo-quadro
  if (/^\d+$/.test(id) && aviso.slug) {
    redirect(`/aviso/${aviso.slug}`);
  }
  
  // Renderizar página com URL canônica (slug)
  // ...
}
```

**Comportamento:**
```
GET /aviso/1
  ↓
getAvisoBySlugOrId("1") → Aviso { id: 1, slug: "bem-vindos", ... }
  ↓
É numérico? SIM && tem slug? SIM
  ↓
redirect('/aviso/bem-vindos') → 301 Moved Permanently


GET /aviso/bem-vindos
  ↓
getAvisoBySlugOrId("bem-vindos") → Aviso { id: 1, slug: "bem-vindos", ... }
  ↓
É numérico? NÃO
  ↓
Renderizar página normalmente → 200 OK
```

#### Fase 6: Metadata SEO

```typescript
// app/aviso/[id]/page.tsx

export async function generateMetadata({ params }: AvisoPageProps) {
  const { id } = await params;
  const aviso = await getAvisoBySlugOrId(id);
  
  if (!aviso) {
    return { title: 'Aviso não encontrado - EENSA' };
  }
  
  const descricao = aviso.corpo.length > 160 
    ? aviso.corpo.substring(0, 157) + '...'
    : aviso.corpo;
  
  // URL canônica sempre com slug
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}${getAvisoUrl(aviso)}`;
  
  return {
    title: `${aviso.titulo} - EENSA`,
    description: descricao,
    
    // ✅ Canonical URL para SEO (evita conteúdo duplicado)
    alternates: {
      canonical: canonicalUrl,  // https://eensa.app/aviso/bem-vindos
    },
    
    openGraph: {
      title: aviso.titulo,
      description: aviso.corpo,
      type: 'article',
      siteName: 'EENSA - Avisos Escolares',
      locale: 'pt_BR',
      url: canonicalUrl,  // ✅ OG:URL com slug
    },
    
    twitter: {
      card: 'summary',
      title: aviso.titulo,
      description: descricao,
    },
  };
}
```

**HTML Gerado:**
```html
<head>
  <title>Bem-vindos ao novo Quadro de Avisos Digital! - EENSA</title>
  <meta name="description" content="Estamos felizes em apresentar..." />
  
  <!-- Canonical URL (SEO) -->
  <link rel="canonical" href="https://eensa.app/aviso/bem-vindos-ao-novo-quadro-de-avisos-digital" />
  
  <!-- Open Graph (Facebook, LinkedIn) -->
  <meta property="og:title" content="Bem-vindos ao novo Quadro de Avisos Digital!" />
  <meta property="og:url" content="https://eensa.app/aviso/bem-vindos-ao-novo-quadro-de-avisos-digital" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="EENSA - Avisos Escolares" />
  <meta property="og:locale" content="pt_BR" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Bem-vindos ao novo Quadro de Avisos Digital!" />
</head>
```

#### Fase 7: Atualizar Componentes

**1. QR Code no Modo TV:**
```typescript
// components/tv/TVSlider.tsx

import { getAvisoUrl } from '@/lib/utils';

export function TVSlider({ avisos }: TVSliderProps) {
  const aviso = avisos[currentIndex];
  
  // ✅ Usar slug quando disponível
  const baseUrl = window.location.origin;
  const avisoUrl = `${baseUrl}${getAvisoUrl(aviso)}`;
  
  return (
    <QRCodeSVG 
      value={avisoUrl}  // https://eensa.app/aviso/bem-vindos
      size={180}
    />
  );
}
```

**2. Copiar Link:**
```typescript
// components/avisos/AvisoCard.tsx

import { getAvisoUrl } from '@/lib/utils';

export function AvisoCard({ aviso }: AvisoCardProps) {
  const copiarLink = async () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}${getAvisoUrl(aviso)}`;  // ✅ Slug
    
    await navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };
  
  return <Button onClick={copiarLink}>Copiar Link</Button>;
}
```

**3. Links de Navegação:**
```typescript
// components/avisos/AvisoLinksList.tsx

import { getAvisoUrl } from '@/lib/utils';

export function AvisoLinksList({ avisos }: AvisoLinksListProps) {
  return (
    <>
      {avisos.map(aviso => (
        <Link 
          key={aviso.id}
          href={getAvisoUrl(aviso)}  // ✅ /aviso/slug
        >
          {aviso.titulo}
        </Link>
      ))}
    </>
  );
}
```

#### Build e Validação Final

```bash
npm run build

▲ Next.js 16.1.7 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 2.3s
✓ Finished TypeScript in 2.4s
✓ Collecting page data using 11 workers in 561.1ms    
✓ Generating static pages using 11 workers (6/6) in 1280.8ms
✓ Finalizing page optimization in 13.4ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /admin
├ ƒ /aviso/[id]        ← Aceita slug ou ID ✅
├ ○ /login
└ ○ /tv
```

**Testes Manuais:**
```bash
# 1. Acessar via slug (canônico)
curl -I https://eensa.app/aviso/bem-vindos-ao-novo-quadro-de-avisos-digital
# HTTP/1.1 200 OK ✅

# 2. Acessar via ID (legacy)
curl -I https://eensa.app/aviso/1
# HTTP/1.1 301 Moved Permanently
# Location: /aviso/bem-vindos-ao-novo-quadro-de-avisos-digital ✅

# 3. QR Code gera URL com slug
# Escanear QR Code no Modo TV
# URL: https://eensa.app/aviso/bem-vindos-ao-novo-quadro-de-avisos-digital ✅

# 4. Botão "Copiar Link" usa slug
# Clicar botão → Verificar clipboard
# https://eensa.app/aviso/bem-vindos-ao-novo-quadro-de-avisos-digital ✅
```

**Resultados:**
- ✅ Zero erros TypeScript
- ✅ Build bem-sucedido
- ✅ Rotas dinâmicas funcionando
- ✅ Redirect 301 funcionando
- ✅ QR Codes com slug
- ✅ Canonical URLs no HTML
- ✅ OpenGraph com slug
- ✅ Retrocompatibilidade com IDs

---

## 🚨 Problemas Encontrados e Soluções

### Resumo de Erros Críticos

| # | Problema | Causa Raiz | Solução | Commit |
|---|----------|-----------|---------|--------|
| 1 | GitHub Pages 404 | Não suporta SSR | Migrar para Vercel | 0252359 |
| 2 | Index predicate IMMUTABLE | NOW() em WHERE clause | Remover WHERE do índice | 6896563 |
| 3 | Table permission denied 403 | RLS policy com auth.role() | Usar auth.uid() IS NOT NULL | 9a1fd8c |
| 4 | Dynamic route 404 | Browser client em Server Component | Criar server.ts com createServerClient | 6896563 |
| 5 | Next.js params error | Params agora é Promise | Adicionar await params | 6896563 |
| 6 | UNACCENT function missing | Extensão não habilitada | CREATE EXTENSION unaccent | 38f6e76 |
| 7 | Slug constraint violation | Múltiplos hífens consecutivos | Pipeline multi-estágio regex | 38f6e76 |

### Análise Detalhada

#### Erro #1: Deploy em GitHub Pages

**Contexto:**
Primeira tentativa de deploy usando GitHub Pages.

**Erro:**
```
Error: Static export requires 'output: export' in next.config.js
Error: Dynamic routes are not supported with 'output: export'
```

**Tentativa de Correção:**
```javascript
// next.config.js
module.exports = {
  output: 'export',  // Modo estático
  basePath: '/avisosEENSA',  // Subpath do GitHub
}
```

**Novo Erro:**
```
404 on /_next/static/... files
Static files not found at /avisosEENSA/_next/...
```

**Análise:**
- GitHub Pages só suporta sites 100% estáticos
- Next.js com App Router precisa de SSR para:
  - Server Components
  - generateMetadata dinâmico
  - API Routes
  - Revalidation
- `output: 'export'` desabilita todos recursos de servidor

**Solução Final:**
Migrar para Vercel (suporte nativo a Next.js).

**Lição Aprendida:**
- Verificar requisitos de hosting ANTES de desenvolver
- Para Next.js com App Router → Vercel, Netlify ou VPS
- GitHub Pages → Apenas para Next.js em modo export puro

---

#### Erro #2: PostgreSQL Index Predicate

**Erro:**
```sql
CREATE INDEX idx_avisos_ativos 
  ON avisos(id) 
  WHERE publica_em <= NOW() AND expira_em >= NOW();

-- ERROR: functions in index predicate must be marked IMMUTABLE
```

**Explicação:**
PostgreSQL classifica funções em 3 categorias:
- **IMMUTABLE**: Sempre retorna o mesmo resultado (ex: `ABS(-5)` sempre retorna 5)
- **STABLE**: Resultado constante dentro de uma transaction (ex: `CURRENT_DATE`)
- **VOLATILE**: Resultado pode mudar a cada chamada (ex: `RANDOM()`)

`NOW()` é **STABLE** (não IMMUTABLE), então não pode ser usada em índice condicional.

**Por que?**
Índices são estruturas persistentes. Se o WHERE dependesse de `NOW()`, o índice precisaria ser reconstruído a cada segundo!

**Solução:**
```sql
-- Criar índice simples
CREATE INDEX idx_avisos_publicacao 
  ON avisos(publica_em, expira_em);

-- Filtrar na query, não no índice
SELECT * FROM avisos
WHERE publica_em <= NOW() AND expira_em >= NOW();
```

**Performance:**
- Índice composto em `(publica_em, expira_em)` é eficiente
- PostgreSQL usa índice para otimizar a query dinâmica
- Overhead mínimo comparado a índice condicional

---

#### Erro #3: RLS Permission Denied

**Erro:**
```
Error: permission denied for table tv_settings
Status: 403 Forbidden
Detail: Policy check failed
```

**Policy Original (ERRADA):**
```sql
CREATE POLICY "tv_settings_update_authenticated"
  ON tv_settings FOR UPDATE
  USING (auth.role() = 'authenticated');  -- ❌ auth.role() não existe!
```

**Diagnóstico:**
```sql
-- Testar expressão
SELECT auth.role();
-- ERROR: function auth.role() does not exist
```

**Causa:**
Supabase não expõe `auth.role()`. Documentação sugere, mas não está disponível em produção.

**Policy Corrigida:**
```sql
CREATE POLICY "tv_settings_update_authenticated"
  ON tv_settings FOR UPDATE
  TO authenticated  -- Especificar role explicitamente
  USING (auth.uid() IS NOT NULL)  -- Verificar se está autenticado
  WITH CHECK (auth.uid() IS NOT NULL);  -- Também para UPDATE!
```

**GRANTs Necessários:**
```sql
GRANT SELECT ON tv_settings TO anon, authenticated;
GRANT UPDATE, INSERT ON tv_settings TO authenticated;
GRANT USAGE ON tv_settings_id_seq TO authenticated;
```

**Validação:**
```sql
-- Como usuário anônimo
SELECT * FROM tv_settings;  -- ✅ Funciona (policy permite)

-- Como usuário autenticado
UPDATE tv_settings SET slider_timer = 25;  -- ✅ Funciona
```

---

#### Erro #4: Server Component com Browser Client

**Erro Silencioso:**
```typescript
// app/aviso/[id]/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/client';  // ❌ Browser only

const supabase = createClient();
const { data } = await supabase.from('avisos').select('*');

console.log(data);  // null (sempre!)
```

**Por que falhou silenciosamente?**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

`createBrowserClient()` depende de `window` e `localStorage`:
- No servidor: `window` é `undefined`
- Cliente instancia mas não funciona
- Queries retornam `null` sem erro

**Solução: Dual Client Architecture**

```typescript
// lib/supabase/server.ts (NOVO)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();  // Next.js 15+ async
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Read-only context (Server Component)
            // Safe to ignore
          }
        },
      },
    }
  );
}
```

**Uso:**
```typescript
// Server Component
import { createClient } from '@/lib/supabase/server';  // ✅

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('avisos').select('*');
  // data retorna corretamente!
}

// Client Component
'use client';
import { createClient } from '@/lib/supabase/client';  // ✅

export function ClientComponent() {
  const supabase = createClient();
  // Funciona no browser
}
```

---

#### Erro #5: Next.js 15+ Async Params

**Erro de Build:**
```
Type error: Property 'id' does not exist on type 'Promise<{ id: string }>'
  > const { id } = params;
                    ^^^^^^
```

**Código Problemático:**
```typescript
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;  // ❌ Next.js 15+ quebra aqui
}
```

**Causa:**
Breaking change no Next.js 15 (Turbopack):
- Before: `params` é objeto síncrono
- After: `params` é Promise assíncrona

**Correção:**
```typescript
interface PageProps {
  params: Promise<{ id: string }>;  // ✅ Promise!
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;  // ✅ Await obrigatório
  // ...
}
```

**Também afeta generateMetadata:**
```typescript
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;  // ✅ Await aqui também!
  // ...
}
```

**Por que essa mudança?**
Permite que Next.js carregue params assincronamente (streaming).

---

#### Erro #6: UNACCENT Function Missing

**Erro:**
```sql
UPDATE avisos
SET slug = LOWER(UNACCENT(titulo));

-- ERROR: function unaccent(text) does not exist
-- HINT: No function matches the given name
```

**Causa:**
`unaccent` é uma extensão opcional do PostgreSQL, não habilitada por padrão.

**Solução:**
```sql
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Testar
SELECT UNACCENT('Atenção à Comunidade');
-- Output: 'Atencao a Comunidade' ✅
```

**Uso no Slug:**
```sql
UPDATE avisos
SET slug = LOWER(REGEXP_REPLACE(
  UNACCENT(titulo),  -- ✅ Agora funciona!
  '[^a-z0-9]+', '-', 'g'
));
```

---

#### Erro #7: Slug Constraint Violation

**Erro:**
```sql
UPDATE avisos SET slug = ...;

-- ERROR: new row violates check constraint "avisos_slug_format_check"
-- DETAIL: Failing row contains slug: "--bem--vindos--ao--novo--quadro--"
```

**Constraint:**
```sql
CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
-- Regex: início com alfanumérico, grupos de alfanuméricos separados por hífen único
```

**Problema:**
```
"Bem-Vindos! 🎉"
  ↓ LOWER + REGEXP_REPLACE
"--bem--vindos----"
  ↓ Falha no constraint (hífens duplicados)
```

**Solução: Pipeline Multi-Estágio:**
```sql
UPDATE avisos
SET slug = (
  TRIM(BOTH '-' FROM                    -- 5. Remover hífens nas pontas
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        LOWER(                          -- 2. Lowercase
          UNACCENT(titulo)              -- 1. Remover acentos
        ),
        '[^a-z0-9]+', '-', 'g'          -- 3. Substituir especiais
      ),
      '-+', '-', 'g'                    -- 4. Colapsar múltiplos hífens
    )
  )
);
```

**Validação:**
```sql
SELECT 
  titulo,
  slug,
  slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AS valido
FROM avisos;

-- Todos retornam valido = true ✅
```

---

## 🏗️ Arquitetura do Sistema

### Estrutura de Diretórios

```
avisosEENSA/
├── app/                      # App Router (Next.js 13+)
│   ├── globals.css           # Estilos globais
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home pública
│   ├── admin/                # Painel administrativo
│   │   ├── layout.tsx        # Layout com auth
│   │   └── page.tsx          # Dashboard
│   ├── aviso/                # Rotas dinâmicas
│   │   └── [id]/             # Aceita slug ou ID
│   │       └── page.tsx      # Página individual
│   ├── login/                # Autenticação
│   │   └── page.tsx
│   └── tv/                   # Modo TV
│       └── page.tsx
│
├── components/               # Componentes React
│   ├── admin/                # Componentes do admin
│   │   ├── AvisosTable.tsx   # Tabela CRUD
│   │   ├── StatsRow.tsx      # Estatísticas
│   │   └── TVSettingsForm.tsx # Config Modo TV
│   ├── avisos/               # Componentes de avisos
│   │   ├── AvisoCard.tsx     # Card listagem
│   │   ├── AvisoDetailCard.tsx # Card detalhe
│   │   ├── AvisoForm.tsx     # Formulário CRUD
│   │   ├── AvisoList.tsx     # Lista pública
│   │   └── AvisoLinksList.tsx # Sugestões
│   ├── layout/               # Componentes de layout
│   │   ├── Clock.tsx         # Relógio tempo real
│   │   ├── Header.tsx        # Header padrão
│   │   └── PageWrapper.tsx   # Wrapper de página
│   ├── tv/                   # Componentes Modo TV
│   │   ├── TVSlider.tsx      # Slider com QR Code
│   │   └── TVTopBar.tsx      # Header do TV
│   └── ui/                   # Componentes UI base
│       ├── Badge.tsx         # Badges prioridade
│       ├── Button.tsx        # Botões
│       ├── Icons.tsx         # Ícones SVG
│       ├── Logo.tsx          # Logo EENSA
│       ├── Modal.tsx         # Modais
│       ├── ShareButton.tsx   # Compartilhamento
│       └── Toast.tsx         # Notificações
│
├── hooks/                    # Custom React Hooks
│   ├── useAuth.ts            # Autenticação
│   ├── useAvisos.ts          # CRUD + real-time
│   ├── useClock.ts           # Relógio
│   └── useSettings.ts        # Configurações TV
│
├── lib/                      # Bibliotecas e utilitários
│   ├── utils.ts              # Funções auxiliares
│   ├── tv-config.ts          # Configurações TVsupabase/                 # Cliente Supabase
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client (SSR)
│   │   ├── queries.ts        # Queries client-side
│   │   ├── queries-server.ts # Queries server-side
│   │   └── settings-queries.ts # Queries configurações
│
├── types/                    # TypeScript types
│   └── index.ts              # Tipos centralizados
│
├── .supabase/                # Scripts SQL
│   ├── CREATE_TV_SETTINGS.sql
│   ├── FIX_TV_SETTINGS_PERMISSIONS.sql
│   ├── MIGRATION_FEATURES_COMPLETO.sql
│   ├── TESTE_FEATURES_REPORT.sql
│   └── README_TV_SETTINGS.md
│
├── .documentation/           # Documentação técnica
│   └── HISTORICO_DESENVOLVIMENTO.md (este arquivo)
│
├── public/                   # Arquivos estáticos
│   └── manifest.json         # PWA manifest
│
├── .env.local                # Variáveis de ambiente (local)
├── .env.example              # Template de .env
├── next.config.js            # Configuração Next.js
├── tailwind.config.ts        # Configuração Tailwind
├── tsconfig.json             # Configuração TypeScript
└── package.json              # Dependências
```

### Fluxo de Dados

#### Autenticação
```
Login Page
  ↓ email/senha
Supabase Auth
  ↓ JWT token
cookies (httpOnly)
  ↓
Protected Routes (admin/*)
  ↓ middleware check
Access Granted/Denied
```

#### CRUD de Avisos (Admin)
```
AvisoForm (client)
  ↓ onSubmit
useAvisos.createAviso()
  ↓ Supabase client
INSERT INTO avisos
  ↓ Realtime broadcast
useAvisos subscribers
  ↓ setAvisos(newData)
Re-render components
```

#### Exibição Pública
```
Home Page (/)
  ↓ On mount
useAvisos.fetchAvisos()
  ↓ Supabase client
SELECT * FROM avisos WHERE ...
  ↓ Filter by date
avisos ativos
  ↓ Group by prioridade
AvisoList components
```

#### Modo TV
```
TV Page (/tv)
  ↓ useSettings hook
getTVSettings() + subscribe
  ↓ useAvisos hook
getAvisosAtivos() + subscribe
  ↓ useState
TVSlider autoplay
  ↓ QR Code
getAvisoUrl(aviso) → /aviso/slug
```

#### Links Permanentes
```
QR Code scan
  ↓ GET /aviso/slug-exemplo
Next.js Dynamic Route
  ↓ await params
getAvisoBySlugOrId(slug)
  ↓ Supabase query
SELECT * WHERE slug = ?
  ↓ If not found
SELECT * WHERE id = ? (fallback)
  ↓ If numeric ID
redirect('/aviso/slug')  (canonical)
  ↓ Render
AvisoDetailCard + metadata
```

### Database Schema

```sql
-- Tabela principal: avisos
CREATE TABLE avisos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  corpo TEXT NOT NULL,
  prioridade TEXT CHECK (prioridade IN ('urgente', 'normal', 'info')) DEFAULT 'normal',
  criado_em TIMESTAMP DEFAULT NOW(),
  publica_em TIMESTAMP DEFAULT NOW(),
  expira_em TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  slug TEXT UNIQUE,
  
  -- Constraints
  CONSTRAINT avisos_slug_format_check 
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT avisos_titulo_min_length 
    CHECK (LENGTH(titulo) >= 3),
  CONSTRAINT avisos_corpo_min_length 
    CHECK (LENGTH(corpo) >= 10)
);

-- Índices
CREATE INDEX idx_avisos_prioridade ON avisos(prioridade);
CREATE INDEX idx_avisos_publicacao ON avisos(publica_em, expira_em);
CREATE UNIQUE INDEX idx_avisos_slug ON avisos(slug) WHERE slug IS NOT NULL;

-- RLS Policies
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "avisos_select_public"
  ON avisos FOR SELECT TO public
  USING (publica_em <= NOW() AND expira_em >= NOW());

CREATE POLICY "avisos_insert_authenticated"
  ON avisos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "avisos_update_authenticated"
  ON avisos FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "avisos_delete_authenticated"
  ON avisos FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Tabela de configurações TV
CREATE TABLE tv_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slider_timer INTEGER DEFAULT 20 CHECK (slider_timer BETWEEN 15 AND 35),
  transition_speed INTEGER DEFAULT 500 CHECK (transition_speed BETWEEN 300 AND 1000),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE POLICY "tv_settings_select_public"
  ON tv_settings FOR SELECT TO public USING (true);

CREATE POLICY "tv_settings_update_authenticated"
  ON tv_settings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
```

### Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJXXXX...

# App
NEXT_PUBLIC_BASE_URL=https://eensa.app  # Produção
# NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Desenvolvimento
```

---

## 🚀 Guia de Deploy

### Pré-requisitos

1. **Conta Vercel:** [vercel.com](https://vercel.com)
2. **Conta Supabase:** [supabase.com](https://supabase.com)
3. **Repositório GitHub:** `rodrigodionizio/avisosEENSA`

### Configuração Supabase

#### 1. Criar Projeto
```
Dashboard → New Project
  Nome: avisosEENSA
  Database Password: [gerar senha forte]
  Region: South America (São Paulo)
```

#### 2. Executar Migrations
```sql
-- No Supabase SQL Editor:

-- 1. Criar tabela avisos
CREATE TABLE avisos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  corpo TEXT NOT NULL,
  prioridade TEXT DEFAULT 'normal',
  criado_em TIMESTAMP DEFAULT NOW(),
  publica_em TIMESTAMP DEFAULT NOW(),
  expira_em TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  slug TEXT UNIQUE
);

-- 2. Adicionar extensão unaccent
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 3. Popular slugs (se já houver dados)
UPDATE avisos
SET slug = TRIM(BOTH '-' FROM
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      LOWER(UNACCENT(titulo)),
      '[^a-z0-9]+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
WHERE slug IS NULL;

-- 4. Criar tabela tv_settings
CREATE TABLE tv_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slider_timer INTEGER DEFAULT 20,
  transition_speed INTEGER DEFAULT 500
);

INSERT INTO tv_settings (slider_timer, transition_speed)
VALUES (20, 500);

-- 5. Configurar RLS
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_settings ENABLE ROW LEVEL SECURITY;

-- Policies avisos
CREATE POLICY "avisos_select_public"
  ON avisos FOR SELECT TO public
  USING (publica_em <= NOW() AND expira_em >= NOW());

CREATE POLICY "avisos_all_authenticated"
  ON avisos FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Policies tv_settings
CREATE POLICY "tv_settings_select_public"
  ON tv_settings FOR SELECT TO public USING (true);

CREATE POLICY "tv_settings_update_authenticated"
  ON tv_settings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- GRANTs
GRANT SELECT ON avisos TO anon;
GRANT ALL ON avisos TO authenticated;
GRANT SELECT ON tv_settings TO anon, authenticated;
GRANT UPDATE ON tv_settings TO authenticated;
```

#### 3. Criar Usuário Admin
```
Authentication → Users → Invite User
  Email: admin@eensa.app
  Password: [escolher senha forte]
```

#### 4. Obter Credenciais
```
Settings → API
  ✅ Project URL: https://XXXX.supabase.co
  ✅ anon/public key: eyJXXXX...
```

### Configuração Vercel

#### 1. Importar Repositório
```
Dashboard → New Project → Import Git Repository
  Selecionar: rodrigodionizio/avisosEENSA
  Framework Preset: Next.js (autodetectado)
```

#### 2. Configurar Environment Variables
```
Environment Variables:
  NEXT_PUBLIC_SUPABASE_URL = https://XXXX.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJXXXX...
  NEXT_PUBLIC_BASE_URL = https://eensa.vercel.app (ou domínio custom)
```

#### 3. Deploy
```
Deploy → aguardar build
  ✓ Building
  ✓ Deploying
  ✓ Ready

URL: https://eensa.vercel.app ✅
```

### Configuração DNS (Opcional)

Se usar domínio customizado:

```
Vercel Dashboard → Settings → Domains
  Add Domain: avisos.eensa.app

DNS Provider (ex: Cloudflare):
  Type: CNAME
  Name: avisos
  Target: cname.vercel-dns.com
  Proxy: DNS only (ou Proxied)
```

### Validação Pós-Deploy

#### Checklist

- [ ] Home pública carrega (`/`)
- [ ] Login funciona (`/login`)
- [ ] Painel admin protegido (`/admin`)
- [ ] CRUD de avisos funciona
- [ ] Modo TV carrega (`/tv`)
- [ ] QR Code gera URL correta
- [ ] Links permanentes funcionam (`/aviso/slug`)
- [ ] Redirect canônico funciona (`/aviso/1` → `/aviso/slug`)
- [ ] Real-time sync funciona
- [ ] Configurações TV salvam

#### Testes de Aceitação

```bash
# 1. Acessar home
curl https://eensa.app/
# Esperado: HTML da home pública

# 2. Tentar acessar admin sem auth
curl https://eensa.app/admin
# Esperado: Redirect para /login

# 3. Link permanente com slug
curl -I https://eensa.app/aviso/bem-vindos-ao-novo-quadro
# Esperado: 200 OK

# 4. Link permanente com ID (redirect)
curl -I https://eensa.app/aviso/1
# Esperado: 301 → /aviso/bem-vindos-ao-novo-quadro

# 5. QR Code
# Escanear QR Code no Modo TV (/tv)
# Esperado: Abre /aviso/slug no mobile
```

### Manutenção

#### Logs
```
Vercel Dashboard → Deployments → [Deployment] → Logs
  Runtime Logs: Erros de execução
  Build Logs: Erros de build
```

#### Analytics
```
Vercel Dashboard → Analytics
  ✅ Page views
  ✅ Top pages
  ✅ Devices
```

#### Rollback
```
Vercel Dashboard → Deployments
  ✅ Selecionar deploy anterior
  ✅ Promote to Production
```

---

## 📚 Referências e Recursos

### Documentação Oficial

- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **React:** https://react.dev

### APIs e Bibliotecas

- **@supabase/ssr:** https://github.com/supabase/ssr
- **qrcode.react:** https://github.com/zpao/qrcode.react
- **PostgreSQL unaccent:** https://www.postgresql.org/docs/current/unaccent.html

### Artigos e Tutoriais

- **Next.js 15 Async Params:** https://nextjs.org/blog/next-15#async-params
- **Supabase RLS Policies:** https://supabase.com/docs/guides/auth/row-level-security
- **PostgreSQL Index Predicates:** https://www.postgresql.org/docs/current/indexes-partial.html
- **SEO Canonical URLs:** https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

### Ferramentas Utilizadas

- **VS Code:** Editor de código
- **GitHub:** Versionamento
- **Vercel:** Hosting e deploy
- **Supabase Dashboard:** Gerenciamento de banco
- **Chrome DevTools:** Debug frontend
- **Postman:** Testes de API

---

## 📝 Notas Finais

### Estatísticas do Projeto

- **Total de Commits:** 22
- **Linhas de Código:** ~4.200 (excluindo node_modules)
- **Componentes React:** 27+ (incluindo ConfirmDialog)
- **Hooks Customizados:** 4 (useAuth, useAvisos, useSettings, useClock)
- **Rotas Next.js:** 6 (/admin, /tv, /login, /aviso/[id], /)
- **Tabelas SQL:** 2 (avisos, tv_settings)
- **Tempo de Desenvolvimento:** ~3 semanas
- **Deploy Time:** ~2 minutos (Vercel)
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **Features Principais:** 10+ (Auth, CRUD, Modo TV, Links Permanentes, Slugs, Agendamento, Real-time, QR Code, etc.)

### Próximas Melhorias (Roadmap)

#### Curto Prazo
- [x] ✅ Sistema de agendamento (implementado 19/03/2026)
- [x] ✅ Modal de confirmação customizado (implementado 19/03/2026)
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Dark mode
- [ ] Filtros avançados (por data, prioridade)
- [ ] Busca de avisos
- [ ] Exportar avisos (PDF, CSV)

#### Médio Prazo
- [ ] Sistema de categorias
- [ ] Anexos (arquivos, imagens)
- [ ] Comentários em avisos
- [ ] Histórico de edições
- [ ] Permissões granulares (roles)
- [ ] Multi-idioma (i18n)

#### Longo Prazo
- [ ] App Mobile (React Native / Expo)
- [ ] Integração com Google Calendar
- [ ] Webhook notifications (Discord, Telegram)
- [ ] Analytics dashboard
- [ ] A/B testing de avisos
- [ ] AI para sugestão de títulos/slugs

### Lições Aprendidas

1. **Planejamento é fundamental:** Escolher stack ANTES de desenvolver evita retrabalho
2. **TypeScript previne bugs:** Erros detectados em compile-time vs runtime
3. **RLS do Supabase é poderoso:** Segurança na camada de banco
4. **Next.js 15 quebrou compatibilidade:** Async params exigiu refatoração
5. **Dual client architecture é essencial:** Browser vs Server contexts são diferentes
6. **Slugs requerem normalização cuidadosa:** Unicode, hífens, comprimento
7. **PostgreSQL é rigoroso:** IMMUTABLE functions, RLS syntax, constraints
8. **Real-time é game changer:** UX muito melhor com sync instantâneo
9. **Vercel simplifica deploy:** GitHub integration é perfeita para Next.js
10. **Documentação salva tempo:** Este arquivo será útil para manutenção futura

### Agradecimentos

- **OpenAI (GPT):** Assistência técnica e code review
- **Comunidade Next.js:** Documentação e exemplos
- **Supabase Team:** Excelente DX e suporte
- **Vercel:** Deploy sem fricção
- **EENSA:** Oportunidade de desenvolver esta solução

---

**Documento mantido por:** Rodrigo Dionizio  
**Última atualização:** 19 de março de 2026  
**Versão:** 1.1.0  
**Status:** ✅ Em Produção

**Changelog v1.1.0:**
- ✅ Sistema de agendamento de avisos
- ✅ Aba "Agendados" no dashboard admin
- ✅ Modal de confirmação customizado
- ✅ Otimizações Modo TV e performance
- ✅ Guia de configurações visuais

---

## 📄 Licença

Este projeto é proprietário da E.E.N.S.A - Escola Estadual Nossa Senhora Aparecida.  
Todos os direitos reservados © 2026.

Para dúvidas ou suporte, contate: **rodrigo.dionizio@gmail.com**
