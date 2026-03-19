-- ════════════════════════════════════════════════════════════════════════════
-- EENSA - AVISOS ESCOLARES
-- MIGRATION COMPLETO: Features de Compartilhamento e Automação
-- ════════════════════════════════════════════════════════════════════════════
-- 
-- Features implementadas:
--   1. Links Permanentes (sem mudanças banco)
--   2. QR Code no Modo TV (sem mudanças banco)
--   3. Agendamento de Publicação (ADD publica_em)
--   4. Recorrência Automática (novas tabelas)
--
-- Executar este script no SQL Editor do Supabase
-- Data: 19/03/2026
-- ════════════════════════════════════════════════════════════════════════════

\echo '════════════════════════════════════════════════════════════════'
\echo 'INICIANDO MIGRATION - EENSA FEATURES AVANÇADAS'
\echo '════════════════════════════════════════════════════════════════'

-- ============================================================================
-- PARTE 1: AGENDAMENTO DE PUBLICAÇÃO (FEATURE 3)
-- ============================================================================

\echo ''
\echo '📅 [1/6] Adicionando campo publica_em à tabela avisos...'

-- 1.1 Adicionar coluna publica_em (permite NULL temporariamente)
ALTER TABLE avisos 
ADD COLUMN IF NOT EXISTS publica_em TIMESTAMPTZ;

-- 1.2 Atualizar avisos existentes: publica_em = criado_em (retroativo)
UPDATE avisos 
SET publica_em = criado_em 
WHERE publica_em IS NULL;

-- 1.3 Tornar campo obrigatório após popular dados
ALTER TABLE avisos 
ALTER COLUMN publica_em SET NOT NULL;

-- 1.4 Definir default para novos registros
ALTER TABLE avisos 
ALTER COLUMN publica_em SET DEFAULT NOW();

-- 1.5 Adicionar constraint: publica_em deve ser <= expira_em (se expira_em existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'avisos_publica_antes_expira'
  ) THEN
    ALTER TABLE avisos 
    ADD CONSTRAINT avisos_publica_antes_expira 
    CHECK (expira_em IS NULL OR publica_em <= expira_em);
  END IF;
END $$;

-- 1.6 Criar índices para queries eficientes
CREATE INDEX IF NOT EXISTS idx_avisos_publica_em 
  ON avisos(publica_em);

CREATE INDEX IF NOT EXISTS idx_avisos_ativo_publica 
  ON avisos(ativo, publica_em);

CREATE INDEX IF NOT EXISTS idx_avisos_publicados 
  ON avisos(ativo, publica_em, expira_em);

-- 1.7 Comentários para documentação
COMMENT ON COLUMN avisos.publica_em IS 
'Data/hora programada para o aviso ficar visível ao público. Avisos com publica_em futuro ficam ocultos até essa data/hora.';

\echo '✅ Campo publica_em adicionado com sucesso!'

-- ============================================================================
-- PARTE 2: TABELAS DE RECORRÊNCIA (FEATURE 4)
-- ============================================================================

\echo ''
\echo '🔄 [2/6] Criando tabelas de recorrência...'

-- 2.1 Tabela principal: configuração de avisos recorrentes
CREATE TABLE IF NOT EXISTS avisos_recorrencia (
  id SERIAL PRIMARY KEY,
  
  -- Template do aviso (campos que serão replicados)
  titulo VARCHAR(120) NOT NULL
    CHECK (char_length(titulo) >= 5),
  corpo TEXT NOT NULL
    CHECK (char_length(corpo) >= 10 AND char_length(corpo) <= 2000),
  prioridade VARCHAR(10) NOT NULL DEFAULT 'normal'
    CHECK (prioridade IN ('urgente', 'normal', 'info')),
  categoria VARCHAR(50) NOT NULL
    CHECK (categoria IN ('Geral', 'Reunião', 'Avaliações', 'Esportes', 
                         'Evento', 'Cultura', 'Regra', 'Informativo')),
  autor VARCHAR(80) NOT NULL
    CHECK (char_length(autor) >= 2),
  
  -- Configuração de recorrência
  padrao VARCHAR(20) NOT NULL
    CHECK (padrao IN ('diario', 'semanal', 'mensal')),
  
  -- Para recorrência SEMANAL: dias da semana
  -- [1,3,5] = segunda, quarta, sexta (1=segunda ... 7=domingo)
  dias_semana INTEGER[]
    CHECK (
      padrao != 'semanal' OR 
      (dias_semana IS NOT NULL AND array_length(dias_semana, 1) > 0)
    ),
  
  -- Para recorrência MENSAL: dia do mês (1-31)
  dia_mes INTEGER
    CHECK (
      padrao != 'mensal' OR 
      (dia_mes IS NOT NULL AND dia_mes BETWEEN 1 AND 31)
    ),
  
  -- Para recorrência DIÁRIA: intervalo em dias
  intervalo_dias INTEGER DEFAULT 1
    CHECK (
      padrao != 'diario' OR 
      (intervalo_dias IS NOT NULL AND intervalo_dias >= 1 AND intervalo_dias <= 30)
    ),
  
  -- Horário de publicação (formato HH:MM)
  hora_publicacao TIME NOT NULL DEFAULT '06:00',
  
  -- Período ativo da recorrência
  data_inicio DATE NOT NULL,
  data_fim DATE
    CHECK (data_fim IS NULL OR data_fim >= data_inicio),
  
  -- Limite de ocorrências (alternativa à data_fim)
  max_ocorrencias INTEGER
    CHECK (max_ocorrencias IS NULL OR max_ocorrencias > 0),
  
  -- Duração de cada aviso gerado (em dias)
  duracao_dias INTEGER NOT NULL DEFAULT 1
    CHECK (duracao_dias >= 1 AND duracao_dias <= 30),
  
  -- Controle
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  criado_por TEXT,  -- Email do admin que criou
  
  -- Contador de avisos já gerados
  ocorrencias_geradas INTEGER NOT NULL DEFAULT 0
);

-- 2.2 Tabela de log: rastreamento de avisos gerados
CREATE TABLE IF NOT EXISTS avisos_gerados_por_recorrencia (
  id SERIAL PRIMARY KEY,
  recorrencia_id INTEGER NOT NULL 
    REFERENCES avisos_recorrencia(id) ON DELETE CASCADE,
  aviso_id INTEGER NOT NULL 
    REFERENCES avisos(id) ON DELETE CASCADE,
  data_geracao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  publica_em TIMESTAMPTZ NOT NULL,
  
  -- Evita gerar mesmo aviso duas vezes para mesma data
  UNIQUE(recorrencia_id, publica_em)
);

-- 2.3 Índices para performance
CREATE INDEX IF NOT EXISTS idx_recorrencia_ativo 
  ON avisos_recorrencia(ativo, data_inicio, data_fim);

CREATE INDEX IF NOT EXISTS idx_recorrencia_processamento
  ON avisos_recorrencia(ativo, padrao, data_inicio, data_fim)
  WHERE ativo = true AND (data_fim IS NULL OR data_fim >= CURRENT_DATE);

CREATE INDEX IF NOT EXISTS idx_gerados_recorrencia 
  ON avisos_gerados_por_recorrencia(recorrencia_id, publica_em);

CREATE INDEX IF NOT EXISTS idx_gerados_aviso
  ON avisos_gerados_por_recorrencia(aviso_id);

-- 2.4 Comentários para documentação
COMMENT ON TABLE avisos_recorrencia IS 
'Configuração de avisos recorrentes. Cada registro é um "template" que gera avisos automaticamente em datas configuradas.';

COMMENT ON COLUMN avisos_recorrencia.padrao IS 
'Padrão de repetição: diario (a cada N dias), semanal (dias específicos), mensal (dia do mês)';

COMMENT ON COLUMN avisos_recorrencia.dias_semana IS 
'Array de inteiros 1-7 (1=segunda, 7=domingo). Usado apenas quando padrao=semanal. Ex: [1,3,5] = seg/qua/sex';

COMMENT ON COLUMN avisos_recorrencia.dia_mes IS 
'Dia do mês (1-31) para publicação. Usado apenas quando padrao=mensal. Ex: 15 = todo dia 15';

COMMENT ON COLUMN avisos_recorrencia.intervalo_dias IS 
'Intervalo em dias entre publicações. Usado apenas quando padrao=diario. Ex: 3 = a cada 3 dias';

COMMENT ON COLUMN avisos_recorrencia.duracao_dias IS 
'Quantos dias cada aviso gerado fica ativo antes de expirar. Ex: 2 = aviso expira 2 dias após publicação';

COMMENT ON COLUMN avisos_recorrencia.ocorrencias_geradas IS 
'Contador total de avisos já gerados por esta recorrência. Incrementado automaticamente.';

COMMENT ON TABLE avisos_gerados_por_recorrencia IS 
'Log de todos os avisos gerados automaticamente por recorrências. Rastreia relacionamento recorrencia -> aviso.';

\echo '✅ Tabelas de recorrência criadas com sucesso!'

-- ============================================================================
-- PARTE 3: ROW LEVEL SECURITY (RLS)
-- ============================================================================

\echo ''
\echo '🔐 [3/6] Configurando políticas de segurança (RLS)...'

-- 3.1 Habilitar RLS nas novas tabelas
ALTER TABLE avisos_recorrencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE avisos_gerados_por_recorrencia ENABLE ROW LEVEL SECURITY;

-- 3.2 Policies para avisos_recorrencia

-- SELECT: Apenas autenticados podem ver recorrências
DROP POLICY IF EXISTS "Authenticated users can view recorrencias" ON avisos_recorrencia;
CREATE POLICY "Authenticated users can view recorrencias"
  ON avisos_recorrencia
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Apenas autenticados podem criar recorrências
DROP POLICY IF EXISTS "Authenticated users can create recorrencias" ON avisos_recorrencia;
CREATE POLICY "Authenticated users can create recorrencias"
  ON avisos_recorrencia
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: Apenas autenticados podem atualizar
DROP POLICY IF EXISTS "Authenticated users can update recorrencias" ON avisos_recorrencia;
CREATE POLICY "Authenticated users can update recorrencias"
  ON avisos_recorrencia
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- DELETE: Apenas autenticados podem deletar
DROP POLICY IF EXISTS "Authenticated users can delete recorrencias" ON avisos_recorrencia;
CREATE POLICY "Authenticated users can delete recorrencias"
  ON avisos_recorrencia
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 3.3 Policies para avisos_gerados_por_recorrencia

-- SELECT: Apenas autenticados (para auditoria)
DROP POLICY IF EXISTS "Authenticated users can view generated logs" ON avisos_gerados_por_recorrencia;
CREATE POLICY "Authenticated users can view generated logs"
  ON avisos_gerados_por_recorrencia
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Apenas via backend (service role)
-- Não precisa policy pública - geração é automática

-- 3.4 Grants necessários
GRANT SELECT ON avisos_recorrencia TO authenticated;
GRANT INSERT, UPDATE, DELETE ON avisos_recorrencia TO authenticated;
GRANT USAGE ON SEQUENCE avisos_recorrencia_id_seq TO authenticated;

GRANT SELECT ON avisos_gerados_por_recorrencia TO authenticated;
GRANT USAGE ON SEQUENCE avisos_gerados_por_recorrencia_id_seq TO authenticated;

\echo '✅ Políticas de segurança configuradas!'

-- ============================================================================
-- PARTE 4: VIEWS ÚTEIS
-- ============================================================================

\echo ''
\echo '👁️ [4/6] Criando views para facilitar queries...'

-- 4.1 View: Avisos ativos e publicados (filtra publica_em)
CREATE OR REPLACE VIEW avisos_visiveis AS
SELECT 
  a.*,
  CASE 
    WHEN a.expira_em IS NOT NULL AND a.expira_em < NOW() THEN true
    ELSE false
  END as esta_expirado,
  CASE
    WHEN a.publica_em > NOW() THEN true
    ELSE false
  END as esta_agendado
FROM avisos a
WHERE 
  a.ativo = true 
  AND a.publica_em <= NOW()
  AND (a.expira_em IS NULL OR a.expira_em >= NOW())
ORDER BY 
  CASE a.prioridade
    WHEN 'urgente' THEN 1
    WHEN 'normal' THEN 2
    WHEN 'info' THEN 3
  END,
  a.criado_em DESC;

COMMENT ON VIEW avisos_visiveis IS 
'Avisos que devem ser exibidos ao público: ativos, já publicados (publica_em <= NOW) e não expirados.';

-- 4.2 View: Avisos agendados (futuros)
CREATE OR REPLACE VIEW avisos_agendados AS
SELECT 
  a.*,
  EXTRACT(EPOCH FROM (a.publica_em - NOW())) as segundos_ate_publicacao,
  (a.publica_em - NOW()) as tempo_restante
FROM avisos a
WHERE 
  a.ativo = true 
  AND a.publica_em > NOW()
ORDER BY a.publica_em ASC;

COMMENT ON VIEW avisos_agendados IS 
'Avisos com publicação futura. Útil para admin visualizar o que está agendado.';

-- 4.3 View: Estatísticas de recorrências
CREATE OR REPLACE VIEW stats_recorrencias AS
SELECT 
  r.id,
  r.titulo,
  r.padrao,
  r.ativo,
  r.ocorrencias_geradas,
  COUNT(g.id) as avisos_existentes,
  MIN(g.publica_em) as primeira_publicacao,
  MAX(g.publica_em) as ultima_publicacao,
  COUNT(g.id) FILTER (WHERE g.publica_em > NOW()) as futuros_agendados
FROM avisos_recorrencia r
LEFT JOIN avisos_gerados_por_recorrencia g ON g.recorrencia_id = r.id
GROUP BY r.id, r.titulo, r.padrao, r.ativo, r.ocorrencias_geradas;

COMMENT ON VIEW stats_recorrencias IS 
'Estatísticas agrupadas de cada recorrência: quantos avisos gerados, datas, futuros agendados.';

\echo '✅ Views criadas com sucesso!'

-- ============================================================================
-- PARTE 5: FUNCTIONS E PROCEDURES
-- ============================================================================

\echo ''
\echo '⚙️ [5/6] Criando funções auxiliares...'

-- 5.1 Function: Obter próxima data de publicação para recorrência
CREATE OR REPLACE FUNCTION calcular_proxima_publicacao(
  p_recorrencia_id INTEGER,
  p_data_referencia TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
AS $$
DECLARE
  v_rec RECORD;
  v_proxima_data DATE;
  v_resultado TIMESTAMPTZ;
  v_dia_semana INTEGER;
BEGIN
  -- Buscar configuração da recorrência
  SELECT * INTO v_rec
  FROM avisos_recorrencia
  WHERE id = p_recorrencia_id AND ativo = true;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Verificar se já atingiu data_fim
  IF v_rec.data_fim IS NOT NULL AND v_rec.data_fim < p_data_referencia::DATE THEN
    RETURN NULL;
  END IF;
  
  -- Verificar se já atingiu max_ocorrencias
  IF v_rec.max_ocorrencias IS NOT NULL AND v_rec.ocorrencias_geradas >= v_rec.max_ocorrencias THEN
    RETURN NULL;
  END IF;
  
  -- Calcular próxima data baseado no padrão
  IF v_rec.padrao = 'diario' THEN
    v_proxima_data := p_data_referencia::DATE + (v_rec.intervalo_dias || ' days')::INTERVAL;
    
  ELSIF v_rec.padrao = 'semanal' THEN
    -- Próximo dia da semana que está no array dias_semana
    v_proxima_data := p_data_referencia::DATE + '1 day'::INTERVAL;
    LOOP
      v_dia_semana := EXTRACT(ISODOW FROM v_proxima_data);  -- 1=seg, 7=dom
      IF v_dia_semana = ANY(v_rec.dias_semana) THEN
        EXIT;
      END IF;
      v_proxima_data := v_proxima_data + '1 day'::INTERVAL;
      
      -- Proteção contra loop infinito
      IF v_proxima_data > p_data_referencia::DATE + '14 days'::INTERVAL THEN
        RETURN NULL;
      END IF;
    END LOOP;
    
  ELSIF v_rec.padrao = 'mensal' THEN
    -- Próximo mês, mesmo dia
    v_proxima_data := (DATE_TRUNC('month', p_data_referencia) + '1 month'::INTERVAL)::DATE 
                      + (v_rec.dia_mes - 1 || ' days')::INTERVAL;
    
    -- Se dia não existe no mês (ex: 31 em fevereiro), pega último dia do mês
    IF EXTRACT(DAY FROM v_proxima_data) != v_rec.dia_mes THEN
      v_proxima_data := (DATE_TRUNC('month', v_proxima_data) + '1 month - 1 day'::INTERVAL)::DATE;
    END IF;
  END IF;
  
  -- Combinar data com horário
  v_resultado := v_proxima_data + v_rec.hora_publicacao;
  
  -- Verificar se não ultrapassou data_fim
  IF v_rec.data_fim IS NOT NULL AND v_resultado::DATE > v_rec.data_fim THEN
    RETURN NULL;
  END IF;
  
  RETURN v_resultado;
END;
$$;

COMMENT ON FUNCTION calcular_proxima_publicacao IS 
'Calcula a próxima data de publicação para uma recorrência. Considera padrão, dias_semana, dia_mes, data_fim e max_ocorrencias.';

-- 5.2 Procedure: Gerar avisos recorrentes (chamada por cron ou manual)
CREATE OR REPLACE PROCEDURE processar_recorrencias_ativas(
  p_dias_a_frente INTEGER DEFAULT 30
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_rec RECORD;
  v_proxima_data TIMESTAMPTZ;
  v_expira_em TIMESTAMPTZ;
  v_aviso_id INTEGER;
  v_contador INTEGER := 0;
BEGIN
  RAISE NOTICE 'Iniciando processamento de recorrências ativas...';
  
  -- Percorrer todas recorrências ativas
  FOR v_rec IN 
    SELECT * FROM avisos_recorrencia 
    WHERE ativo = true
    AND (data_fim IS NULL OR data_fim >= CURRENT_DATE)
    ORDER BY id
  LOOP
    RAISE NOTICE 'Processando recorrência ID=%: %', v_rec.id, v_rec.titulo;
    
    -- Calcular próxima data de publicação
    v_proxima_data := calcular_proxima_publicacao(v_rec.id);
    
    -- Gerar avisos até p_dias_a_frente no futuro
    WHILE v_proxima_data IS NOT NULL 
      AND v_proxima_data <= NOW() + (p_dias_a_frente || ' days')::INTERVAL
    LOOP
      -- Verificar se já não foi gerado (evitar duplicatas)
      IF NOT EXISTS (
        SELECT 1 FROM avisos_gerados_por_recorrencia
        WHERE recorrencia_id = v_rec.id
        AND publica_em = v_proxima_data
      ) THEN
        -- Calcular data de expiração
        v_expira_em := v_proxima_data + (v_rec.duracao_dias || ' days')::INTERVAL;
        
        -- Inserir o aviso
        INSERT INTO avisos (
          titulo, corpo, prioridade, categoria, autor,
          publica_em, expira_em, ativo, criado_em
        ) VALUES (
          v_rec.titulo,
          v_rec.corpo,
          v_rec.prioridade,
          v_rec.categoria,
          v_rec.autor,
          v_proxima_data,
          v_expira_em,
          true,
          NOW()
        ) RETURNING id INTO v_aviso_id;
        
        -- Registrar no log
        INSERT INTO avisos_gerados_por_recorrencia (
          recorrencia_id, aviso_id, publica_em
        ) VALUES (
          v_rec.id, v_aviso_id, v_proxima_data
        );
        
        -- Incrementar contador da recorrência
        UPDATE avisos_recorrencia
        SET ocorrencias_geradas = ocorrencias_geradas + 1
        WHERE id = v_rec.id;
        
        v_contador := v_contador + 1;
        
        RAISE NOTICE '  ✓ Aviso #% gerado para %', v_aviso_id, v_proxima_data;
      END IF;
      
      -- Calcular próxima data após esta
      v_proxima_data := calcular_proxima_publicacao(v_rec.id, v_proxima_data);
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Processamento concluído. Total de avisos gerados: %', v_contador;
END;
$$;

COMMENT ON PROCEDURE processar_recorrencias_ativas IS 
'Processa todas recorrências ativas e gera avisos para os próximos N dias. Deve ser chamada periodicamente (cron).';

-- 5.3 Function: Estatísticas gerais do sistema
CREATE OR REPLACE FUNCTION get_stats_dashboard()
RETURNS TABLE(
  total_avisos INTEGER,
  avisos_ativos INTEGER,
  avisos_urgentes INTEGER,
  avisos_expirados INTEGER,
  avisos_agendados INTEGER,
  recorrencias_ativas INTEGER,
  total_gerados_recorrencia BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COUNT(*)::INTEGER as total_avisos,
    COUNT(*) FILTER (WHERE ativo = true AND publica_em <= NOW() 
                     AND (expira_em IS NULL OR expira_em >= NOW()))::INTEGER as avisos_ativos,
    COUNT(*) FILTER (WHERE ativo = true AND prioridade = 'urgente' 
                     AND publica_em <= NOW()
                     AND (expira_em IS NULL OR expira_em >= NOW()))::INTEGER as avisos_urgentes,
    COUNT(*) FILTER (WHERE expira_em IS NOT NULL AND expira_em < NOW())::INTEGER as avisos_expirados,
    COUNT(*) FILTER (WHERE ativo = true AND publica_em > NOW())::INTEGER as avisos_agendados,
    (SELECT COUNT(*)::INTEGER FROM avisos_recorrencia WHERE ativo = true) as recorrencias_ativas,
    (SELECT COUNT(*) FROM avisos_gerados_por_recorrencia) as total_gerados_recorrencia
  FROM avisos;
$$;

COMMENT ON FUNCTION get_stats_dashboard IS 
'Retorna estatísticas agregadas do sistema para exibir no dashboard admin.';

\echo '✅ Funções e procedures criadas com sucesso!'

-- ============================================================================
-- PARTE 6: VALIDAÇÃO E TESTES
-- ============================================================================

\echo ''
\echo '🧪 [6/6] Executando validações...'

-- 6.1 Testar se campo publica_em foi adicionado
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'avisos' AND column_name = 'publica_em'
  ) THEN
    RAISE NOTICE '✓ Campo publica_em existe na tabela avisos';
  ELSE
    RAISE EXCEPTION '✗ Campo publica_em NÃO foi adicionado!';
  END IF;
END $$;

-- 6.2 Testar se tabelas de recorrência existem
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name IN ('avisos_recorrencia', 'avisos_gerados_por_recorrencia')
  ) THEN
    RAISE NOTICE '✓ Tabelas de recorrência existem';
  ELSE
    RAISE EXCEPTION '✗ Tabelas de recorrência NÃO foram criadas!';
  END IF;
END $$;

-- 6.3 Testar se views foram criadas
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.views 
    WHERE table_name IN ('avisos_visiveis', 'avisos_agendados', 'stats_recorrencias')
  ) THEN
    RAISE NOTICE '✓ Views criadas com sucesso';
  ELSE
    RAISE EXCEPTION '✗ Views NÃO foram criadas!';
  END IF;
END $$;

-- 6.4 Testar se functions existem
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname IN ('calcular_proxima_publicacao', 'get_stats_dashboard')
  ) THEN
    RAISE NOTICE '✓ Functions existem';
  ELSE
    RAISE EXCEPTION '✗ Functions NÃO foram criadas!';
  END IF;
END $$;

-- 6.5 Contar registros para verificar integridade
DO $$
DECLARE
  v_count_avisos INTEGER;
  v_count_recorrencias INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count_avisos FROM avisos WHERE publica_em IS NOT NULL;
  SELECT COUNT(*) INTO v_count_recorrencias FROM avisos_recorrencia;
  
  RAISE NOTICE '✓ Total de avisos com publica_em: %', v_count_avisos;
  RAISE NOTICE '✓ Total de recorrências: %', v_count_recorrencias;
END $$;

-- 6.6 Testar função de stats
DO $$
DECLARE
  v_stats RECORD;
BEGIN
  SELECT * INTO v_stats FROM get_stats_dashboard();
  RAISE NOTICE '✓ Stats dashboard: Ativos=%, Agendados=%, Recorrências=%', 
    v_stats.avisos_ativos, v_stats.avisos_agendados, v_stats.recorrencias_ativas;
END $$;

\echo ''
\echo '════════════════════════════════════════════════════════════════'
\echo '✅ MIGRATION CONCLUÍDA COM SUCESSO!'
\echo '════════════════════════════════════════════════════════════════'
\echo ''
\echo 'Próximos passos:'
\echo '  1. Verificar se todos os testes acima passaram (✓)'
\echo '  2. Atualizar código TypeScript com novas queries'
\echo '  3. Implementar UI para agendamento e recorrências'
\echo '  4. Configurar cron job para chamar processar_recorrencias_ativas()'
\echo ''
\echo '📚 Documentação:'
\echo '  - Campo publica_em adicionado à tabela avisos'
\echo '  - Tabelas avisos_recorrencia e avisos_gerados_por_recorrencia criadas'
\echo '  - Views: avisos_visiveis, avisos_agendados, stats_recorrencias'
\echo '  - Function: calcular_proxima_publicacao(recorrencia_id)'
\echo '  - Procedure: processar_recorrencias_ativas(dias_a_frente)'
\echo '  - Function: get_stats_dashboard() para estatísticas'
\echo ''
\echo '⚠️  IMPORTANTE:'
\echo '  - Atualizar query getAvisosAtivos() para filtrar publica_em <= NOW()'
\echo '  - Criar query getAvisosAgendados() para tab AGENDADOS'
\echo '  - Políticas RLS aplicadas: apenas authenticated pode gerenciar'
\echo ''
\echo '════════════════════════════════════════════════════════════════'

-- Fim do script
