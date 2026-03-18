# EENSA — Quadro de Avisos
## Guia de Configuração: Supabase + GitHub Pages

---

## 1. Supabase — Criar o banco

Acesse https://supabase.com → New Project → Copie a URL e a anon key.

### SQL para criar a tabela (cole no SQL Editor do Supabase):

```sql
-- Tabela principal de avisos
CREATE TABLE avisos (
  id          BIGSERIAL PRIMARY KEY,
  titulo      TEXT NOT NULL,
  corpo       TEXT NOT NULL,
  prioridade  TEXT NOT NULL DEFAULT 'normal'
                CHECK (prioridade IN ('urgente','normal','info')),
  categoria   TEXT DEFAULT 'Geral',
  autor       TEXT NOT NULL,
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  expira_em   TIMESTAMPTZ,
  ativo       BOOLEAN DEFAULT TRUE
);

-- Índice para consultas rápidas de avisos ativos
CREATE INDEX idx_avisos_ativos ON avisos(ativo, expira_em);

-- RLS: leitura pública (qualquer um pode VER os avisos)
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública"
  ON avisos FOR SELECT
  USING (true);

CREATE POLICY "Escrita autenticada"
  ON avisos FOR ALL
  USING (auth.role() = 'authenticated');

-- Inserir avisos de exemplo
INSERT INTO avisos (titulo, corpo, prioridade, categoria, autor, expira_em) VALUES
('Reunião de Pais — URGENTE',
 'Reunião obrigatória com os pais dos alunos do 9º ano na sexta-feira às 18h no auditório.',
 'urgente', 'Reunião', 'Direção',
 NOW() + INTERVAL '3 days'),

('Calendário de Avaliações — 1º Trimestre',
 'As avaliações do 1º trimestre ocorrerão entre os dias 25 e 29 de março.',
 'urgente', 'Avaliações', 'Coordenação Pedagógica',
 NOW() + INTERVAL '7 days'),

('Biblioteca: Semana da Leitura',
 'A Semana da Leitura acontece de 24 a 28 de março. Traga seu livro favorito!',
 'normal', 'Cultura', 'Professora Ana',
 NOW() + INTERVAL '15 days');
```

---

## 2. Autenticação — Criar usuário admin

No Supabase → Authentication → Users → Add User:
- E-mail: admin@eensa.edu.br
- Senha: (escolha uma senha forte)

---

## 3. Conectar o Supabase ao index.html

No arquivo `index.html`, localize o comentário de configuração e substitua:

```html
<!-- Descomente esta linha: -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

```javascript
// Substitua estas constantes:
const SUPABASE_URL  = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON = 'SUA_ANON_KEY_AQUI';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
```

### Funções prontas para substituir os mocks:

```javascript
// Buscar avisos ativos
async function carregarAvisos() {
  const { data, error } = await supabase
    .from('avisos')
    .select('*')
    .eq('ativo', true)
    .gte('expira_em', new Date().toISOString())
    .order('prioridade', { ascending: true })  // urgente vem primeiro
    .order('criado_em', { ascending: false });
  return data || [];
}

// Criar aviso
async function criarAviso(form) {
  const { data, error } = await supabase
    .from('avisos').insert([form]).select().single();
  return data;
}

// Editar aviso
async function editarAviso(id, form) {
  const { data } = await supabase
    .from('avisos').update(form).eq('id', id).select().single();
  return data;
}

// Deletar aviso
async function deletarAviso(id) {
  await supabase.from('avisos').delete().eq('id', id);
}

// Login
async function login(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  return { ok: !error, error };
}

// Logout
async function logout() {
  await supabase.auth.signOut();
}

// Real-time: atualiza automaticamente na TV
supabase
  .channel('avisos-rt')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'avisos' }, () => {
    carregarAvisos().then(setAvisos);
  })
  .subscribe();
```

---

## 4. GitHub Pages — Deploy

```bash
# 1. Criar repositório no GitHub (pode ser privado ou público)
git init
git add index.html logo_eensa.png
git commit -m "feat: quadro de avisos EENSA v1"
git remote add origin https://github.com/SUA_ORG/eensa-avisos.git
git push -u origin main

# 2. No GitHub:
#    Settings → Pages → Source: Deploy from branch → main → / (root)
#    Aguardar ~2 min → URL: https://sua_org.github.io/eensa-avisos/
```

**A URL pública da escola será algo como:**
`https://eensa-escola.github.io/avisos/`

---

## 5. Modo TV / Painel de Corredor

Para usar em TVs ou monitores no corredor da escola:
1. Abra a URL do GitHub Pages no navegador da TV
2. Clique no botão **📺 Modo TV** — exibe relógio, data e fonte maior
3. Pressione F11 para fullscreen
4. Os avisos atualizam automaticamente via real-time

---

## Estrutura de arquivos

```
eensa-avisos/
├── index.html        ← aplicação completa
└── logo_eensa.png    ← logo da escola
```

## Custos

| Serviço       | Plano    | Custo      | Limite gratuito              |
|---------------|----------|------------|------------------------------|
| GitHub Pages  | Free     | R$ 0       | Ilimitado (projetos públicos)|
| Supabase      | Free     | R$ 0       | 500MB banco, 50k req/mês     |
| **Total**     |          | **R$ 0**   | Suficiente para escola       |
