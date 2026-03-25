-- ============================================================================
-- RELOAD DO SCHEMA DO PostgREST (API REST)
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026
-- ============================================================================
-- PROBLEMA: Policies corretas no PostgreSQL, mas erro 401 persiste no browser
-- CAUSA: PostgREST usa cache do schema e não detectou mudanças nas policies
-- SOLUÇÃO: Notificar PostgREST para recarregar schema
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- MÉTODO 1: NOTIFY (via SQL)
-- ────────────────────────────────────────────────────────────────────────────

-- Enviar sinal para PostgREST recarregar schema
NOTIFY pgrst, 'reload schema';

-- ────────────────────────────────────────────────────────────────────────────
-- MÉTODO 2: Verificar se PostgREST está "ouvindo"
-- ────────────────────────────────────────────────────────────────────────────

-- Lista listeners ativos (deve mostrar 'pgrst' se Supabase está ativo)
SELECT * FROM pg_listening_channels();

-- ────────────────────────────────────────────────────────────────────────────
-- MÉTODO 3: Forçar reload via Dashboard (se SQL não funcionar)
-- ────────────────────────────────────────────────────────────────────────────

-- ⚠️ SE O COMANDO SQL NÃO FUNCIONAR:
-- 1. Abrir: https://supabase.com/dashboard/project/bgcpcscbmfmtnpbsexog/settings/api
-- 2. Rolar até "Connection pooling"
-- 3. Clicar em "Restart connection" ou "Pause project" → "Resume project"
-- 4. Aguardar ~30 segundos
-- 5. Tentar novamente no browser

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

-- Confirmar que policies estão corretas
SELECT 
  policyname,
  cmd,
  roles,
  qual IS NOT NULL AS has_using,
  with_check IS NOT NULL AS has_with_check
FROM pg_policies 
WHERE tablename = 'leitor_perfis'
ORDER BY cmd, policyname;

-- ✅ Resultado esperado:
-- anon_insert: has_using=FALSE, has_with_check=TRUE
-- anon_update: has_using=FALSE, has_with_check=TRUE
-- anon_select: has_using=TRUE, has_with_check=FALSE
-- authenticated_all: has_using=TRUE, has_with_check=TRUE
