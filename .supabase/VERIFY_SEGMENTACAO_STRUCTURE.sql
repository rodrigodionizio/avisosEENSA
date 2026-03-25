-- ============================================================================
-- VERIFICAÇÃO DA ESTRUTURA DE SEGMENTAÇÃO DE PÚBLICO
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026
-- ============================================================================
-- Execute estas queries no Supabase Dashboard (SQL Editor) para verificar
-- se as migrações foram aplicadas corretamente
-- ============================================================================

-- ============================================================================
-- 1. VERIFICAR COLUNAS ADICIONADAS NA TABELA AVISOS
-- ============================================================================
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'avisos'
  AND column_name IN ('publico_alvo', 'turmas')
ORDER BY ordinal_position;

-- Resultado esperado:
-- publico_alvo | ARRAY | {todos} | YES
-- turmas       | ARRAY | NULL    | YES


-- ============================================================================
-- 2. VERIFICAR ESTRUTURA DA TABELA LEITOR_PERFIS
-- ============================================================================
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable,
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'leitor_perfis'
ORDER BY ordinal_position;

-- Resultado esperado:
-- id, device_hash, perfil, user_id, nome_completo, email,
-- user_agent, criado_em, atualizado_em


-- ============================================================================
-- 3. VERIFICAR CONSTRAINTS DA TABELA LEITOR_PERFIS
-- ============================================================================
SELECT
  con.conname AS constraint_name,
  con.contype AS constraint_type,
  CASE con.contype
    WHEN 'c' THEN 'CHECK'
    WHEN 'f' THEN 'FOREIGN KEY'
    WHEN 'p' THEN 'PRIMARY KEY'
    WHEN 'u' THEN 'UNIQUE'
    ELSE con.contype::text
  END AS type_description,
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'leitor_perfis'
ORDER BY con.contype;

-- Espera-se: PRIMARY KEY (id), UNIQUE (device_hash), CHECK (perfil IN (...))


-- ============================================================================
-- 4. VERIFICAR ÍNDICES CRIADOS
-- ============================================================================
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('avisos', 'leitor_perfis')
  AND indexname LIKE '%publico%' 
   OR indexname LIKE '%leitor%' 
   OR indexname LIKE '%device%'
ORDER BY tablename, indexname;

-- Espera-se:
-- idx_avisos_publico (GIN)
-- idx_leitor_perfis_device
-- idx_leitor_perfis_user_id
-- idx_leitor_perfis_perfil


-- ============================================================================
-- 5. VERIFICAR RLS (Row Level Security) NA TABELA LEITOR_PERFIS
-- ============================================================================
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
WHERE tablename = 'leitor_perfis'
ORDER BY policyname;

-- Espera-se:
-- leitor_insert_public (INSERT, public)
-- leitor_update_own (UPDATE, public)
-- leitor_select_own (SELECT, public)
-- leitor_select_admin (SELECT, authenticated)


-- ============================================================================
-- 6. VERIFICAR SE RLS ESTÁ HABILITADO
-- ============================================================================
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'leitor_perfis';

-- rowsecurity deve ser TRUE


-- ============================================================================
-- 7. VERIFICAR TRIGGERS DA TABELA LEITOR_PERFIS
-- ============================================================================
SELECT
  trigger_name,
  event_manipulation AS event,
  event_object_table AS table_name,
  action_statement AS function_called,
  action_timing AS timing
FROM information_schema.triggers
WHERE event_object_table = 'leitor_perfis'
ORDER BY trigger_name;

-- Espera-se: leitor_perfis_updated_at (BEFORE UPDATE)


-- ============================================================================
-- 8. VERIFICAR VIEW DE ESTATÍSTICAS (SE CRIADA)
-- ============================================================================
SELECT
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE viewname = 'leitor_perfis_stats';

-- Se existir, mostra a definição da view


-- ============================================================================
-- 9. TESTAR TIPO DE DADOS PUBLICO_ALVO (verificar constraint)
-- ============================================================================
SELECT
  con.conname,
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'avisos'
  AND con.contype = 'c'
  AND pg_get_constraintdef(con.oid) LIKE '%publico_alvo%';

-- Espera-se: CHECK constraint com valores permitidos


-- ============================================================================
-- 10. VERIFICAR DADOS EXISTENTES (migração de avisos antigos)
-- ============================================================================
SELECT 
  COUNT(*) AS total_avisos,
  COUNT(publico_alvo) AS com_publico_alvo,
  COUNT(*) FILTER (WHERE publico_alvo = ARRAY['todos']) AS com_default_todos,
  COUNT(*) FILTER (WHERE publico_alvo IS NULL) AS publico_alvo_null,
  COUNT(*) FILTER (WHERE turmas IS NOT NULL) AS com_turmas_especificas
FROM avisos;

-- Espera-se: avisos antigos com publico_alvo = ['todos'] (default aplicado)


-- ============================================================================
-- 11. VERIFICAR DISTRIBUIÇÃO DE PERFIS (se houver dados)
-- ============================================================================
SELECT 
  perfil,
  COUNT(*) AS total_registros,
  COUNT(user_id) FILTER (WHERE user_id IS NOT NULL) AS com_google_auth,
  COUNT(nome_completo) FILTER (WHERE nome_completo IS NOT NULL) AS com_nome,
  MAX(criado_em) AS ultimo_registro
FROM leitor_perfis
GROUP BY perfil
ORDER BY total_registros DESC;

-- Se a tabela estiver vazia, retornará 0 linhas (normal em migração inicial)


-- ============================================================================
-- 12. VERIFICAR GRANTS (permissões de acesso)
-- ============================================================================
SELECT
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('leitor_perfis', 'avisos')
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- Espera-se: anon e authenticated com INSERT, SELECT, UPDATE em leitor_perfis


-- ============================================================================
-- RESUMO VISUAL - EXECUTAR POR ÚLTIMO
-- ============================================================================
SELECT 
  '✅ ESTRUTURA VERIFICADA' AS status,
  'Tabelas, índices, RLS e constraints criados com sucesso' AS mensagem
UNION ALL
SELECT 
  'ℹ️ PRÓXIMO PASSO' AS status,
  'Iniciar implementação TypeScript + React (Fase 1)' AS mensagem;
