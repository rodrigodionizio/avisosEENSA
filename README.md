# EENSA — Quadro de Avisos Digital

Sistema de avisos digitais para a Escola Estadual Nossa Senhora Aparecida (EENSA).

## 🚀 Tecnologias

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Real-time + Auth)
- **Row Level Security (RLS)** - Segurança nativa do PostgreSQL

## 📱 Funcionalidades

- ✅ **Visualização pública** de avisos (TV + App sem login)
- ✅ **Painel administrativo** com autenticação obrigatória
- ✅ **Modo TV** para monitores na sala dos professores
- ✅ **Real-time** - atualizações automáticas via Supabase
- ✅ **PWA** - instalável em dispositivos móveis
- ✅ **Mobile First** - totalmente responsivo
- ✅ **Expiração automática** de avisos
- ✅ **3 níveis de prioridade**: Urgente, Normal, Informativo
- ✅ **Segurança RLS** - Visualização pública + Gestão autenticada

## 📺 Modo TV — Otimizado para Múltiplas Resoluções

O **Modo TV** (`/tv`) foi otimizado para excelente visualização em diferentes resoluções:

### ✅ Compatibilidade Testada
- **1920×1080 (Full HD)**: Ótimo — uso eficiente do espaço
- **1280×720 (HD 720p)**: Excelente — elementos bem proporcionados  
- **1366×768 (SmartTV/Notebook)**: Muito bom — responsivo via breakpoint `lg:`
- **1024×600 (TV compacta/Tablet)**: Adequado — texto legível, sem cortes

### 🎯 Otimizações Implementadas
- **Tipografia responsiva**: títulos, corpo e badges adaptam-se à tela
- **Layout compacto**: cards menores (240-340px de altura) para melhor aproveitamento
- **QR Code otimizado**: tamanho reduzido (64px) mantendo escaneabilidade
- **Controles proporcionais**: setas e dots dimensionados adequadamente
- **Classes Tailwind `lg:`**: expansão em telas maiores quando disponível

### 📐 Detalhes Técnicos
Componente: [`components/tv/TVSlider.tsx`](components/tv/TVSlider.tsx)  
Changelog: [`.documentation/CHANGELOG_TV_OPTIMIZATION.md`](.documentation/CHANGELOG_TV_OPTIMIZATION.md)  
Preview interativo: `.documentation/tv_mode_preview_comparison.html` (arquivo local)

**Tempo de transição configurável** via painel admin ⚙️ Configurações da TV.

---

## 🏗️ Arquitetura de Segurança

```
┌─────────────────────────────────────────────┐
│ PÚBLICO (TV/App)                            │
│ - Acessa "/" e "/tv"                        │
│ - Não precisa de login                      │
│ - Permissão: SELECT (visualizar avisos)     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ADMINISTRADORES                             │
│ - Login obrigatório em "/login"             │
│ - Acessa "/admin" após autenticação         │
│ - Permissão: CREATE, UPDATE, DELETE         │
└─────────────────────────────────────────────┘
```

---

## ⚡ INÍCIO RÁPIDO - IMPLEMENTAÇÃO PARA PRODUÇÃO

### � ERRO 403 PERSISTENTE? LEIA ISTO PRIMEIRO!

Se você está vendo erro `403 Forbidden` ou `permission denied for table avisos`:

**👉 SOLUÇÃO **: [`.documentation/ACAO_IMEDIATA.md`](.documentation/ACAO_IMEDIATA.md) (5 minutos - 95% de sucesso)

**Diagnóstico**: [`.documentation/DIAGNOSTICO_403.md`](.documentation/DIAGNOSTICO_403.md)  
**SQL Correção**: [`.documentation/CORRECAO_403.sql`](.documentation/CORRECAO_403.sql)

---

### 📋 Implementação Normal

**👉 COMECE AQUI**: [`.documentation/README.md`](.documentation/README.md) (índice completo)

**Guia rápido**: [`.documentation/INICIO_RAPIDO.md`](.documentation/INICIO_RAPIDO.md) (20 min)  
**Checklist**: [`.documentation/CHECKLIST.md`](.documentation/CHECKLIST.md) (30 min)  
**Script SQL**: [`.documentation/IMPLEMENTACAO_PRODUCAO.sql`](.documentation/IMPLEMENTACAO_PRODUCAO.sql)

---

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 20+
- Conta no Supabase (gratuita)
- Git

### Configuração

1. **Clone o repositório**
```bash
git clone https://github.com/rodrigodionizio/avisosEENSA.git
cd avisosEENSA
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase.

4. **Execute o ambiente de desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 📦 Deploy

### ⚡ Vercel (Recomendado - 5 minutos)

**👉 GUIA COMPLETO**: [`.documentation/DEPLOY_VERCEL.md`](.documentation/DEPLOY_VERCEL.md)

**Passos rápidos**:
1. Acesse: [vercel.com/new](https://vercel.com/new)
2. Importe: `rodrigodionizio/avisosEENSA`
3. Configure variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**!

✅ Deploy automático a cada push na `main`  
✅ HTTPS gratuito  
✅ CDN global  
✅ Preview deploys automáticos

---

### GitHub Pages (Alternativo)

O deploy é automático via GitHub Actions ao fazer push para a branch `main`.

**Configurar Secrets no GitHub:**

1. Vá em: `Settings → Secrets and variables → Actions`
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Habilitar GitHub Pages

1. Vá em: `Settings → Pages`
2. Source: GitHub Actions

## 🗄️ Supabase - Configuração do Banco

### ⚡ Implementação Rápida

**Siga o guia completo**: [`CHECKLIST.md`](CHECKLIST.md)

**Script SQL pronto**: [`IMPLEMENTACAO_PRODUCAO.sql`](IMPLEMENTACAO_PRODUCAO.sql)

### Resumo da Configuração

1. **Criar tabela** (se ainda não existe):

```sql
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
CREATE INDEX IF NOT EXISTS idx_avisos_ativos_expira
  ON avisos(ativo, expira_em)
  WHERE ativo = TRUE;

CREATE INDEX IF NOT EXISTS idx_avisos_prioridade
  ON avisos(prioridade, criado_em DESC);

-- Habilitar Row Level Security
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;
```

2. **Configurar RLS para Produção**:

Execute o script completo em: [`IMPLEMENTACAO_PRODUCAO.sql`](IMPLEMENTACAO_PRODUCAO.sql)

Isso criará 4 políticas:
- ✅ **SELECT**: Visualização pública (TV + App sem login)
- 🔒 **INSERT**: Apenas administradores autenticados
- 🔒 **UPDATE**: Apenas administradores autenticados
- 🔒 **DELETE**: Apenas administradores autenticados

3. **Criar Usuário Admin**:

No Supabase Dashboard:
- `Authentication → Users → Add User → Create new user`
- Email: `admin@eensa.edu.br`
- Password: (senha forte)
- ✅ Marcar **"Auto Confirm User"**

### Documentação Adicional

- 🔒 [Guia de Segurança](SEGURANCA.md)
- 📋 [Checklist Completo](CHECKLIST.md)  
- 🗄️ [Setup Supabase](SUPABASE_SETUP.md)

## 📱 Modo PWA

Os usuários podem instalar o app nos dispositivos móveis:

- **Android**: Menu → Adicionar à tela inicial
- **iOS**: Compartilhar → Adicionar à Tela de Início

## 📋 Scripts

```bash
npm run dev    # Desenvolvimento local
npm run build  # Build de produção
npm run start  # Servidor de produção local
npm run lint   # Verificar código
```

## 🎨 Design System

O projeto utiliza a paleta de cores institucional da EENSA:

- **Verde**: #1A6B2E (cor primária)
- **Teal**: #2BAAC7 (comunicados normais)
- **Laranja**: #F28C30 (avisos urgentes)
- **Amarelo**: #F5C840 (informativos)

Fontes: Nunito (títulos) + Nunito Sans (corpo)

---

## 📚 Documentação

### 🚨 Troubleshooting

| Documento | Descrição |
|-----------|-----------|
| 🔴 [DIAGNOSTICO_403.md](.documentation/DIAGNOSTICO_403.md) | **Erro 403?** Leia isto PRIMEIRO! |
| 🩹 [CORRECAO_403.sql](.documentation/CORRECAO_403.sql) | SQL para corrigir erro 403 |

### 📖 Guias de Implementação

| Documento | Descrição | Público |
|-----------|-----------|---------|
| 🚀 [INICIO_RAPIDO.md](.documentation/INICIO_RAPIDO.md) | Guia rápido de 20min | ⭐ Comece aqui |
| 📋 [CHECKLIST.md](.documentation/CHECKLIST.md) | Checklist completo | Implementadores |
| 🗄️ [IMPLEMENTACAO_PRODUCAO.sql](.documentation/IMPLEMENTACAO_PRODUCAO.sql) | Script SQL pronto | DBAs |

### 🔧 Documentação Técnica

| Documento | Descrição | Público |
|-----------|-----------|---------|
| 🔒 [SEGURANCA.md](.documentation/SEGURANCA.md) | Arquitetura de segurança | Desenvolvedores |
| 📖 [SUPABASE_SETUP.md](.documentation/SUPABASE_SETUP.md) | Setup técnico Supabase | Técnicos |
| 🎨 [LOGOS.md](LOGOS.md) | Guia de uso das logos | Designers |

---

## 📄 Licença

Projeto desenvolvido para a Escola Estadual Nossa Senhora Aparecida (EENSA).

---

**EENSA — Construindo Histórias...**
