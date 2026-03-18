-- ====================================================================
-- CORREÇÃO DEFINITIVA - Erro 403 Persistente
-- ====================================================================
-- Data: 18/03/2026
-- Problema: Erro 403 mesmo com políticas RLS corretas
-- Causa provável: Falta de permissões GRANT no schema e tabela
-- ====================================================================

-- ====================================================================
-- DIAGNÓSTICO INICIAL
-- ====================================================================

-- Ver status atual da tabela
SELECT 
  schemaname,
  tablename,
  tableowner,
  rowsecurity
FROM pg_tables
WHERE tablename = 'avisos';

-- Ver políticas existentes
SELECT 
  policyname,
  cmd,
  roles::text[]
FROM pg_policies
WHERE tablename = 'avisos'
ORDER BY cmd, policyname;

-- Ver permissões atuais
SELECT 
  grantor,
 grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'avisos'
ORDER BY grantee, privilege_type;

-- ====================================================================
-- CORREÇÃO 1: OWNER DA TABELA
-- ====================================================================
-- Garantir que a tabela pertence ao usuário postgres

ALTER TABLE public.avisos OWNER TO postgres;

-- ====================================================================
-- CORREÇÃO 2: PERMISSÕES NO SCHEMA PUBLIC
-- ====================================================================
-- Dar permissão de USAGE no schema para roles anon e authenticated

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO public;

-- ====================================================================
-- CORREÇÃO 3: PERMISSÕES NA TABELA AVISOS
-- ====================================================================
-- Dar permissões explícitas na tabela para roles anon e authenticated

-- Role ANON (visualização pública)
GRANT SELECT ON public.avisos TO anon;

-- Role AUTHENTICATED (visualização + gestão)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avisos TO authenticated;

-- ====================================================================
-- CORREÇÃO 4: PERMISSÕES EM SEQUENCES
-- ====================================================================
-- Se a tabela usa SERIAL/BIGSERIAL, dar permissão na sequence

GRANT USAGE, SELECT ON SEQUENCE avisos_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE avisos_id_seq TO anon;

-- ====================================================================
-- CORREÇÃO 5: RE-HABILITAR RLS (força refresh)
-- ====================================================================

ALTER TABLE public.avisos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- VERIFICAÇÃO FINAL
-- ====================================================================

-- 1. Confirmar OWNER
SELECT 
  tablename,
  tableowner,
  rowsecurity
FROM pg_tables
WHERE tablename = 'avisos';

-- Resultado esperado:
-- tablename | tableowner | rowsecurity
-- ----------+------------+-------------
-- avisos    | postgres   | true

-- 2. Confirmar PERMISSÕES
SELECT 
  grantee,
  string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_name = 'avisos'
GROUP BY grantee
ORDER BY grantee;

-- Resultado esperado:
-- grantee       | privileges
-- --------------+----------------------------
-- anon          | SELECT
-- authenticated | DELETE, INSERT, SELECT, UPDATE
-- postgres      | DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE

--3. Confirmar POLÍTICAS
SELECT 
  policyname,
  cmd,
  roles::text[]
FROM pg_policies
WHERE tablename = 'avisos'
ORDER BY cmd, policyname;

-- Resultado esperado: 4 políticas
-- prod_delete_avisos | DELETE | {authenticated}
-- prod_insert_avisos | INSERT | {authenticated}
-- prod_select_avisos | SELECT | {anon,authenticated}
-- prod_update_avisos | UPDATE | {authenticated}

-- 4. Confirmar RLS
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'avisos';

-- Resultado esperado:
-- tablename | rowsecurity
-- ----------+-------------
-- avisos    | true

-- ====================================================================
-- TESTE MANUAL (opcional)
-- ====================================================================

-- Tentar SELECT como role anon (deve funcionar)
SET ROLE anon;
SELECT * FROM avisos LIMIT 1;
RESET ROLE;

-- Tentar INSERT como role anon (deve FALHAR - esperado)
SET ROLE anon;
INSERT INTO avisos (titulo, corpo, prioridade, categoria, autor)
VALUES ('Teste', 'Teste', 'info', 'Geral', 'Teste');
-- Erro esperado: new row violates row-level security policy
RESET ROLE;

-- Tentar INSERT como role authenticated (deve FUNCIONAR se autenticado)
-- Nota: Este teste só funciona se você tiver uma sessão autenticada

-- ====================================================================
-- ✅ CONCLUSÃO
-- ====================================================================
-- Após executar este script:
-- 1. Todas as permissões estarão configuradas
-- 2. RLS estará habilitado
-- 3. Políticas estarão ativas
-- 4. Roles terão acesso correto
--
-- Próximo passo:
-- - Reiniciar aplicação: npm run dev
-- - Testar no navegador: http://localhost:3000/
-- - Verificar console (F12) para logs detalhados
-- - Erro 403 deve desaparecer!
-- ====================================================================

-- ====================================================================
-- TROUBLESHOOTING ADICIONAL (se ainda falhar)
-- ====================================================================

-- Ver configuração completa da tabela
\d+ avisos

-- Ver roles disponíveis
SELECT rolname, rolsuper FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'postgres', 'service_role');

-- Ver privilégios do schema public
SELECT 
  nspname as schema,
  nspowner::regrole as owner,
  nspacl as acl
FROM pg_namespace
WHERE nspname = 'public';

-- Ver todas as policies com detalhes completos
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
WHERE tablename = 'avisos';
