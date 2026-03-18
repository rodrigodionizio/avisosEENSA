# 🔍 DIAGNÓSTICO COMPLETO - Erro 403 Persistente

**Data**: 18/03/2026  
**Status**: Investigação em andamento  
**Problema**: Erro 403 persiste mesmo com políticas RLS corretas

---

## ✅ POLÍTICAS RLS VERIFICADAS (CORRETAS!)

```json
[
  {
    "policyname": "prod_select_avisos",
    "cmd": "SELECT",
    "roles": "{anon,authenticated}"  ← CORRETO!
  },
  {
    "policyname": "prod_insert_avisos",
    "cmd": "INSERT",
    "roles": "{authenticated}"  ← CORRETO!
  },
  {
    "policyname": "prod_update_avisos",
    "cmd": "UPDATE",
    "roles": "{authenticated}"  ← CORRETO!
  },
  {
    "policyname": "prod_delete_avisos",
    "cmd": "DELETE",
    "roles": "{authenticated}"  ← CORRETO!
  }
]
```

**Conclusão**: As políticas RLS estão PERFEITAS. O problema está em OUTRO LUGAR.

---

## 🚨 ERRO OBSERVADO

```
GET https://bgcpcscbmfmtnpbsexog.supabase.co/rest/v1/avisos?select=*&order=criado_em.desc
Status: 403 (Forbidden)

Error:
{
  code: '42501',
  message: 'permission denied for table avisos'
}
```

**Análises**:
- ✅ URL correta: bgcpcscbmfmtnpbsexog.supabase.co
- ✅ Endpoint correto: /rest/v1/avisos
- ❌ Permissão negada MESMO COM políticas corretas

---

## 🔬 HIPÓTESES E INVESTIGAÇÃO

### Hipótese 1: ANON_KEY com role errado
**Causa possível**: A ANON_KEY pode não estar com role `anon` correto

**Decodificando JWT da ANON_KEY**:
```
Header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
Payload: eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnY3Bjc2NibWZtdG5wYnNleG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzIyNDIsImV4cCI6MjA4OTQwODI0Mn0
```

**Decodificado** (base64):
```json
{
  "iss": "supabase",
  "ref": "bgcpcscbmfmtnpbsexog",
  "role": "anon",  ← ROLE CORRETO!
  "iat": 1773832242,
  "exp": 2089408242
}
```

**✅ CONCLUSÃO**: ANON_KEY tem role `anon` correto. NÃO é este o problema.

---

### Hipótese 2: Tabela com OWNER errado
**Causa possível**: A tabela `avisos` pode ter owner diferente de `postgres`

**SQL para verificar**:
```sql
SELECT 
  schemaname,
  tablename,
  tableowner,
  rowsecurity
FROM pg_tables
WHERE tablename = 'avisos';
```

**Resultado esperado**:
```
schemaname | tablename | tableowner | rowsecurity
-----------+-----------+------------+-------------
public     | avisos    | postgres   | true
```

**⚠️ SE tableowner NÃO for `postgres`**: Este pode ser o problema!

**Solução**:
```sql
ALTER TABLE public.avisos OWNER TO postgres;
```

---

### Hipótese 3: Políticas com schema errado
**Causa possível**: Políticas podem estar em schema diferente

**SQL para verificar**:
```sql
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE tablename = 'avisos';
```

**Resultado esperado**: Todas devem ter `schemaname = 'public'`

---

### Hipótese 4: RLS desabilitado (apesar de indicar true)
**Causa possível**: Cache ou inconsistência

**SQL para RE-habilitar**:
```sql
ALTER TABLE public.avisos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
```

---

### Hipótese 5: Permissões de USAGE no schema
**Causa possível**: Falta permissão no schema `public`

**SQL para verificar + corrigir**:
```sql
-- Dar permissão ao role anon no schema public
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Dar permissão SELECT na tabela avisos
GRANT SELECT ON public.avisos TO anon;
GRANT SELECT ON public.avisos TO authenticated;

-- Dar permissões de escrita para authenticated
GRANT INSERT, UPDATE, DELETE ON public.avisos TO authenticated;
```

**⚠️ ESTA É A CAUSA MAIS PROVÁVEL!**

---

## 🎯 SOLUÇÃO PROPOSTA

Execute este SQL no Supabase SQL Editor:

```sql
-- ====================================================
-- CORREÇÃO: Permissões de Schema + Tabela
-- ====================================================

-- 1. Garantir que a tabela pertence ao postgres
ALTER TABLE public.avisos OWNER TO postgres;

-- 2. Garantir permissões no schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 3. Garantir permissões na tabela
GRANT SELECT ON public.avisos TO anon;
GRANT SELECT ON public.avisos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.avisos TO authenticated;

-- 4. Re-habilitar RLS (força refresh)
ALTER TABLE public.avisos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

-- 5. Verificar configuração final
SELECT 
  t.schemaname,
  t.tablename,
  t.tableowner,
  t.rowsecurity,
  COUNT(p.policyname) as num_policies
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename
WHERE t.tablename = 'avisos'
GROUP BY t.schemaname, t.tablename, t.tableowner, t.rowsecurity;
```

**Resultado esperado**:
```
schemaname | tablename | tableowner | rowsecurity | num_policies
-----------+-----------+------------+-------------+--------------
public     | avisos    | postgres   | true        | 4
```

---

## 🧪 TESTE PÓS-CORREÇÃO

Após executar o SQL acima:

1. **Reiniciar aplicação**:
   ```powershell
   # Parar servidor (Ctrl+C)
   # Limpar cache
   Remove-Item -Recurse -Force .next
   # Reiniciar
   npm run dev
   ```

2. **Abrir console do navegador** (F12)

3. **Acessar**: http://localhost:3000/

4. **Verificar logs**:
   - Deve aparecer: `🔧 Supabase Client Config: ...`
   - Deve aparecer: `📥 getAvisosAtivos() - Iniciando requisição...`
   - Deve aparecer: `✅ getAvisosAtivos() - X avisos carregados`
   - **NÃO** deve aparecer erro 403

5. **Se erro 403 persistir**, ver logs detalhados:
   - Código do erro
   - Mensagem
   - Detalhes
   - Hint

---

## 📋 CHECKLIST DE DIAGNÓSTICO

Execute na ordem:

- [ ] 1. Verificar OWNER da tabela
- [ ] 2. Executar GRANTs de permissão
- [ ] 3. Re-habilitar RLS
- [ ] 4. Verificar configuração final
- [ ] 5. Reiniciar aplicação
- [ ] 6. Testar no navegador
- [ ] 7. Verificar logs no console
- [ ] 8. ✅ Erro 403 desapareceu!

---

## 🔄 PRÓXIMAS AÇÕES

- **Se funcionar**: Documentar solução
- **Se NÃO funcionar**: Executar diagnóstico avançado (Seção seguinte)

---

## 🆘 DIAGNÓSTICO AVANÇADO (se ainda falhar)

```sql
-- Ver TODAS as permissões da tabela avisos
SELECT 
  grantor,
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'avisos'
ORDER BY grantee, privilege_type;

-- Ver configurações de autenticação
SELECT 
  rolname,
  rolsuper,
  rolinherit,
  rolcreaterole,
  rolcreatedb,
  rolcanlogin
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'postgres');

-- Ver privilégios no schema public
SELECT 
  nspname,
  nspowner::regrole,
  nspacl
FROM pg_namespace
WHERE nspname = 'public';
```

---

**Status**: 🔄 Aguardando execução do SQL de correção  
**Probabilidade de sucesso**: 95% (GRANT permissions é a causa mais comum)
