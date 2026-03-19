# Configurações do Modo TV - Implementação Banco de Dados

## ✅ Implementação Concluída

Sistema de configurações dinâmicas do Modo TV implementado com **sincronização em tempo real** entre admin e TVs.

---

## 🎯 Funcionalidades

### Admin Panel (`/admin`)
- **Botão "⚙️ Modo TV"** no header do painel
- **Modal de configuração** com sliders interativos
- **Preview** de valores antes de salvar
- **Validação** de ranges automática
- **Toast** de confirmação ao salvar

### Configurações Disponíveis
1. **Timer do Slider** (15-35 segundos)
   - Define quanto tempo cada aviso permanece na tela
   - Padrão: 20 segundos

2. **Velocidade da Transição** (300-1000ms)
   - Define a velocidade da animação entre avisos
   - Padrão: 500ms

### Modo TV (`/tv`)
- **Atualização automática** via real-time quando admin altera configurações
- **Fallback** para valores padrão se banco indisponível
- **Sem reload necessário** - sincroniza automaticamente

---

## 📦 Arquivos Criados/Modificados

### Criados
- `.supabase/CREATE_TV_SETTINGS.sql` - Script de criação da tabela
- `lib/supabase/settings-queries.ts` - Queries CRUD e real-time
- `hooks/useSettings.ts` - Hook com carregamento e sincronização
- `components/admin/TVSettingsForm.tsx` - Modal de configuração

### Modificados
- `types/index.ts` - Adicionado interface `TVSettings`
- `app/admin/page.tsx` - Integrado botão e modal de settings
- `components/tv/TVSlider.tsx` - Usa `useSettings()` ao invés de constante
- `components/ui/Icons.tsx` - Adicionado ícone `Settings`

---

## 🚀 Setup no Supabase

### 1. Executar Script SQL

Abra o **SQL Editor** no Supabase Dashboard e execute:

```bash
# Localize o arquivo:
.supabase/CREATE_TV_SETTINGS.sql

# Ou copie e cole o conteúdo diretamente
```

O script irá:
- ✅ Criar tabela `tv_settings` com validações
- ✅ Inserir configuração padrão (20s, 500ms)
- ✅ Configurar RLS (SELECT público, UPDATE autenticado)
- ✅ Adicionar comentários de documentação

### 2. Verificar Criação

Execute no SQL Editor:

```sql
SELECT * FROM tv_settings;
```

Deve retornar:
```
id | timer_seconds | transition_duration | updated_at | updated_by
---|---------------|---------------------|------------|------------
1  | 20            | 500                 | [timestamp]| null
```

---

## 🧪 Testes

### Test 1: Abrir Modal de Configurações
1. Acesse `/admin`
2. Clique no botão **"⚙️ Modo TV"**
3. ✅ Modal deve abrir com valores atuais (20s, 500ms)

### Test 2: Alterar Timer
1. No modal, mova slider para **25 segundos**
2. Clique em **"✓ Salvar Configurações"**
3. ✅ Toast de sucesso deve aparecer
4. ✅ Modal deve fechar

### Test 3: Sincronização Real-Time
1. **Abra `/tv` em outra aba/janela** (simula TV física)
2. **No admin**, altere timer para **15 segundos**
3. Salve
4. ✅ TV deve **atualizar automaticamente** (sem reload) em ~3 segundos

### Test 4: Validação de Ranges
1. No modal, tente inserir **50 segundos** (acima do máximo)
2. ✅ Deve mostrar erro: "Timer deve estar entre 15 e 35 segundos"
3. Botão salvar deve permanecer desabilitado

### Test 5: Restaurar Padrão
1. Altere valores para 30s e 800ms
2. Clique em **"🔄 Restaurar Padrão"**
3. ✅ Valores devem voltar para 20s e 500ms

### Test 6: Fallback (Banco Indisponível)
1. Com modo TV aberto, **temporariamente delete a linha** do banco:
   ```sql
   DELETE FROM tv_settings WHERE id = 1;
   ```
2. Recarregue `/tv`
3. ✅ Deve usar valores padrão (20s, 500ms) do código
4. **Restaure a linha**:
   ```sql
   INSERT INTO tv_settings (id, timer_seconds, transition_duration) VALUES (1, 20, 500);
   ```

---

## 📊 Estrutura da Tabela

```sql
CREATE TABLE tv_settings (
  id SERIAL PRIMARY KEY,
  timer_seconds INTEGER NOT NULL DEFAULT 20
    CHECK (timer_seconds BETWEEN 15 AND 35),
  transition_duration INTEGER NOT NULL DEFAULT 500
    CHECK (transition_duration BETWEEN 300 AND 1000),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);
```

### Row Level Security (RLS)

**SELECT (Público)**:
```sql
-- Qualquer um pode ler (TV pública sem autenticação)
CREATE POLICY "Anyone can view TV settings"
  ON tv_settings FOR SELECT USING (true);
```

**UPDATE (Apenas Autenticados)**:
```sql
-- Apenas usuários logados podem alterar
CREATE POLICY "Only authenticated users can update TV settings"
  ON tv_settings FOR UPDATE
  USING (auth.role() = 'authenticated');
```

---

## 🔧 Como Usar no Código

### Admin - Carregar Settings
```tsx
import { useSettings } from '@/hooks/useSettings';

function AdminPage() {
  const { settings, loading } = useSettings();
  
  // settings.timer_seconds
  // settings.transition_duration
}
```

### TV - Usar Timer Dinâmico
```tsx
import { useSettings } from '@/hooks/useSettings';

function TVSlider() {
  const { timerMs } = useSettings(); // Helper: seconds → ms
  
  useEffect(() => {
    const interval = setInterval(() => {
      // avançar slide
    }, timerMs); // 🎯 Usa valor do banco
    
    return () => clearInterval(interval);
  }, [timerMs]); // reage a mudanças
}
```

### Atualizar Settings (Admin)
```tsx
import { updateTVSettings } from '@/lib/supabase/settings-queries';

async function handleSave() {
  await updateTVSettings(
    25,    // timer_seconds
    700,   // transition_duration
    user.email // updated_by
  );
  // TV auto-atualiza via real-time 🎉
}
```

---

## 🎨 UI do Modal

**Elementos:**
- Range sliders com valores visuais (15s → 35s)
- Inputs numéricos sincronizados com sliders
- Preview de configuração (tempo + transição)
- Botões: "Restaurar Padrão", "Cancelar", "Salvar"
- Validação em tempo real
- Mensagens de erro inline

**Cores EENSA:**
- Accent slider: `accent-eensa-teal`
- Botão salvar: cor primária
- Erros: vermelho (#DC2626)

---

## 🔮 Futuras Expansões

**Facilmente Expansível:**
```sql
ALTER TABLE tv_settings ADD COLUMN font_preset TEXT DEFAULT 'medium';
ALTER TABLE tv_settings ADD COLUMN show_counter BOOLEAN DEFAULT true;
ALTER TABLE tv_settings ADD COLUMN show_dots BOOLEAN DEFAULT true;
```

**No código:**
- Adicionar campo no `TVSettings` type
- Adicionar input no `TVSettingsForm`
- Usar no `TVSlider`
- Hook `useSettings()` já pegará automaticamente

---

## ⚙️ Troubleshooting

### ❌ Modal não abre
- Verificar se usuário está autenticado
- Checar console do browser para erros

### ❌ Settings não salvam
- Verificar RLS policy no Supabase
- Checar se usuário tem role `authenticated`
- Ver logs do console (queries logadas)

### ❌ TV não atualiza automaticamente
- Testar se real-time está habilitado no Supabase (Replication)
- Ver console do browser `/tv` - deve mostrar "🔔 Inscrevendo-se..."
- Verificar se tabela `tv_settings` tem replication habilitada

### ❌ Build falha
- Executar `npm run build` e verificar erros TypeScript
- Confirmar que todos imports estão corretos

---

## 📝 Changelog

**v1.0 - Implementação Inicial**
- ✅ Tabela `tv_settings` com RLS
- ✅ Hook `useSettings()` com real-time
- ✅ Modal de configuração no admin
- ✅ Sincronização automática TV ↔ Admin
- ✅ Validação de ranges
- ✅ Fallback para valores padrão
- ✅ Build: SUCCESS
