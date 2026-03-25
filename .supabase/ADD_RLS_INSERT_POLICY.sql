-- ============================================================================
-- FIX COMPLEMENTAR: Adicionar Policy INSERT para leitor_perfis
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026
-- ============================================================================
-- Problema: Erro 42501 persiste porque falta policy INSERT
--           O upsert precisa de INSERT quando o registro não existe
-- 
-- Solução: Adicionar policy INSERT para role anon
-- ============================================================================

-- INSERT: Permitir role anon criar novos registros
-- (necessário para upsert criar novos perfis quando não existem)
DROP POLICY IF EXISTS "leitor_insert_public" ON leitor_perfis;

CREATE POLICY "leitor_insert_public"
  ON leitor_perfis FOR INSERT TO anon
  WITH CHECK (true);

-- ✅ FIX CONCLUÍDO!
-- ⚠️  IMPORTANTE: Execute este SQL DEPOIS de FIX_RLS_LEITOR_PERFIS.sql
--     Agora o upsert poderá tanto INSERT (novo perfil) quanto UPDATE (perfil existente)
