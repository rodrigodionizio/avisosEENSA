# 🔒 Configuração do Supabase - EENSA Avisos

## ⚠️ Problema: Erro 403 (Permission Denied)

O erro `permission denied for table avisos` acontece porque o **Row Level Security (RLS)** está habilitado, mas as políticas estão incorretas ou com erro de sintaxe.

---

## ⚠️ PROBLEMA IDENTIFICADO

As políticas foram criadas para `public` mas o Supabase usa o role `anon` (da ANON_KEY). Isso causa o erro 403 mesmo com políticas criadas.

## ✅ SOLUÇÃO RÁPIDA (COPIE E COLE) - FUNCIONA AGORA!

### Passo 1: Acesse o SQL Editor

1. Vá para: https://app.supabase.com/
2. Selecione seu projeto: `bgcpcscbmfmtnpbsexog`
3. Menu lateral → **SQL Editor**
4. Clique em **+ New Query**

### Passo 2: LIMPAR TODAS as Políticas Antigas

Cole e execute este SQL para remover **TODAS** as políticas existentes:

```sql
-- ================================================
-- REMOVER TODAS AS POLÍTICAS ANTIGAS
-- ================================================

DROP POLICY IF EXISTS "public_read_avisos" ON public.avisos;
DROP POLICY IF EXISTS "public_insert_avisos" ON public.avisos;
DROP POLICY IF EXISTS "public_update_avisos" ON public.avisos;
DROP POLICY IF EXISTS "public_delete_avisos" ON public.avisos;
DROP POLICY IF EXISTS "Permitir leitura pública" ON public.avisos;
DROP POLICY IF EXISTS "Permitir criação pública" ON public.avisos;
DROP POLICY IF EXISTS "Permitir edição pública" ON public.avisos;
DROP POLICY IF EXISTS "Permitir exclusão pública" ON public.avisos;
DROP POLICY IF EXISTS "Apenas autenticados podem criar" ON public.avisos;
DROP POLICY IF EXISTS "Apenas autenticados podem editar" ON public.avisos;
DROP POLICY IF EXISTS "Apenas autenticados podem excluir" ON public.avisos;
DROP POLICY IF EXISTS "Leitura pública de avisos" ON public.avisos;
```

### Passo 3: CRIAR Políticas CORRETAS para o role 'anon'

⚠️ **IMPORTANTE**: Esta solução usa `anon` e `authenticated` - os roles corretos do Supabase.

```sql
-- ================================================
-- POLÍTICAS RLS CORRETAS - ROLES ANON + AUTHENTICATED
-- Esta é a solução que REALMENTE funciona!
-- ================================================

-- 1. SELECT (leitura) - Qualquer pessoa pode ler
CREATE POLICY "anon_select_avisos"
ON public.avisos
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. INSERT (criar) - Qualquer pessoa pode criar
CREATE POLICY "anon_insert_avisos"
ON public.avisos
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. UPDATE (editar) - Qualquer pessoa pode editar
CREATE POLICY "anon_update_avisos"
ON public.avisos
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. DELETE (deletar) - Qualquer pessoa pode deletar
CREATE POLICY "anon_delete_avisos"
ON public.avisos
FOR DELETE
TO anon, authenticated
USING (true);
```

### Passo 4: Verificar se Funcionou

Execute este SQL para confirmar que as políticas foram criadas:

```sql
-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'avisos';
```

**Você deve ver 4 linhas** com as políticas `public_read_avisos`, `public_insert_avisos`, `public_update_avisos`, `public_delete_avisos`.

### Passo 5: Testar na Aplicação

1. Volte para: http://localhost:3000/admin
2. Pressione **Ctrl+Shift+R** (reload completo)
3. Tente criar um novo aviso
4. ✅ **O erro 403 deve ter sumido!**

---

---

## 🔐 SOLUÇÃO SEGURA - APENAS AUTENTICADOS (RECOMENDADO PARA PRODUÇÃO!)

⚠️ **ATENÇÃO**: A solução acima permite que QUALQUER PESSOA crie/edite/delete avisos! 
Isso é **PERIGOSO** em produção.

### Por que a Solução Rápida é Insegura?

Com acesso público total (`anon`):
- ✅ Qualquer pessoa pode ver avisos (OK)
- ❌ Qualquer pessoa pode criar avisos (PERIGOSO!)
- ❌ Qualquer pessoa pode editar avisos (PERIGOSO!)
- ❌ Qualquer pessoa pode deletar avisos (MUITO PERIGOSO!)

### Solução Segura: Leitura Pública + Escrita Autenticada

Esta é a configuração **RECOMENDADA para produção**:

```sql
-- ================================================
-- REMOVER POLÍTICAS INSEGURAS
-- ================================================

DROP POLICY IF EXISTS "anon_insert_avisos" ON public.avisos;
DROP POLICY IF EXISTS "anon_update_avisos" ON public.avisos;
DROP POLICY IF EXISTS "anon_delete_avisos" ON public.avisos;

-- ================================================
-- POLÍTICAS SEGURAS - PRODUÇÃO
-- Leitura: Qualquer pessoa
-- Escrita: Apenas autenticados
-- ================================================

-- Deixar apenas leitura pública
-- (a política anon_select_avisos já existe)

-- 2. INSERT - Apenas autenticados
CREATE POLICY "authenticated_insert_avisos"
ON public.avisos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. UPDATE - Apenas autenticados
CREATE POLICY "authenticated_update_avisos"
ON public.avisos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. DELETE - Apenas autenticados
CREATE POLICY "authenticated_delete_avisos"
ON public.avisos
FOR DELETE
TO authenticated
USING (true);
```

### Como Implementar Autenticação no Código

✅ **Boa notícia**: A autenticação já está implementada no código!

Após aplicar as políticas seguras, você precisará criar usuários no Supabase.

### Criando Usuário Administrador

1. Vá para: https://app.supabase.com/
2. Selecione seu projeto: `bgcpcscbmfmtnpbsexog`
3. Menu lateral → **Authentication** → **Users**
4. Clique em **Add user** → **Create new user**
5. Preencha:
   - Email: `admin@eensa.edu.br` (ou qualquer email)
   - Password: `senha123` (escolha uma senha forte!)
   - ✅ Marque **Auto Confirm User** (importante!)
6. Clique em **Create user**

### Testando Autenticação Segura

1. Acesse: http://localhost:3000/login
2. Use o email e senha que você criou
3. Você será redirecionado para `/admin`
4. ✅ Agora apenas usuários autenticados podem criar/editar/deletar avisos!

### Como Funciona a Segurança

```
┌─────────────────────────────────────┐
│ Página Pública (/)                  │
│ - Qualquer pessoa pode VER avisos   │
│ - Usa role: anon                    │
└─────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│ Página Admin (/admin)               │
│ - Protegida por useAuth()           │
│ - Redireciona para /login se não    │
│   autenticado                       │
└─────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│ Operações de Banco de Dados         │
│ - SELECT: anon + authenticated      │
│ - INSERT: authenticated APENAS      │
│ - UPDATE: authenticated APENAS      │
│ - DELETE: authenticated APENAS      │
└─────────────────────────────────────┘
```

---

## 🔍 DIAGNÓSTICO: Verificar Estado do Banco

Se ainda houver problemas, execute estes comandos para diagnóstico:

### 1. Verificar se a tabela existe

```sql
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_name = 'avisos';
```

**Resultado esperado**: Uma linha com `avisos` e `public`

### 2. Verificar se RLS está habilitado

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'avisos';
```

**Resultado esperado**: `rowsecurity` = `true`

### 3. Verificar colunas da tabela

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'avisos'
ORDER BY ordinal_position;
```

**Resultado esperado**: 9 colunas (id, titulo, corpo, prioridade, categoria, autor, criado_em, expira_em, ativo)

### 4. Verificar políticas ativas

```sql
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'avisos';
```

**Resultado esperado**: 4 políticas listadas

---

## 🚨 SOLUÇÃO EMERGENCIAL (Temporária)

Se você precisa testar URGENTEMENTE e nada funciona, desabilite o RLS temporariamente:

```sql
-- ⚠️ ATENÇÃO: Remove toda a segurança!
-- Use APENAS para desenvolvimento local

ALTER TABLE public.avisos DISABLE ROW LEVEL SECURITY;
```

**⚠️ IMPORTANTE**: Lembre-se de reabilitar depois:

```sql
-- Reabilitar RLS
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

-- Depois execute novamente o Passo 3 acima para criar as políticas
```

---

## ❌ Sobre o Erro de Sintaxe que Você Viu

O erro que você recebeu:

```
ERROR: 42601: syntax error at or near ")"
ALTER POLICY "Apenas autenticados podem excluir" ON public.avisos WITH CHECK ();
```

**Causa**: A interface visual do Supabase às vezes gera SQL incorreto. A política DELETE não deve ter `WITH CHECK ()` vazio.

**Solução**: Use o **SQL Editor** diretamente (como mostrado acima) em vez da interface visual de políticas.

---

## 🔧 Troubleshooting Específico

### Problema: "rls_auto_enable" está ativado

Você mencionou que há um `rls_auto_enable` ativado. Isso significa que o Supabase está habilitando RLS automaticamente em novas tabelas. **Isso é normal e correto.**

O que fazer:

1. **NÃO desabilite** o `rls_auto_enable`
2. Apenas crie as políticas corretas (Passo 2 e 3 acima)
3. O RLS com políticas corretas = Segurança adequada

### Problema: Políticas existem mas erro 403 persiste

Se as políticas aparecem listadas mas o erro 403 continua:

**Opção 1**: Recriar políticas com nomes diferentes

```sql
-- Remover TODAS as políticas
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'avisos'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.avisos';
    END LOOP;
END $$;

-- Criar políticas com novo prefixo
CREATE POLICY "v2_public_select" ON public.avisos FOR SELECT TO public USING (true);
CREATE POLICY "v2_public_insert" ON public.avisos FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "v2_public_update" ON public.avisos FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "v2_public_delete" ON public.avisos FOR DELETE TO public USING (true);
```

**Opção 2**: Desabilitar e reabilitar RLS

```sql
-- Desabilitar RLS
ALTER TABLE public.avisos DISABLE ROW LEVEL SECURITY;

-- Esperar 2 segundos

-- Reabilitar RLS
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

-- Criar políticas (Passo 3 acima)
```

### Problema: Erro persiste mesmo com políticas corretas

Se NADA funcionar:

**1. Verificar credenciais do .env.local**

```bash
# Abra .env.local e confirme:
NEXT_PUBLIC_SUPABASE_URL=https://bgcpcscbmfmtnpbsexog.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...sua_chave_aqui
```

**2. Reiniciar completamente**

```bash
# No terminal do projeto:
# Matar todos os processos Node
Get-Process | Where-Object { $_.ProcessName -like '*node*' } | Stop-Process -Force

# Limpar cache do Next.js
Remove-Item -Recurse -Force .next

# Reiniciar
npm run dev
```

**3. Limpar cache do navegador**

- Pressione **Ctrl+Shift+Delete**
- Limpe "Cookies" e "Cache"
- Feche e abra o navegador
- Acesse novamente http://localhost:3000/admin

---

## ✅ Checklist Final

Após executar todos os passos:

- [ ] Executei o SQL para remover políticas antigas (Passo 2)
- [ ] Executei o SQL para criar políticas novas (Passo 3)
- [ ] Verifiquei que 4 políticas aparecem no SELECT (Passo 4)
- [ ] Reiniciei o navegador com Ctrl+Shift+R
- [ ] Tentei criar um aviso na aplicação
- [ ] ✅ **Não há mais erro 403!**

---

## 📚 Informações Adicionais

### Estrutura da Tabela Avisos

Se a tabela ainda não existe, crie com este SQL:

```sql
CREATE TABLE public.avisos (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  corpo TEXT NOT NULL,
  prioridade TEXT NOT NULL CHECK (prioridade IN ('urgente', 'normal', 'info')),
  categoria TEXT NOT NULL,
  autor TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira_em TIMESTAMPTZ,
  ativo BOOLEAN NOT NULL DEFAULT true
);

-- Habilitar Row Level Security
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
```

### Observações de Segurança

- **Desenvolvimento**: Use políticas públicas (Passo 3 - acesso público)
- **Produção**: Use políticas autenticadas (Alternativa para Produção)
- Na produção, considere:
  - Limitar edição apenas ao autor original
  - Adicionar níveis de permissão (admin, moderador)
  - Implementar rate limiting

---

#### Opção B: Acesso Apenas para Usuários Autenticados (Recomendado)

Para permitir acesso apenas a usuários autenticados:

```sql
-- Permitir SELECT para todos (público pode ver)
CREATE POLICY "Permitir leitura pública"
ON avisos FOR SELECT
USING (true);

-- Apenas usuários autenticados podem INSERT
CREATE POLICY "Apenas autenticados podem criar"
ON avisos FOR INSERT
TO authenticated
WITH CHECK (true);

-- Apenas usuários autenticados podem UPDATE
CREATE POLICY "Apenas autenticados podem editar"
ON avisos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Apenas usuários autenticados podem DELETE
CREATE POLICY "Apenas autenticados podem deletar"
ON avisos FOR DELETE
TO authenticated
USING (true);
```

### 4. Aplicar as Políticas

1. Vá para **SQL Editor** no menu lateral
2. Cole os comandos SQL apropriados
3. Clique em **Run** para executar

### 5. Verificar as Políticas

Após criar as políticas, volte para **Authentication > Policies** e verifique se elas aparecem listadas para a tabela `avisos`.

## Estrutura da Tabela Avisos

Certifique-se de que sua tabela tem esta estrutura:

```sql
CREATE TABLE avisos (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  corpo TEXT NOT NULL,
  prioridade TEXT NOT NULL CHECK (prioridade IN ('urgente', 'normal', 'info')),
  categoria TEXT NOT NULL,
  autor TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira_em TIMESTAMPTZ,
  ativo BOOLEAN NOT NULL DEFAULT true
);

-- Habilitar Row Level Security
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;
```

## Testando

Após configurar as políticas:

1. Reinicie o servidor: `npm run dev`
2. Acesse: http://localhost:3000/admin
3. Tente criar um novo aviso
4. O erro 403 não deve mais aparecer

## Observações de Segurança

- **Desenvolvimento**: Use a Opção A (acesso público completo)
- **Produção**: Use a Opção B e implemente autenticação adequada
- Na produção, considere adicionar verificações adicionais como:
  - Limitar edição apenas ao autor original
  - Adicionar níveis de permissão (admin, moderador, etc.)
  - Implementar rate limiting

## Alternativa Rápida (Desabilitar RLS temporariamente)

⚠️ **NÃO RECOMENDADO PARA PRODUÇÃO** ⚠️

Se você está apenas testando localmente, pode desabilitar o RLS:

```sql
ALTER TABLE avisos DISABLE ROW LEVEL SECURITY;
```

Mas lembre-se de reabilitar e configurar as políticas antes de colocar em produção!
