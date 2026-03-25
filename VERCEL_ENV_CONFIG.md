# Configuração de Variáveis de Ambiente no Vercel

## 📋 Variáveis Necessárias

Acesse o dashboard do Vercel: `https://vercel.com/seu-usuario/avisos-eensa/settings/environment-variables`

Configure as seguintes variáveis:

### 1. Supabase (Obrigatório)

```
NEXT_PUBLIC_SUPABASE_URL=https://seu_projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

**Como obter:**
- Dashboard Supabase → Settings → API
- URL: Project URL
- ANON KEY: Project API keys → anon public

### 2. Google OAuth (Obrigatório para Login de Professores)

```
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=<client-secret>
```

**Como obter:**
- Dashboard Supabase → Authentication → Providers → Google
- Copiar o Client Secret configurado

### 3. Push Notifications (Opcional)

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=sua_vapid_public_key
VAPID_PRIVATE_KEY=sua_vapid_private_key
VAPID_SUBJECT=mailto:seu_email@eensa.com.br
```

**Como gerar:**
```bash
npx web-push generate-vapid-keys
```

### 4. Base URL (Recomendado)

```
NEXT_PUBLIC_BASE_URL=https://avisos-eensa.vercel.app
```

## 🚀 Como Configurar no Vercel

1. Acesse: `https://vercel.com/seu-usuario/avisos-eensa/settings/environment-variables`

2. Para cada variável:
   - Clique em **Add New**
   - Nome: Copie o nome exato da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - Value: Cole o valor correspondente
   - Environments: Selecione **Production**, **Preview**, e **Development**
   - Clique em **Save**

3. Após adicionar todas as variáveis:
   - Vá para **Deployments**
   - Clique nos 3 pontinhos do último deploy
   - Selecione **Redeploy**

## ✅ Variáveis por Ambiente

| Variável | Production | Preview | Development |
|----------|------------|---------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | ✅ | ✅ | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | ✅ | ✅ |
| SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET | ✅ | ✅ | ⚠️ Opcional |
| NEXT_PUBLIC_VAPID_PUBLIC_KEY | ✅ | ⚠️ Opcional | ⚠️ Opcional |
| VAPID_PRIVATE_KEY | ✅ | ⚠️ Opcional | ❌ Nunca |
| VAPID_SUBJECT | ✅ | ⚠️ Opcional | ⚠️ Opcional |
| NEXT_PUBLIC_BASE_URL | ✅ | ⚠️ Opcional | ❌ Nunca |

**Legenda:**
- ✅ Obrigatório
- ⚠️ Opcional (feature pode não funcionar)
- ❌ Não configurar (usa local)

## 🔍 Verificar Configuração

Após deploy com variáveis configuradas, teste:

1. **Supabase**: Acesse `https://avisos-eensa.vercel.app` - deve listar avisos
2. **Google OAuth**: Clique em "Professores" - deve redirecionar para Google
3. **Push**: Dashboard admin → Enviar notificação (se configurado)

## 🐛 Troubleshooting

### "Failed to compile" no Vercel

**Causa:** Variáveis NEXT_PUBLIC não encontradas

**Solução:**
1. Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configuradas
2. Confirme que "Production" está selecionado
3. Redeploy após adicionar variáveis

### Google OAuth não funciona

**Causa:** `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` não configurada

**Solução:**
1. Adicione a variável no Vercel
2. Verifique se o Client Secret está correto no Supabase
3. Confirme que a URL de callback está autorizada: `https://seu_projeto.supabase.co/auth/v1/callback`

### Push notifications não funcionam

**Causa:** VAPID keys não configuradas

**Solução:**
1. Gere as chaves: `npx web-push generate-vapid-keys`
2. Configure as 3 variáveis VAPID no Vercel
3. Redeploy

## 📝 Notas de Segurança

- **NUNCA** commite arquivos `.env.local` ou `.env` no Git
- Use apenas `.env.example` como template (sem valores reais)
- Variáveis com `NEXT_PUBLIC_` são expostas no cliente (navegador)
- Variáveis sem prefixo são apenas server-side (seguras)
- Rotacione chaves periodicamente (especialmente VAPID_PRIVATE_KEY)
