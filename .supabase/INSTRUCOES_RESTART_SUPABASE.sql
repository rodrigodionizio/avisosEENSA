-- ============================================================================
-- INSTRUÇÕES: Como Reiniciar o Projeto Supabase
-- EENSA · Quadro de Avisos Digital
-- Data: 25/03/2026
-- ============================================================================
-- PROBLEMA: PostgREST não recarregou schema após executar FIX_RLS_COMPLETE_RESET.sql
-- SOLUÇÃO: Reiniciar projeto Supabase via Dashboard
-- ============================================================================

-- ⚠️ ATENÇÃO: O comando NOTIFY pgrst não funcionou!
-- Isso significa que o PostgREST precisa ser reiniciado MANUALMENTE.

-- ────────────────────────────────────────────────────────────────────────────
-- OPÇÃO 1: Pause/Resume Project (RECOMENDADO)
-- ────────────────────────────────────────────────────────────────────────────

-- 1. Abrir: https://supabase.com/dashboard/project/bgcpcscbmfmtnpbsexog/settings/general
-- 2. Rolar até a seção "Danger Zone"
-- 3. Clicar em "Pause project"
-- 4. Confirmar
-- 5. Aguardar ~30 segundos (status: "Paused")
-- 6. Clicar em "Restore project"
-- 7. Aguardar ~2-3 minutos (status: "Active")
-- 8. Testar seleção de perfil no browser (Ctrl+Shift+F5 para hard refresh)

-- ────────────────────────────────────────────────────────────────────────────
-- OPÇÃO 2: Restart Connection Pooler (MAIS RÁPIDO)
-- ────────────────────────────────────────────────────────────────────────────

-- 1. Abrir: https://supabase.com/dashboard/project/bgcpcscbmfmtnpbsexog/settings/database
-- 2. Seção "Connection pooling"
-- 3. Clicar em "Restart connection"
-- 4. Aguardar ~10-20 segundos
-- 5. Testar seleção de perfil no browser

-- ⚠️ NOTA: Se ainda falhar, usar OPÇÃO 1

-- ────────────────────────────────────────────────────────────────────────────
-- VERIFICAÇÃO PÓS-REINÍCIO
-- ────────────────────────────────────────────────────────────────────────────

-- 1. Executar este SQL para confirmar policies:
SELECT 
  policyname,
  cmd,
  roles,
  qual IS NOT NULL AS has_using,
  with_check IS NOT NULL AS has_with_check
FROM pg_policies 
WHERE tablename = 'leitor_perfis'
ORDER BY cmd, policyname;

-- Resultado esperado (4 rows):
-- anon_insert_leitor_perfis | INSERT | has_using=false | has_with_check=true
-- anon_update_leitor_perfis | UPDATE | has_using=false | has_with_check=true
-- anon_select_leitor_perfis | SELECT | has_using=true  | has_with_check=false
-- authenticated_all         | ALL    | has_using=true  | has_with_check=true

-- 2. No browser:
--    - Limpar cache (Ctrl+Shift+Delete → Tudo)
--    - Hard refresh (Ctrl+Shift+F5)
--    - Testar seleção "Pais" ou "Alunos"
--    - DEVE FUNCIONAR sem erro 401

-- ────────────────────────────────────────────────────────────────────────────
-- SE AINDA FALHAR APÓS REINÍCIO
-- ────────────────────────────────────────────────────────────────────────────

-- Verificar se RLS está ativo:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'leitor_perfis';
-- rowsecurity DEVE ser 'true'

-- Verificar se tabela existe:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leitor_perfis';
-- DEVE retornar colunas: device_hash, perfil, user_id, etc.

-- ✅ APÓS SUCESSO: Marcar todo "Testar perfil Pai/Aluno" como completo
