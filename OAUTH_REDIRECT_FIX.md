# 🔧 Correção: Redirect OAuth para localhost

## ❌ Problema
Após login com Google, o sistema redireciona para `http://localhost:3000/auth/callback` ao invés de `https://avisos-eensa.vercel.app/auth/callback`.

---

## ✅ Solução Completa (2 configurações)

### **1️⃣ Configurar Variável no Vercel**

1. Acesse: [Vercel Dashboard → Environment Variables](https://vercel.com/rodrigodionizio/avisos-eensa/settings/environment-variables)

2. Clique em **"Add New"**

3. Preencha:
   - **Name:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** `https://avisos-eensa.vercel.app`
   - **Environments:** Marque **APENAS**:
     - ✅ Production
     - ✅ Preview
     - ❌ **NÃO** marque Development

4. Clique em **Save**

---

### **2️⃣ Configurar URLs no Supabase Dashboard**

1. Acesse: [Supabase Dashboard → Authentication → URL Configuration](https://supabase.com/dashboard/project/_/auth/url-configuration)

2. Na seção **"Redirect URLs"**, adicione:
   ```
   https://avisos-eensa.vercel.app/auth/callback
   https://avisos-eensa.vercel.app/*
   http://localhost:3000/auth/callback
   ```
   
   ⚠️ **Importante:** Adicione uma URL por vez, clicando no botão **"Add URL"** entre cada uma

3. Na seção **"Site URL"**, configure:
   ```
   https://avisos-eensa.vercel.app
   ```

4. Clique em **Save** no final da página

---

### **3️⃣ Fazer Redeploy no Vercel**

1. Acesse: [Vercel → Deployments](https://vercel.com/rodrigodionizio/avisos-eensa/deployments)

2. No último deployment, clique nos **3 pontinhos (⋮)**

3. Selecione **"Redeploy"**

4. Confirme clicando em **"Redeploy"** novamente

5. Aguarde o build terminar (~2 minutos)

---

## 🧪 Testar

1. Acesse: `https://avisos-eensa.vercel.app`

2. Clique no botão **"Professores"**

3. Faça login com sua conta Google

4. **✅ Deve redirecionar para:** `https://avisos-eensa.vercel.app/auth/callback`

5. **❌ NÃO deve redirecionar para:** `http://localhost:3000/auth/callback`

---

## 🐛 Se ainda não funcionar

### Limpar cache do navegador:
1. Pressione `Ctrl + Shift + Delete`
2. Marque "Cookies e outros dados do site"
3. Marque "Imagens e arquivos em cache"
4. Clique em "Limpar dados"

### Testar em aba anônima:
1. Pressione `Ctrl + Shift + N` (Chrome) ou `Ctrl + Shift + P` (Firefox)
2. Acesse o site e teste novamente

### Verificar configuração:
1. Confirme que `NEXT_PUBLIC_BASE_URL` está em **Production** no Vercel
2. Confirme que a URL `https://avisos-eensa.vercel.app/auth/callback` está nas **Redirect URLs** do Supabase
3. Se mudou algo, aguarde ~5 minutos para propagar

---

## 📝 Código Alterado

O código no [LeitorContext.tsx](contexts/LeitorContext.tsx#L165-L167) foi atualizado para:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                (typeof window !== 'undefined' ? window.location.origin : '');

await sb.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${baseUrl}/auth/callback`,
    // ...
  },
});
```

Isso faz o código **priorizar a variável Vercel** em produção.
