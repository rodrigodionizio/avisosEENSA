-- CORREÇÃO: Permissões da tabela tv_settings
-- Execute este script se estiver recebendo erro 403 ao salvar configurações

-- 1. Verificar se a tabela existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'tv_settings'
);

-- 2. Garantir que a tabela existe (criar se não existir)
CREATE TABLE IF NOT EXISTS tv_settings (
  id SERIAL PRIMARY KEY,
  timer_seconds INTEGER NOT NULL DEFAULT 20
    CHECK (timer_seconds BETWEEN 15 AND 35),
  transition_duration INTEGER NOT NULL DEFAULT 500
    CHECK (transition_duration BETWEEN 300 AND 1000),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- 3. Inserir configuração padrão (se não existir)
INSERT INTO tv_settings (id, timer_seconds, transition_duration)
VALUES (1, 20, 500)
ON CONFLICT (id) DO NOTHING;

-- 4. REMOVER todas as policies antigas (começar do zero)
DROP POLICY IF EXISTS "Anyone can view TV settings" ON tv_settings;
DROP POLICY IF EXISTS "Only authenticated users can update TV settings" ON tv_settings;
DROP POLICY IF EXISTS "Authenticated users can update TV settings" ON tv_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON tv_settings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON tv_settings;

-- 5. DESABILITAR temporariamente o RLS para garantir acesso
ALTER TABLE tv_settings DISABLE ROW LEVEL SECURITY;

-- 6. REABILITAR RLS
ALTER TABLE tv_settings ENABLE ROW LEVEL SECURITY;

-- 7. CRIAR policies corretas

-- Policy de SELECT (qualquer um pode ler - TV pública)
CREATE POLICY "Enable read access for all users"
  ON tv_settings
  FOR SELECT
  TO public
  USING (true);

-- Policy de UPDATE (apenas autenticados podem alterar)
CREATE POLICY "Enable update for authenticated users only"
  ON tv_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy de INSERT (apenas autenticados, caso precise)
CREATE POLICY "Enable insert for authenticated users only"
  ON tv_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 8. GARANTIR que a role authenticated tem permissões
GRANT SELECT ON tv_settings TO anon;
GRANT SELECT ON tv_settings TO authenticated;
GRANT UPDATE ON tv_settings TO authenticated;
GRANT INSERT ON tv_settings TO authenticated;
GRANT USAGE ON SEQUENCE tv_settings_id_seq TO authenticated;

-- 9. Verificar policies criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'tv_settings';

-- 10. TESTE FINAL: Tentar atualizar
UPDATE tv_settings SET timer_seconds = 20 WHERE id = 1;

-- Se tudo correr bem, deve retornar: "UPDATE 1"
