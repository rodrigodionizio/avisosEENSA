-- .supabase/CREATE_PUSH_SUBSCRIPTIONS.sql
-- Tabela para armazenar subscriptions de push notifications

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          BIGSERIAL PRIMARY KEY,
  endpoint    TEXT        NOT NULL UNIQUE,
  p256dh      TEXT        NOT NULL,
  auth        TEXT        NOT NULL,
  user_agent  TEXT,
  total_recebidas INT     DEFAULT 0,
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  ativo       BOOLEAN     DEFAULT TRUE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_ativo 
  ON push_subscriptions(ativo) WHERE ativo = TRUE;

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_criado_em 
  ON push_subscriptions(criado_em DESC);

-- Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas:
-- 1. Qualquer pessoa pode se inscrever (INSERT)
CREATE POLICY "push_insert_public"
  ON push_subscriptions FOR INSERT 
  TO public
  WITH CHECK (true);

-- 2. Usuários autenticados (admin) podem ver todas subscriptions
CREATE POLICY "push_select_authenticated"
  ON push_subscriptions FOR SELECT 
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 3. Qualquer pessoa pode deletar sua própria subscription (sem identificação de usuário)
CREATE POLICY "push_delete_public"
  ON push_subscriptions FOR DELETE 
  TO public
  USING (true);

-- 4. Apenas autenticados podem atualizar (para incrementar contador)
CREATE POLICY "push_update_authenticated"
  ON push_subscriptions FOR UPDATE 
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Grants
GRANT INSERT, DELETE ON push_subscriptions TO anon;
GRANT ALL ON push_subscriptions TO authenticated;
GRANT USAGE, SELECT ON push_subscriptions_id_seq TO anon, authenticated;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_push_subscriptions_updated_at 
  BEFORE UPDATE ON push_subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE push_subscriptions IS 'Armazena subscriptions para push notifications web';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'Endpoint único fornecido pelo browser';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Chave pública p256dh para criptografia';
COMMENT ON COLUMN push_subscriptions.auth IS 'Chave de autenticação';
COMMENT ON COLUMN push_subscriptions.total_recebidas IS 'Contador de notificações enviadas com sucesso';
