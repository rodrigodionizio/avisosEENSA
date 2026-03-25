-- ════════════════════════════════════════════════════════════════════════════
-- EENSA - AVISOS ESCOLARES
-- ATUALIZAÇÃO: Popular display_name em aviso_confirmacoes
-- ════════════════════════════════════════════════════════════════════════════
-- 
-- Objetivo:
--   Preencher o campo display_name vazio na tabela aviso_confirmacoes
--   com o nome_completo da tabela leitor_perfis usando user_id como chave de relacionamento
--
-- Contexto:
--   - Campo display_name estava sendo salvo vazio nas confirmações de leitura
--   - Professores autenticados têm user_id (UUID) preenchido
--   - Nome completo está disponível em leitor_perfis.nome_completo
--
-- Executar este script no SQL Editor do Supabase
-- Data: 25/03/2026
-- ════════════════════════════════════════════════════════════════════════════

\echo ''
\echo '🔄 ATUALIZANDO display_name em aviso_confirmacoes...'
\echo ''

-- ════════════════════════════════════════════════════════════════════════════
-- ETAPA 1: Verificar quantos registros precisam ser atualizados
-- ════════════════════════════════════════════════════════════════════════════

SELECT 
  COUNT(*) as total_vazios,
  COUNT(DISTINCT ac.user_id) as professores_unicos
FROM aviso_confirmacoes ac
WHERE ac.user_id IS NOT NULL
  AND (ac.display_name IS NULL OR ac.display_name = '');

\echo ''
\echo '↑ Registros que serão atualizados'
\echo ''

-- ════════════════════════════════════════════════════════════════════════════
-- ETAPA 2: Atualizar display_name com dados de leitor_perfis
-- ════════════════════════════════════════════════════════════════════════════

UPDATE aviso_confirmacoes ac
SET display_name = lp.nome_completo
FROM leitor_perfis lp
WHERE ac.user_id = lp.user_id
  AND ac.user_id IS NOT NULL
  AND (ac.display_name IS NULL OR ac.display_name = '')
  AND lp.nome_completo IS NOT NULL
  AND lp.perfil = 'professor';

\echo ''
\echo '✅ display_name atualizado com sucesso!'
\echo ''

-- ════════════════════════════════════════════════════════════════════════════
-- ETAPA 3: Verificar resultado da atualização
-- ════════════════════════════════════════════════════════════════════════════

SELECT 
  COUNT(*) as total_preenchidos,
  COUNT(DISTINCT ac.user_id) as professores_com_nome
FROM aviso_confirmacoes ac
WHERE ac.user_id IS NOT NULL
  AND ac.display_name IS NOT NULL
  AND ac.display_name != '';

\echo ''
\echo '↑ Registros agora preenchidos'
\echo ''

-- ════════════════════════════════════════════════════════════════════════════
-- ETAPA 4: [OPCIONAL] Verificar se ainda há registros vazios
-- ════════════════════════════════════════════════════════════════════════════

SELECT 
  ac.id,
  ac.aviso_id,
  ac.user_id,
  ac.display_name,
  ac.confirmado_em,
  lp.nome_completo as nome_em_leitor_perfis,
  lp.perfil
FROM aviso_confirmacoes ac
LEFT JOIN leitor_perfis lp ON ac.user_id = lp.user_id
WHERE ac.user_id IS NOT NULL
  AND (ac.display_name IS NULL OR ac.display_name = '')
LIMIT 10;

\echo ''
\echo '↑ Registros ainda vazios (se houver, verificar motivo)'
\echo ''
\echo '────────────────────────────────────────────────────────────────────────'
\echo 'EXPLICAÇÃO DOS POSSÍVEIS CASOS DE REGISTROS AINDA VAZIOS:'
\echo '────────────────────────────────────────────────────────────────────────'
\echo '1. user_id não existe em leitor_perfis (usuário não completou cadastro)'
\echo '2. nome_completo em leitor_perfis está NULL (erro no OAuth)'
\echo '3. perfil != professor (pais/alunos não têm nome_completo)'
\echo ''

-- ════════════════════════════════════════════════════════════════════════════
-- ETAPA 5: [INFORMATIVO] Exemplo de JOIN para consulta futura
-- ════════════════════════════════════════════════════════════════════════════

\echo ''
\echo '📋 EXEMPLO: Consultar confirmações com nomes de professores'
\echo ''

SELECT 
  ac.id,
  ac.aviso_id,
  COALESCE(ac.display_name, lp.nome_completo, 'Anônimo') as nome_exibicao,
  ac.confirmado_em,
  TO_CHAR(ac.confirmado_em, 'HH24:MI') as horario,
  lp.perfil,
  lp.email
FROM aviso_confirmacoes ac
LEFT JOIN leitor_perfis lp ON ac.user_id = lp.user_id
WHERE ac.aviso_id = 1  -- ← SUBSTITUIR pelo ID do aviso desejado
  AND lp.perfil = 'professor'
ORDER BY ac.confirmado_em ASC
LIMIT 20;

\echo ''
\echo '✅ SCRIPT CONCLUÍDO!'
\echo ''
\echo '────────────────────────────────────────────────────────────────────────'
\echo 'PRÓXIMOS PASSOS:'
\echo '────────────────────────────────────────────────────────────────────────'
\echo '1. ✅ API /api/confirmacoes agora preenche display_name automaticamente'
\echo '2. ✅ ProfessoresCienciaDashboard mostra lista nominal de professores'
\echo '3. ✅ Frontend exibe botão "Gestão" para admins'
\echo '4. 🎯 Testar em ambiente de desenvolvimento'
\echo '5. 🚀 Deploy para produção'
\echo '────────────────────────────────────────────────────────────────────────'
\echo ''
