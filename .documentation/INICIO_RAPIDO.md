# 🚀 GUIA DE INÍCIO RÁPIDO

Siga este guia para colocar o sistema de avisos EENSA em produção.

---

## ✅ PASSO A PASSO

### 1️⃣ Configurar Banco de Dados (10 minutos)

1. Acesse: https://app.supabase.com/
2. Abra seu projeto: `bgcpcscbmfmtnpbsexog`
3. Menu lateral → **SQL Editor**
4. Abra o arquivo [`IMPLEMENTACAO_PRODUCAO.sql`](IMPLEMENTACAO_PRODUCAO.sql) neste projeto
5. Copie e execute as **ETAPAS 1 e 2** no SQL Editor
6. Execute a **ETAPA 3** para verificar (deve retornar 4 políticas)

**✅ Pronto! Banco configurado com segurança RLS**

---

### 2️⃣ Criar Usuário Admin (2 minutos)

1. No Supabase: **Authentication** → **Users**
2. **Add user** → **Create new user**
3. Preencher:
   - Email: `admin@eensa.edu.br`
   - Password: `Eensa@2026!` (ou senha forte)
4. ✅ Marcar **"Auto Confirm User"**
5. **Create user**

**✅ Pronto! Admin criado**

---

### 3️⃣ Iniciar Aplicação (1 minuto)

No terminal do projeto:

```powershell
# Limpar cache
Remove-Item -Recurse -Force .next

# Iniciar
npm run dev
```

**✅ Pronto! Servidor rodando em http://localhost:3000**

---

### 4️⃣ Testar Sistema (5 minutos)

#### Teste 1: Visualização Pública (sem login)
- [ ] Abrir: http://localhost:3000/
- [ ] Avisos carregam sem pedir login ✅
- [ ] Abrir: http://localhost:3000/tv
- [ ] Modo TV funciona sem login ✅

#### Teste 2: Autenticação
- [ ] Abrir: http://localhost:3000/admin
- [ ] Redireciona para /login ✅
- [ ] Fazer login com `admin@eensa.edu.br`
- [ ] Redireciona para /admin ✅

#### Teste 3: Gestão de Avisos
- [ ] Criar novo aviso → Funciona sem erro 403 ✅
- [ ] Editar aviso → Funciona sem erro 403 ✅
- [ ] Deletar aviso → Funciona sem erro 403 ✅

#### Teste 4: Logout
- [ ] Clicar em "Sair"
- [ ] Tenta acessar /admin → Redireciona para /login ✅

---

## 🎯 TUDO FUNCIONOU?

Se todos os testes acima passaram:

### ✅ **SISTEMA PRONTO PARA USO EM PRODUÇÃO!**

---

## 📺 Configurar TV na Sala dos Professores

1. Abrir navegador em modo fullscreen/kiosk
2. Acessar: http://localhost:3000/tv
3. Avisos atualizarão automaticamente em tempo real

---

## 📚 Documentação Completa

- 📋 [Checklist Detalhado](CHECKLIST.md) - Validação passo a passo
- 🗄️ [Script SQL](IMPLEMENTACAO_PRODUCAO.sql) - Comandos para copiar/colar
- 🔒 [Guia de Segurança](SEGURANCA.md) - Entenda o sistema RLS
- 📖 [README Completo](README.md) - Documentação técnica

---

## 🆘 Problemas?

### Erro 403 ainda aparece?

1. Verificar no SQL Editor:
   ```sql
   SELECT policyname, cmd, roles::text[]
   FROM pg_policies
   WHERE tablename = 'avisos';
   ```
   Deve retornar exatamente 4 políticas com prefixo `prod_`

2. Limpar cache e reiniciar:
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

### Login não funciona?

1. Verificar que usuário está "confirmed" no Supabase
2. Confirmar email/senha corretos
3. Verificar .env.local está configurado

---

**Tempo total de implementação**: ~20 minutos  
**Dificuldade**: ⭐⭐ Básica
