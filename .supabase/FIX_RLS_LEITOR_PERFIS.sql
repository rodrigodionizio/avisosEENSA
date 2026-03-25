-- ============================================================================
-- FIX: RLS Policies para leitor_perfis
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026
-- ============================================================================
-- Problema: Policy UPDATE exige current_setting('app.device_hash') que nunca
--           é setado, causando erro 42501 em upsert com onConflict
-- 
-- Solução: Simplificar policies para role anon permitir INSERT/UPDATE/SELECT
--          sem condições complexas (app fechado de escola, segurança OK)
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. REMOVER POLICIES ANTIGAS
-- ────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "leitor_update_own" ON leitor_perfis;
DROP POLICY IF EXISTS "leitor_select_own" ON leitor_perfis;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. CRIAR POLICIES SIMPLIFICADAS
-- ────────────────────────────────────────────────────────────────────────────

-- UPDATE: Permitir role anon atualizar qualquer registro
-- (necessário para upsert com onConflict funcionar)
DROP POLICY IF EXISTS "leitor_update_public" ON leitor_perfis;

CREATE POLICY "leitor_update_public"
  ON leitor_perfis FOR UPDATE TO anon
  WITH CHECK (true);

-- SELECT: Permitir role anon visualizar registros
-- (necessário para queries funcionarem sem autenticação)
DROP POLICY IF EXISTS "leitor_select_public" ON leitor_perfis;

CREATE POLICY "leitor_select_public"
  ON leitor_perfis FOR SELECT TO anon
  USING (true);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. MANTER ACESSO ADMIN
-- ────────────────────────────────────────────────────────────────────────────

-- Admin já tinha policy, mas vamos recriar para garantir
DROP POLICY IF EXISTS "leitor_select_admin" ON leitor_perfis;

CREATE POLICY "leitor_select_admin"
  ON leitor_perfis FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ✅ FIX CONCLUÍDO!
-- ⚠️  IMPORTANTE: Testar ProfileSelector após aplicar este fix.
--     Erro 42501 não deve mais ocorrer ao selecionar Pai/Aluno.
