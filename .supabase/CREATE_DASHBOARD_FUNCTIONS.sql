-- ============================================================================
-- MIGRATION: Funções RPC para Dashboard de Segmentação
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026
-- ============================================================================
-- Objetivo: Criar funções SQL para suportar métricas do dashboard admin
-- Uso: Dashboard → tab "Dashboard" → SegmentacaoDashboard component
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. FUNÇÃO: get_desempenho_por_publico
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
    COALESCE(a.publico_alvo, 'todos') as publico,
    COUNT(*) as total_avisos,
    COUNT(*) FILTER (WHERE a.urgente = true) as avisos_urgentes,
    COUNT(*) FILTER (
      WHERE a.expira_em IS NULL 
         OR a.expira_em > NOW()
    ) as avisos_ativos,
    COUNT(*) FILTER (
      WHERE a.expira_em IS NOT NULL 
        AND a.expira_em <= NOW()
    ) as avisos_expirados
  FROM avisos a
  GROUP BY a.publico_alvo
  ORDER BY total_avisos DESC;
END;
$$;

-- Comentário para documentação
COMMENT ON FUNCTION get_desempenho_por_publico IS 
'Retorna estatísticas de avisos agrupadas por público-alvo (professores, pais, alunos, todos). Usado no dashboard de segmentação admin.';

-- ✅ MIGRATION CONCLUÍDA!
-- ℹ️  Esta função pode ser chamada via .rpc('get_desempenho_por_publico')
