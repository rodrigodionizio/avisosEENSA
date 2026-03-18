# 🔒 Guia de Configuração de Segurança - EENSA Avisos

## 📋 RESUMO DO PROBLEMA

Você está correto! A solução inicial deixou sua aplicação **INSEGURA** porque:

- ❌ Qualquer pessoa pode criar avisos
- ❌ Qualquer pessoa pode editar avisos  
- ❌ Qualquer pessoa pode deletar avisos

Isso acontece porque as políticas RLS estão configuradas para o role `anon` (acesso público).

## ✅ SOLUÇÃO EM 4 PASSOS

### Passo 1: Limpar Políticas Inseguras

Acesse: https://app.supabase.com/ → Projeto `bgcpcscbmfmtnpbsexog` → **SQL Editor** → **+ New Query**

Cole e execute:

```sql
-- Remover políticas inseguras de INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "anon_insert_avisos" ON public.avisos;
DROP POLICY IF EXISTS "anon_update_avisos" ON public.avisos;
DROP POLICY IF EXISTS "anon_delete_avisos" ON public.avisos;
```

### Passo 2: Criar Políticas Seguras

Cole e execute (no mesmo SQL Editor):

```sql
-- Leitura: Qualquer pessoa (OK - público pode ver avisos)
-- (A política anon_select_avisos já existe - não precisa recriar)

-- Criar, Editar, Deletar: APENAS AUTENTICADOS
CREATE POLICY "authenticated_insert_avisos"
ON public.avisos FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_avisos"
ON public.avisos FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_avisos"
ON public.avisos FOR DELETE
TO authenticated
USING (true);
```

### Passo 3: Criar Usuário Administrador

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Preencha:
   - Email: `admin@eensa.edu.br`
   - Password: `senha123` (escolha uma forte!)
   - ✅ **Auto Confirm User** (marque isto!)
3. **Create user**

### Passo 4: Testar

1. Pare o servidor (Ctrl+C no terminal)
2. Reinicie: `npm run dev`
3. Acesse: http://localhost:3000/admin
4. Você será **redirecionado para /login**
5. Faça login com as credenciais criadas
6. Agora você está **autenticado** e pode gerenciar avisos com segurança!

## 🔍 Verificar Configuração

Execute este SQL para confirmar as políticas:

```sql
SELECT policyname, cmd, roles::text[]
FROM pg_policies
WHERE tablename = 'avisos'
ORDER BY cmd, policyname;
```

**Resultado esperado:**

| policyname | cmd | roles |
|---|---|---|
| `anon_select_avisos` | SELECT | `{anon, authenticated}` |
| `authenticated_delete_avisos` | DELETE | `{authenticated}` |
| `authenticated_insert_avisos` | INSERT | `{authenticated}` |  
| `authenticated_update_avisos` | UPDATE | `{authenticated}` |

## 🛡️ Como Funciona Agora

### Usuário NÃO autenticado (público):
- ✅ Pode VER avisos na página `/` (TV mode)
- ❌ NÃO pode acessar `/admin` (redirecionado para `/login`)
- ❌ NÃO pode criar/editar/deletar avisos

### Usuário AUTENTICADO (admin):
- ✅ Pode VER avisos
- ✅ Pode acessar `/admin`
- ✅ Pode criar/editar/deletar avisos
- ✅ Pode fazer logout (botão "Sair" no header)

## 🚨 Se Ainda Houver Erro 403

Se você fez tudo acima e ainda vê erro 403:

### Diagnóstico Rápido

```sql
-- Verificar se RLS está ativado
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'avisos';
-- Deve retornar: rowsecurity = true

-- Ver TODAS as políticas
SELECT * FROM pg_policies WHERE tablename = 'avisos';
-- Deve ter 4 políticas (1 SELECT, 3 authenticated)
```

### Solução Emergencial (Apenas Desenvolvimento Local)

```sql
-- ⚠️ USE APENAS EM DESENVOLVIMENTO!
-- Remove toda segurança temporariamente

ALTER TABLE public.avisos DISABLE ROW LEVEL SECURITY;
```

**Lembre-se**: SEMPRE reabilite RLS antes de produção:

```sql
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
-- Depois crie as políticas novamente
```

## 📊 Comparação: Antes vs Depois

### ANTES (Inseguro ❌):
```
Qualquer pessoa → Pode criar/editar/deletar
          │
          ▼
     PERIGOSO! 
```

### DEPOIS (Seguro ✅):
```
Público          → Pode VER avisos
Admin autenticado → Pode gerenciar avisos
          │
          ▼
     SEGURO! 
```

## 🔑 Gerenciamento de Usuários

### Adicionar mais administradores

1. **Authentication** → **Users** → **Add user**
2. Crie com email/senha
3. ✅ Marque **Auto Confirm User**

### Remover acesso

1. **Authentication** → **Users**
2. Encontre o usuário
3. **•••** → **Delete user**

### Redefinir senha

1. **Authentication** → **Users**  
2. Encontre o usuário
3. **•••** → **Reset password**
4. Copie o link de reset e use em modo Private/Incognito

## 🎯 Checklist Final

- [ ] Removi políticas inseguras (DROP POLICY para anon_insert/update/delete)
- [ ] Criei políticas seguras (apenas authenticated para INSERT/UPDATE/DELETE)
- [ ] Criei usuário admin no Supabase
- [ ] Testei logout e login
- [ ] Confirmei que páginas públicas funcionam sem login
- [ ] Confirmei que /admin redireciona para /login quando não autenticado
- [ ] ✅ **Sistema está SEGURO!**

---

**Próxima melhoria recomendada**: Adicionar recuperação de senha e registro de novos usuários.
