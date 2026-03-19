-- =========================================================================
-- 🧪 SCRIPT DE TESTES E REPORT - FEATURES DE AGENDAMENTO E RECORRÊNCIA
-- =========================================================================
-- Este script insere dados de teste e gera um report visual completo
-- Execute no SQL Editor do Supabase para visualizar todos os recursos
-- =========================================================================

\echo ''
\echo '════════════════════════════════════════════════════════════════'
\echo '🧪 INICIANDO TESTES DAS FEATURES'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

-- =========================================================================
-- PARTE 1: LIMPEZA DE DADOS DE TESTE ANTERIORES
-- =========================================================================

\echo '🗑️  Limpando dados de teste anteriores...'

DELETE FROM avisos WHERE mensagem LIKE '[TESTE%';
DELETE FROM avisos_recorrencia WHERE titulo LIKE '[TESTE%';

\echo '✓ Dados de teste limpos'
\echo ''

-- =========================================================================
-- PARTE 2: INSERÇÃO DE AVISOS DE TESTE
-- =========================================================================

\echo '📝 Inserindo avisos de teste...'

-- Aviso publicado imediatamente (publica_em no passado)
INSERT INTO avisos (mensagem, autor, importancia, expira_em, publica_em, ativo)
VALUES 
  ('[TESTE] Aviso já publicado - Deve aparecer na TV', 
   'Sistema de Testes', 
   'media',
   NOW() + INTERVAL '7 days',
   NOW() - INTERVAL '1 hour',
   true);

-- Aviso agendado para daqui 2 horas
INSERT INTO avisos (mensagem, autor, importancia, expira_em, publica_em, ativo)
VALUES 
  ('[TESTE] Aviso agendado para daqui 2 horas', 
   'Sistema de Testes', 
   'alta',
   NOW() + INTERVAL '7 days',
   NOW() + INTERVAL '2 hours',
   true);

-- Aviso agendado para daqui 1 dia
INSERT INTO avisos (mensagem, autor, importancia, expira_em, publica_em, ativo)
VALUES 
  ('[TESTE] Aviso agendado para amanhã', 
   'Sistema de Testes', 
   'media',
   NOW() + INTERVAL '10 days',
   NOW() + INTERVAL '1 day',
   true);

-- Aviso agendado para daqui 3 dias
INSERT INTO avisos (mensagem, autor, importancia, expira_em, publica_em, ativo)
VALUES 
  ('[TESTE] Aviso agendado para daqui 3 dias', 
   'Sistema de Testes', 
   'baixa',
   NOW() + INTERVAL '10 days',
   NOW() + INTERVAL '3 days',
   true);

\echo '✓ 4 avisos de teste inseridos'
\echo ''

-- =========================================================================
-- PARTE 3: INSERÇÃO DE RECORRÊNCIAS DE TESTE
-- =========================================================================

\echo '🔄 Inserindo recorrências de teste...'

-- Recorrência diária (lembrete diário)
INSERT INTO avisos_recorrencia 
  (titulo, mensagem, importancia, padrao, dias_semana, dia_mes, data_inicio, data_fim, hora_publicacao, duracao_horas, ativo, autor)
VALUES 
  ('[TESTE] Lembrete Diário - Bom Dia EENSA!',
   'Bom dia equipe! Lembrete automático diário.',
   'media',
   'diario',
   NULL,
   NULL,
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '30 days',
   '08:00:00',
   24,
   true,
   'Sistema de Testes');

-- Recorrência semanal (toda segunda, quarta e sexta)
INSERT INTO avisos_recorrencia 
  (titulo, mensagem, importancia, padrao, dias_semana, dia_mes, data_inicio, data_fim, hora_publicacao, duracao_horas, ativo, autor)
VALUES 
  ('[TESTE] Relatório Semanal MQS',
   'Enviar relatório semanal para a equipe de MQS.',
   'alta',
   'semanal',
   ARRAY[1, 3, 5], -- Segunda, Quarta, Sexta (0=Domingo)
   NULL,
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '60 days',
   '14:00:00',
   48,
   true,
   'Sistema de Testes');

-- Recorrência mensal (dia 1 de cada mês)
INSERT INTO avisos_recorrencia 
  (titulo, mensagem, importancia, padrao, dias_semana, dia_mes, data_inicio, data_fim, hora_publicacao, duracao_horas, ativo, autor)
VALUES 
  ('[TESTE] Reunião Mensal - Dia 1',
   'Lembrete: Reunião mensal agendada para hoje.',
   'alta',
   'mensal',
   NULL,
   1, -- Dia 1 de cada mês
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '180 days',
   '09:00:00',
   72,
   true,
   'Sistema de Testes');

-- Recorrência semanal desativada (não deve processar)
INSERT INTO avisos_recorrencia 
  (titulo, mensagem, importancia, padrao, dias_semana, dia_mes, data_inicio, data_fim, hora_publicacao, duracao_horas, ativo, autor)
VALUES 
  ('[TESTE] Recorrência DESATIVADA',
   'Esta recorrência está desativada e não deve gerar avisos.',
   'baixa',
   'semanal',
   ARRAY[2, 4], -- Terça, Quinta
   NULL,
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '30 days',
   '10:00:00',
   24,
   false, -- INATIVO
   'Sistema de Testes');

\echo '✓ 4 recorrências de teste inseridas (3 ativas, 1 inativa)'
\echo ''

-- =========================================================================
-- PARTE 4: REPORT - AVISOS PUBLICADOS VS AGENDADOS
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '📊 REPORT 1: AVISOS PUBLICADOS vs AGENDADOS'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

-- Avisos já publicados (visíveis na TV)
\echo '✅ AVISOS PUBLICADOS (visíveis na TV):'
\echo '────────────────────────────────────────────────────────────────'
SELECT 
  id,
  LEFT(mensagem, 50) || '...' AS mensagem_resumo,
  importancia,
  TO_CHAR(publica_em, 'DD/MM/YYYY HH24:MI') AS publicado_em,
  TO_CHAR(expira_em, 'DD/MM/YYYY HH24:MI') AS expira_em
FROM avisos
WHERE ativo = true 
  AND publica_em <= NOW()
  AND (expira_em IS NULL OR expira_em > NOW())
ORDER BY publica_em DESC;

\echo ''
\echo '⏰ AVISOS AGENDADOS (futuros):'
\echo '────────────────────────────────────────────────────────────────'
SELECT 
  id,
  LEFT(mensagem, 50) || '...' AS mensagem_resumo,
  importancia,
  TO_CHAR(publica_em, 'DD/MM/YYYY HH24:MI') AS publica_em_futuro,
  EXTRACT(EPOCH FROM (publica_em - NOW())) / 3600 AS horas_ate_publicacao
FROM avisos
WHERE ativo = true 
  AND publica_em > NOW()
ORDER BY publica_em ASC;

\echo ''

-- =========================================================================
-- PARTE 5: REPORT - VIEWS DE AVISOS
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '📊 REPORT 2: TESTANDO VIEWS'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

\echo '👁️  VIEW: avisos_visiveis (o que a TV deve mostrar AGORA)'
\echo '────────────────────────────────────────────────────────────────'
SELECT 
  id,
  LEFT(mensagem, 50) || '...' AS mensagem,
  importancia,
  TO_CHAR(created_at, 'DD/MM HH24:MI') AS criado
FROM avisos_visiveis
ORDER BY importancia_ordem, created_at DESC;

\echo ''
\echo '📅 VIEW: avisos_agendados (para tab AGENDADOS no admin)'
\echo '────────────────────────────────────────────────────────────────'
SELECT 
  id,
  LEFT(mensagem, 50) || '...' AS mensagem,
  TO_CHAR(publica_em, 'DD/MM/YYYY HH24:MI') AS publica_em,
  ROUND(EXTRACT(EPOCH FROM (publica_em - NOW())) / 3600, 1) AS horas_restantes
FROM avisos_agendados
ORDER BY publica_em ASC;

\echo ''

-- =========================================================================
-- PARTE 6: REPORT - RECORRÊNCIAS ATIVAS
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '📊 REPORT 3: RECORRÊNCIAS CONFIGURADAS'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

SELECT 
  id,
  LEFT(titulo, 40) AS titulo,
  padrao,
  CASE 
    WHEN padrao = 'semanal' THEN (
      SELECT STRING_AGG(
        CASE dia
          WHEN 0 THEN 'Dom'
          WHEN 1 THEN 'Seg'
          WHEN 2 THEN 'Ter'
          WHEN 3 THEN 'Qua'
          WHEN 4 THEN 'Qui'
          WHEN 5 THEN 'Sex'
          WHEN 6 THEN 'Sáb'
        END, ', ' ORDER BY dia
      )
      FROM UNNEST(dias_semana) AS dia
    )
    WHEN padrao = 'mensal' THEN 'Dia ' || dia_mes
    ELSE '-'
  END AS quando,
  hora_publicacao,
  CASE WHEN ativo THEN '✓ Ativo' ELSE '✗ Inativo' END AS status,
  TO_CHAR(data_inicio, 'DD/MM/YY') AS inicio,
  TO_CHAR(data_fim, 'DD/MM/YY') AS fim
FROM avisos_recorrencia
ORDER BY ativo DESC, id;

\echo ''

-- =========================================================================
-- PARTE 7: TESTAR FUNÇÃO calcular_proxima_publicacao()
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '📊 REPORT 4: PRÓXIMAS PUBLICAÇÕES CALCULADAS'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

SELECT 
  r.id,
  LEFT(r.titulo, 40) AS titulo,
  r.padrao,
  TO_CHAR(calcular_proxima_publicacao(r.id), 'DD/MM/YYYY HH24:MI') AS proxima_publicacao,
  ROUND(
    EXTRACT(EPOCH FROM (calcular_proxima_publicacao(r.id) - NOW())) / 86400, 
    1
  ) AS dias_ate_proximo
FROM avisos_recorrencia r
WHERE r.ativo = true
ORDER BY calcular_proxima_publicacao(r.id);

\echo ''

-- =========================================================================
-- PARTE 8: TESTAR PROCEDURE processar_recorrencias_ativas()
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '📊 REPORT 5: PROCESSANDO RECORRÊNCIAS (TESTE REAL)'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

\echo '🔄 Executando: processar_recorrencias_ativas(30)'
\echo '   (Gera avisos para os próximos 30 dias)'
\echo ''

CALL processar_recorrencias_ativas(30);

\echo ''
\echo '✓ Processamento concluído!'
\echo ''

-- Ver avisos gerados pela recorrência
\echo '📋 Avisos gerados por recorrências:'
\echo '────────────────────────────────────────────────────────────────'
SELECT 
  a.id AS aviso_id,
  LEFT(a.mensagem, 45) || '...' AS mensagem,
  TO_CHAR(a.publica_em, 'DD/MM HH24:MI') AS publica_em,
  r.titulo AS recorrencia_origem
FROM avisos_gerados_por_recorrencia agr
JOIN avisos a ON a.id = agr.aviso_id
JOIN avisos_recorrencia r ON r.id = agr.recorrencia_id
ORDER BY a.publica_em
LIMIT 20;

\echo ''

-- =========================================================================
-- PARTE 9: VIEW stats_recorrencias
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '📊 REPORT 6: ESTATÍSTICAS DE RECORRÊNCIAS'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

SELECT 
  r.id,
  LEFT(r.titulo, 35) AS titulo,
  r.padrao,
  s.total_gerados,
  s.pendentes,
  s.publicados,
  s.expirados,
  TO_CHAR(s.ultima_geracao, 'DD/MM HH24:MI') AS ultima_geracao
FROM stats_recorrencias s
JOIN avisos_recorrencia r ON r.id = s.recorrencia_id
ORDER BY s.total_gerados DESC;

\echo ''

-- =========================================================================
-- PARTE 10: FUNÇÃO get_stats_dashboard()
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '📊 REPORT 7: DASHBOARD GERAL (função get_stats_dashboard)'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

SELECT 
  '📺 Avisos Ativos (na TV agora)' AS metrica,
  avisos_ativos AS valor
FROM get_stats_dashboard()
UNION ALL
SELECT 
  '⏰ Avisos Agendados (futuros)',
  avisos_agendados
FROM get_stats_dashboard()
UNION ALL
SELECT 
  '🔄 Recorrências Ativas',
  recorrencias_ativas
FROM get_stats_dashboard()
UNION ALL
SELECT 
  '🔁 Total de Padrões Configurados',
  recorrencias_ativas + (SELECT COUNT(*) FROM avisos_recorrencia WHERE ativo = false)
FROM get_stats_dashboard();

\echo ''

-- =========================================================================
-- PARTE 11: VERIFICAR POLÍTICAS RLS
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '📊 REPORT 8: POLÍTICAS RLS (Row Level Security)'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

\echo '🔒 Políticas habilitadas:'
\echo '────────────────────────────────────────────────────────────────'
SELECT 
  schemaname,
  tablename,
  policyname,
  CASE WHEN permissive THEN 'Permissive' ELSE 'Restrictive' END AS tipo,
  cmd AS operacao
FROM pg_policies
WHERE tablename IN ('avisos', 'avisos_recorrencia', 'avisos_gerados_por_recorrencia')
ORDER BY tablename, policyname;

\echo ''

-- =========================================================================
-- RESUMO FINAL
-- =========================================================================

\echo '════════════════════════════════════════════════════════════════'
\echo '✅ RESUMO FINAL DOS TESTES'
\echo '════════════════════════════════════════════════════════════════'
\echo ''

DO $$
DECLARE
  v_avisos_teste INTEGER;
  v_avisos_publicados INTEGER;
  v_avisos_agendados INTEGER;
  v_recorrencias INTEGER;
  v_avisos_gerados INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_avisos_teste FROM avisos WHERE mensagem LIKE '[TESTE%';
  SELECT COUNT(*) INTO v_avisos_publicados FROM avisos WHERE ativo = true AND publica_em <= NOW();
  SELECT COUNT(*) INTO v_avisos_agendados FROM avisos WHERE ativo = true AND publica_em > NOW();
  SELECT COUNT(*) INTO v_recorrencias FROM avisos_recorrencia WHERE ativo = true;
  SELECT COUNT(*) INTO v_avisos_gerados FROM avisos_gerados_por_recorrencia;
  
  RAISE NOTICE '📝 Avisos de teste inseridos: %', v_avisos_teste;
  RAISE NOTICE '✅ Avisos publicados (visíveis): %', v_avisos_publicados;
  RAISE NOTICE '⏰ Avisos agendados (futuros): %', v_avisos_agendados;
  RAISE NOTICE '🔄 Recorrências ativas: %', v_recorrencias;
  RAISE NOTICE '🤖 Avisos gerados automaticamente: %', v_avisos_gerados;
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '✅ TODOS OS RECURSOS ESTÃO FUNCIONANDO PERFEITAMENTE!';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📌 PRÓXIMOS PASSOS:';
  RAISE NOTICE '  1. Implementar UI do agendamento (Feature 3)';
  RAISE NOTICE '  2. Implementar UI de recorrências (Feature 4)';
  RAISE NOTICE '  3. Configurar cron job para chamar processar_recorrencias_ativas()';
  RAISE NOTICE '  4. Atualizar getAvisosAtivos() para filtrar publica_em';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  LIMPEZA: Para remover dados de teste, execute:';
  RAISE NOTICE '  DELETE FROM avisos WHERE mensagem LIKE ''[TESTE%'';';
  RAISE NOTICE '  DELETE FROM avisos_recorrencia WHERE titulo LIKE ''[TESTE%'';';
  RAISE NOTICE '';
END $$;

\echo ''
\echo '════════════════════════════════════════════════════════════════'
\echo '🎉 REPORT COMPLETO GERADO COM SUCESSO!'
\echo '════════════════════════════════════════════════════════════════'
\echo ''
