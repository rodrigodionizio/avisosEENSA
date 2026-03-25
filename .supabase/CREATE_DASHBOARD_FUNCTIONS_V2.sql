-- ============================================================================
-- MIGRATION V2: Funções RPC para Dashboard de Segmentação
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026 (v2)
-- ============================================================================
-- Objetivo: Recriar função get_desempenho_por_publico com tipo correto
-- Uso: Dashboard → tab "Dashboard" → SegmentacaoDashboard component
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. REMOVER FUNÇÃO ANTIGA
-- ────────────────────────────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS get_desempenho_por_publico();

-- ────────────────────────────────────────────────────────────────────────────
-- 2. CRIAR FUNÇÃO CORRIGIDA
-- ────────────────────────────────────────────────────────────────────────────
-- Retorna estatísticas de avisos agrupadas por público-alvo
-- Conta total de avisos, urgentes, ativos e expirados por cada público

CREATE OR REPLACE FUNCTION get_desempenho_por_publico()
RETURNS TABLE (
  publico TEXT,
  total_avisos BIGINT,
  avisos_urgentes BIGINT,
  avisos_ativos BIGINT,
  avisos_expirados BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(a.publico_alvo, 'todos')::TEXT as publico,
    COUNT(*)::BIGINT as total_avisos,
    COUNT(*) FILTER (WHERE a.urgente = true)::BIGINT as avisos_urgentes,
    COUNT(*) FILTER (
      WHERE a.expira_em IS NULL 
         OR a.expira_em > NOW()
    )::BIGINT as avisos_ativos,
    COUNT(*) FILTER (
      WHERE a.expira_em IS NOT NULL 
        AND a.expira_em <= NOW()
    )::BIGINT as avisos_expirados
  FROM avisos a
  GROUP BY a.publico_alvo
  ORDER BY total_avisos DESC;
END;
$$;

-- Comentário para documentação
COMMENT ON FUNCTION get_desempenho_por_publico IS 
'Retorna estatísticas de avisos agrupadas por público-alvo (professores, pais, alunos, todos). Usado no dashboard de segmentação admin.';

-- ✅ MIGRATION V2 CONCLUÍDA!
-- ℹ️  Esta função pode ser chamada via .rpc('get_desempenho_por_publico')
