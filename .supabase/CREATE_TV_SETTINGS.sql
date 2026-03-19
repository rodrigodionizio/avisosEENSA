-- Tabela de configurações do Modo TV
-- Armazena parâmetros dinâmicos do slider (timer, transições, etc.)

CREATE TABLE IF NOT EXISTS tv_settings (
  id SERIAL PRIMARY KEY,
  timer_seconds INTEGER NOT NULL DEFAULT 20
    CHECK (timer_seconds BETWEEN 15 AND 35),
  transition_duration INTEGER NOT NULL DEFAULT 500
    CHECK (transition_duration BETWEEN 300 AND 1000),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Inserir configuração padrão (valores atuais do tv-config.ts)
INSERT INTO tv_settings (id, timer_seconds, transition_duration)
VALUES (1, 20, 500)
ON CONFLICT (id) DO NOTHING;

-- Habilitar Row Level Security
ALTER TABLE tv_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer um pode ler (TV pública)
CREATE POLICY "Enable read access for all users"
  ON tv_settings
  FOR SELECT
  TO public
  USING (true);

-- Policy: Apenas autenticados podem atualizar
CREATE POLICY "Enable update for authenticated users only"
  ON tv_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Apenas autenticados podem inserir (caso necessário)
CREATE POLICY "Enable insert for authenticated users only"
  ON tv_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Garantir permissões para as roles
GRANT SELECT ON tv_settings TO anon;
GRANT SELECT ON tv_settings TO authenticated;
GRANT UPDATE ON tv_settings TO authenticated;
GRANT INSERT ON tv_settings TO authenticated;
GRANT USAGE ON SEQUENCE tv_settings_id_seq TO authenticated;

-- Comentários para documentação
COMMENT ON TABLE tv_settings IS 'Configurações dinâmicas do Modo TV (timer, transições, fontes)';
COMMENT ON COLUMN tv_settings.timer_seconds IS 'Intervalo de troca automática do slider (15-35 segundos)';
COMMENT ON COLUMN tv_settings.transition_duration IS 'Duração da transição entre slides (300-1000ms)';
COMMENT ON COLUMN tv_settings.updated_at IS 'Timestamp da última alteração';
COMMENT ON COLUMN tv_settings.updated_by IS 'Email do usuário que fez a última alteração';
