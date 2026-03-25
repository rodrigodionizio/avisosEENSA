-- ============================================================================
-- MIGRATION: Adicionar autor_id à tabela avisos
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026
-- ============================================================================
-- Objetivo: Rastrear quem criou cada aviso via relacionamento real (UUID)
--           em vez de apenas string no campo "autor"
-- 
-- Uso: Painel Professor (/professor) mostra apenas avisos do próprio autor
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. ADICIONAR COLUNA autor_id
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE avisos
  ADD COLUMN IF NOT EXISTS autor_id UUID
  REFERENCES auth.users(id) ON DELETE SET NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. COMENTÁRIO PARA DOCUMENTAÇÃO
-- ────────────────────────────────────────────────────────────────────────────

COMMENT ON COLUMN avisos.autor_id IS 
'UUID do usuário autenticado que criou o aviso. NULL para avisos criados antes desta migration. Usado no painel /professor para filtrar avisos do próprio professor.';

-- ────────────────────────────────────────────────────────────────────────────
-- 3. CRIAR ÍNDICE PARA PERFORMANCE
-- ────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_avisos_autor_id
  ON avisos(autor_id)
  WHERE autor_id IS NOT NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- 4. VERIFICAÇÃO
-- ────────────────────────────────────────────────────────────────────────────

SELECT 
  COUNT(*) AS total_avisos,
  COUNT(autor_id) AS com_autor_id,
  COUNT(*) - COUNT(autor_id) AS sem_autor_id,
  ROUND(100.0 * COUNT(autor_id) / COUNT(*), 1) || '%' AS percentual_preenchido
FROM avisos;

-- ✅ MIGRATION CONCLUÍDA!
-- ℹ️  NOTA: Avisos existentes terão autor_id = NULL.
--    Novos avisos criados após deploy terão autor_id preenchido automaticamente.
