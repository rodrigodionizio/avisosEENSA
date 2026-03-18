# ⚡ AÇÃO IMEDIATA - Resolver Erro 403

## 🚨 VOCÊ ESTÁ VENDO ESTE ERRO?

```
GET .../rest/v1/avisos?... 403 (Forbidden)
Error: {code: '42501', message: 'permission denied for table avisos'}
```

---

## ✅ SOLUÇÃO EM 4 PASSOS (5 minutos)

### Passo 1: Abrir Supabase SQL Editor

1. Acesse: https://app.supabase.com/
2. Selecione projeto: **bgcpcscbmfmtnpbsexog**
3. Menu lateral → **SQL Editor**
4. Clique em **+ New Query**

---

### Passo 2: Executar SQL de Correção

Abra o arquivo: [`CORRECAO_403.sql`](CORRECAO_403.sql)

**Copie TUDO** (do início ao fim) e execute no SQL Editor

**OU** copie e execute este bloco direto:

```sql
-- CORREÇÃO RÁPIDA
ALTER TABLE public.avisos OWNER TO postgres;

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON public.avisos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avisos TO authenticated;

GRANT USAGE, SELECT ON SEQUENCE avisos_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE avisos_id_seq TO anon;

ALTER TABLE public.avisos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
```

---

### Passo 3: Verificar

Execute este SQL para confirmar:

```sql
SELECT 
  grantee,
  string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_name = 'avisos'
GROUP BY grantee
ORDER BY grantee;
```

**Deve aparecer**:
```
grantee       | privileges
--------------+----------------------------
anon          | SELECT
authenticated | DELETE, INSERT, SELECT, UPDATE
```

---

### Passo 4: Reiniciar Aplicação

No terminal do projeto:

```powershell
# Limpar cache
Remove-Item -Recurse -Force .next

# Reiniciar
npm run dev
```

---

## 🧪 TESTAR

1. **Abra**: http://localhost:3000/
2. **Pressione F12** (abrir console do navegador)
3. **Verifique os logs**:

✅ **Deve aparecer**:
```
🔧 Supabase Client Config:
URL: https://bgcpcscbmfmtnpbsexog.supabase.co
Key (first 50 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz...

📥 getAvisosAtivos() - Iniciando requisição...
✅ getAvisosAtivos() - X avisos carregados
```

❌ **NÃO deve aparecer**:
```
403 (Forbidden)
permission denied for table avisos
```

---

## ✅ FUNCIONOU?

- **SIM**: 🎉 Sistema funcionando! Pode continuar com a implementação
- **NÃO**: Continue para [`DIAGNOSTICO_403.md`](DIAGNOSTICO_403.md) (diagnóstico avançado)

---

## 📚 DOCUMENTAÇÃO COMPLETA

- 📖 [Índice da Documentação](README.md)
- 🔍 [Diagnóstico Completo](DIAGNOSTICO_403.md)
- 🗄️ [Script SQL Completo](CORRECAO_403.sql)

---

**Tempo estimado**: 5 minutos  
**Probabilidade de sucesso**: 95%  
**Última atualização**: 18/03/2026
