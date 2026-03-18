-- ====================================================================
-- CONFIGURAÇÃO RLS PARA PRODUÇÃO - EENSA AVISOS
-- ====================================================================
-- Execute este arquivo no SQL Editor do Supabase
-- Projeto: bgcpcscbmfmtnpbsexog
-- Data: 18/03/2026
-- ====================================================================

-- ====================================================================
-- ETAPA 1: REMOVER POLÍTICAS ANTIGAS E CONFLITANTES
-- ====================================================================
-- Execução: Copie todo este bloco e execute de uma vez
-- Resultado esperado: "Success. No rows returned"
-- ====================================================================

DROP POLICY IF EXISTS "public_read_avisos" ON public.avisos;
DROP POLICY IF EXISTS "public_insert_avisos" ON public.avisos;
DROP POLICY IF EXISTS "public_update_avisos" ON public.avisos;
DROP POLICY IF EXISTS "public_delete_avisos" ON public.avisos;
DROP POLICY IF EXISTS "authenticated_insert_avisos" ON public.avisos;
DROP POLICY IF EXISTS "authenticated_update_avisos" ON public.avisos;
DROP POLICY IF EXISTS "authenticated_delete_avisos" ON public.avisos;
DROP POLICY IF EXISTS "anon_select_avisos" ON public.avisos;
DROP POLICY IF EXISTS "anon_insert_avisos" ON public.avisos;
DROP POLICY IF EXISTS "anon_update_avisos" ON public.avisos;
DROP POLICY IF EXISTS "anon_delete_avisos" ON public.avisos;
DROP POLICY IF EXISTS "dev_select_avisos" ON public.avisos;
DROP POLICY IF EXISTS "dev_insert_avisos" ON public.avisos;
DROP POLICY IF EXISTS "dev_update_avisos" ON public.avisos;
DROP POLICY IF EXISTS "dev_delete_avisos" ON public.avisos;

-- ====================================================================
-- ETAPA 2: CRIAR POLÍTICAS CORRETAS PARA PRODUÇÃO
-- ====================================================================
-- Arquitetura:
--   - SELECT: Público (anon) + Autenticados → Visualização na TV/App
--   - INSERT/UPDATE/DELETE: Apenas autenticados → Gestão no /admin
-- ====================================================================

-- 1️⃣ VISUALIZAÇÃO PÚBLICA: Qualquer pessoa pode VER avisos (TV + App)
CREATE POLICY "prod_select_avisos"
ON public.avisos
FOR SELECT
TO anon, authenticated
USING (true);

-- 2️⃣ CRIAR AVISOS: Apenas administradores autenticados
CREATE POLICY "prod_insert_avisos"
ON public.avisos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3️⃣ EDITAR AVISOS: Apenas administradores autenticados
CREATE POLICY "prod_update_avisos"
ON public.avisos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4️⃣ DELETAR AVISOS: Apenas administradores autenticados
CREATE POLICY "prod_delete_avisos"
ON public.avisos
FOR DELETE
TO authenticated
USING (true);

-- ====================================================================
-- ETAPA 3: VERIFICAÇÃO DA CONFIGURAÇÃO
-- ====================================================================
-- Execute esta query para confirmar que tudo está correto
-- Resultado esperado: 4 linhas (1 SELECT público + 3 operações autenticadas)
-- ====================================================================

SELECT 
  policyname,
  cmd,
  roles::text[] as roles,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ Público pode visualizar'
    ELSE '🔒 Apenas autenticados'
  END as descricao
FROM pg_policies
WHERE tablename = 'avisos'
ORDER BY cmd, policyname;

-- ====================================================================
-- RESULTADO ESPERADO:
-- ====================================================================
-- policyname              | cmd    | roles                    | descricao
-- ----------------------- | ------ | ------------------------ | -------------------------
-- prod_delete_avisos      | DELETE | {authenticated}          | 🔒 Apenas autenticados
-- prod_insert_avisos      | INSERT | {authenticated}          | 🔒 Apenas autenticados
-- prod_select_avisos      | SELECT | {anon,authenticated}     | ✅ Público pode visualizar
-- prod_update_avisos      | UPDATE | {authenticated}          | 🔒 Apenas autenticados
-- ====================================================================

-- ====================================================================
-- ETAPA 4: DIAGNÓSTICO ADICIONAL (se necessário)
-- ====================================================================
-- Execute apenas se ainda houver problemas
-- ====================================================================

-- Verificar se RLS está habilitado (deve retornar true)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'avisos';

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'avisos'
ORDER BY ordinal_position;

-- Ver todas as políticas com detalhes completos
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'avisos';

-- ====================================================================
-- ✅ APÓS EXECUTAR ESTE ARQUIVO:
-- ====================================================================
-- 1. Confirme que a query de verificação retorna 4 políticas
-- 2. Vá para Authentication → Users → Add user no Supabase
-- 3. Crie usuário: admin@eensa.edu.br com senha forte
-- 4. ✅ Marque "Auto Confirm User"
-- 5. No terminal do projeto: npm run dev
-- 6. Teste a aplicação seguindo o checklist em CHECKLIST.md
-- ====================================================================
