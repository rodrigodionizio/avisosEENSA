-- ============================================================================
-- FIX DEFINITIVO: Reset Completo de RLS em leitor_perfis
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026
-- ============================================================================
-- PROBLEMA: Erro "violates USING expression" indica policy com USING incorreta
-- SOLUÇÃO: DROPAR TODAS as policies e recriar do zero
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. REMOVER **TODAS** AS POLICIES EXISTENTES (RESET COMPLETO)
-- ────────────────────────────────────────────────────────────────────────────

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Loop através de todas as policies da tabela leitor_perfis
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'leitor_perfis'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON leitor_perfis', r.policyname);
    END LOOP;
END $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. CRIAR POLICIES CORRETAS (SEM USING EM INSERT/UPDATE)
-- ────────────────────────────────────────────────────────────────────────────

-- ━━━ INSERT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Permite role anon criar novos registros
-- ⚠️ IMPORTANTE: INSERT usa WITH CHECK, NÃO USING
CREATE POLICY "anon_insert_leitor_perfis"
  ON leitor_perfis
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ━━━ UPDATE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Permite role anon atualizar registros
-- ⚠️ IMPORTANTE: UPDATE usa WITH CHECK, NÃO USING
CREATE POLICY "anon_update_leitor_perfis"
  ON leitor_perfis
  FOR UPDATE
  TO anon
  WITH CHECK (true);

-- ━━━ SELECT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Permite role anon visualizar registros
-- ⚠️ SELECT usa USING, não WITH CHECK
CREATE POLICY "anon_select_leitor_perfis"
  ON leitor_perfis
  FOR SELECT
  TO anon
  USING (true);

-- ━━━ ADMIN (authenticated) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Permite usuários autenticados (admin/professor) acessar
CREATE POLICY "authenticated_all_leitor_perfis"
  ON leitor_perfis
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. VERIFICAR RESULTADO
-- ────────────────────────────────────────────────────────────────────────────

-- Listar policies criadas
SELECT 
  policyname,
  cmd,
  roles,
  qual AS using_expression,
  with_check
FROM pg_policies 
WHERE tablename = 'leitor_perfis'
ORDER BY cmd, policyname;

-- ✅ RESET COMPLETO EXECUTADO!
-- ⚠️  Resultado esperado: 4 policies
--     1. anon_insert_leitor_perfis: INSERT, WITH CHECK=true, USING=null
--     2. anon_update_leitor_perfis: UPDATE, WITH CHECK=true, USING=null  
--     3. anon_select_leitor_perfis: SELECT, USING=true, WITH CHECK=null
--     4. authenticated_all_leitor_perfis: ALL, ambos preenchidos
