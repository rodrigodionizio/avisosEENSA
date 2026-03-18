# ✅ CHECKLIST DE IMPLEMENTAÇÃO - PRODUÇÃO

## 📋 PRÉ-REQUISITOS

- [ ] Acesso ao painel do Supabase (https://app.supabase.com/)
- [ ] Projeto: `bgcpcscbmfmtnpbsexog`
- [ ] Terminal aberto na pasta do projeto
- [ ] Navegador pronto para testes

---

## 🗄️ PARTE 1: CONFIGURAÇÃO DO BANCO DE DADOS

### Passo 1.1: Acessar SQL Editor

1. [ ] Abrir: https://app.supabase.com/
2. [ ] Selecionar projeto: `bgcpcscbmfmtnpbsexog`
3. [ ] Menu lateral → **SQL Editor**
4. [ ] Clicar em **+ New Query**

### Passo 1.2: Executar Script SQL

1. [ ] Abrir arquivo: `IMPLEMENTACAO_PRODUCAO.sql` neste projeto
2. [ ] Copiar **ETAPA 1** (DROP POLICY...)
3. [ ] Colar no SQL Editor do Supabase
4. [ ] Clicar em **Run** (ou Ctrl+Enter)
5. [ ] Confirmar mensagem: "Success. No rows returned"

### Passo 1.3: Criar Políticas de Produção

1. [ ] Copiar **ETAPA 2** do arquivo SQL (CREATE POLICY...)
2. [ ] Colar no SQL Editor do Supabase
3. [ ] Clicar em **Run**
4. [ ] Confirmar mensagem: "Success. No rows returned"

### Passo 1.4: Verificar Configuração

1. [ ] Copiar **ETAPA 3** do arquivo SQL (SELECT policyname...)
2. [ ] Executar no SQL Editor
3. [ ] Confirmar que aparecem **exatamente 4 linhas**:
   - `prod_delete_avisos` | DELETE | {authenticated}
   - `prod_insert_avisos` | INSERT | {authenticated}
   - `prod_select_avisos` | SELECT | {anon,authenticated}
   - `prod_update_avisos` | UPDATE | {authenticated}

**✅ Se aparecerem 4 políticas corretas, continue para Parte 2**

---

## 👤 PARTE 2: CRIAR USUÁRIO ADMINISTRADOR

### Passo 2.1: Acessar Authentication

1. [ ] No Supabase, menu lateral → **Authentication**
2. [ ] Clicar em **Users**
3. [ ] Clicar em **Add user** (botão verde superior direito)
4. [ ] Selecionar **Create new user**

### Passo 2.2: Criar Usuário

1. [ ] Preencher formulário:
   ```
   Email: admin@eensa.edu.br
   Password: Eensa@2026!  (ou outra senha forte)
   ```
2. [ ] ✅ **IMPORTANTE**: Marcar checkbox **"Auto Confirm User"**
3. [ ] Clicar em **Create user**

### Passo 2.3: Verificar Usuário

1. [ ] Confirmar que o usuário aparece na lista
2. [ ] Status deve ser: **"confirmed"** (verde)
3. [ ] Anotar email e senha usados

**✅ Usuário admin criado com sucesso**

---

## 💻 PARTE 3: TESTAR APLICAÇÃO

### Passo 3.1: Reiniciar Servidor

No terminal PowerShell do projeto:

```powershell
# Parar servidor se estiver rodando (Ctrl+C)

# Limpar cache (recomendado)
Remove-Item -Recurse -Force .next

# Iniciar servidor
npm run dev
```

1. [ ] Servidor iniciou sem erros
2. [ ] Mensagem mostra: `Ready started server on 0.0.0.0:3000, url: http://localhost:3000`

### Passo 3.2: Testar Visualização Pública (SEM LOGIN)

#### Teste 3.2.1: Página Principal

1. [ ] Abrir: http://localhost:3000/
2. [ ] Página carrega sem erros
3. [ ] Avisos são exibidos (ou mensagem "Nenhum aviso ativo")
4. [ ] ❌ **NÃO deve aparecer erro 403 no console**
5. [ ] ❌ **NÃO pede login**

#### Teste 3.2.2: Modo TV

1. [ ] Abrir: http://localhost:3000/tv
2. [ ] Página TV carrega com relógio e avisos
3. [ ] ❌ **NÃO deve aparecer erro 403 no console**
4. [ ] ❌ **NÃO pede login**

**✅ Visualização pública funcionando sem autenticação**

---

### Passo 3.3: Testar Proteção de Rota

1. [ ] Abrir: http://localhost:3000/admin
2. [ ] Deve **redirecionar automaticamente** para: http://localhost:3000/login
3. [ ] Aparece formulário de login
4. [ ] ❌ **NÃO deve mostrar página de admin sem login**

**✅ Proteção de rota funcionando**

---

### Passo 3.4: Testar Login

1. [ ] Na página de login (http://localhost:3000/login)
2. [ ] Preencher:
   - Email: `admin@eensa.edu.br`
   - Senha: (a senha que você criou no Passo 2.2)
3. [ ] Clicar em **Entrar**
4. [ ] Aguardar redirecionamento
5. [ ] Deve ir para: http://localhost:3000/admin
6. [ ] Aparece botão **"Sair"** no header (canto superior direito)
7. [ ] Página de gestão carrega sem erros

**✅ Login funcionando**

---

### Passo 3.5: Testar Gestão de Avisos (AUTENTICADO)

#### Teste 3.5.1: Criar Aviso

1. [ ] Na página /admin, clicar em **"+ Novo Aviso"**
2. [ ] Preencher formulário:
   ```
   Título: Teste de Produção
   Mensagem: Sistema funcionando corretamente
   Prioridade: Normal
   Categoria: Teste
   Expira em: (deixar vazio ou escolher data futura)
   ```
3. [ ] Clicar em **Salvar**
4. [ ] ✅ Aviso criado com sucesso (toast verde)
5. [ ] ❌ **NÃO deve aparecer erro 403**
6. [ ] Aviso aparece na listagem

#### Teste 3.5.2: Editar Aviso

1. [ ] Clicar no ícone ✏️ (Editar) em um aviso
2. [ ] Modificar o título ou mensagem
3. [ ] Clicar em **Salvar**
4. [ ] ✅ Aviso editado com sucesso (toast verde)
5. [ ] ❌ **NÃO deve aparecer erro 403**
6. [ ] Mudanças aparecem na listagem

#### Teste 3.5.3: Deletar Aviso

1. [ ] Clicar no ícone 🗑️ (Deletar) em um aviso
2. [ ] Confirmar exclusão
3. [ ] ✅ Aviso deletado com sucesso (toast verde)
4. [ ] ❌ **NÃO deve aparecer erro 403**
5. [ ] Aviso removido da listagem

**✅ CRUD completo funcionando sem erros 403**

---

### Passo 3.6: Testar Logout

1. [ ] Clicar no botão **"Sair"** no header
2. [ ] Deve fazer logout
3. [ ] Tentar acessar http://localhost:3000/admin novamente
4. [ ] Deve redirecionar para /login
5. [ ] ❌ **NÃO deve permitir acesso ao admin**

**✅ Logout funcionando**

---

### Passo 3.7: Validar Visualização Pública APÓS Criar Avisos

1. [ ] Fazer logout (se não fez no passo anterior)
2. [ ] Abrir: http://localhost:3000/
3. [ ] Avisos criados devem aparecer
4. [ ] Abrir: http://localhost:3000/tv
5. [ ] Avisos devem aparecer em modo TV
6. [ ] Tudo funciona **sem precisar de login**

**✅ Visualização pública funciona independente de autenticação**

---

## 🎯 VALIDAÇÃO FINAL

Se TODOS os testes acima passaram, marque aqui:

- [ ] ✅ Visualização pública funciona (/, /tv)
- [ ] ✅ Admin redireciona para login quando não autenticado
- [ ] ✅ Login funciona e redireciona para /admin
- [ ] ✅ Criar avisos funciona (sem erro 403)
- [ ] ✅ Editar avisos funciona (sem erro 403)
- [ ] ✅ Deletar avisos funciona (sem erro 403)
- [ ] ✅ Logout funciona
- [ ] ✅ Nenhum erro 403 aparece no console

---

## 🚀 SISTEMA PRONTO PARA PRODUÇÃO!

Seu sistema está configurado corretamente:

### Usuários Públicos (TV/App):
- ✅ Podem ver avisos em / e /tv
- ❌ NÃO podem acessar /admin
- ❌ NÃO podem criar/editar/deletar

### Administradores:
- ✅ Fazem login em /login
- ✅ Acessam gestão em /admin
- ✅ Criam/editam/deletam avisos
- ✅ Fazem logout quando necessário

---

## 🖥️ PRÓXIMOS PASSOS

### Configurar TV na Sala dos Professores

1. Abrir navegador em modo fullscreen/kiosk
2. Acessar: http://localhost:3000/tv (ou URL de produção)
3. Avisos atualizarão em tempo real automaticamente

### Deploy para Produção (Vercel/Netlify)

1. Mesma configuração RLS já funciona
2. Atualizar variáveis de ambiente no serviço de deploy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Adicionar Mais Administradores

1. Repetir **PARTE 2** para cada novo admin
2. Cada admin terá seu próprio email/senha

---

## 🆘 TROUBLESHOOTING

### Se ainda aparecer erro 403:

1. [ ] Verificar no SQL Editor que existem exatamente 4 políticas (ETAPA 3)
2. [ ] Verificar que políticas têm prefixo `prod_` (não `public_` ou `authenticated_`)
3. [ ] Executar ETAPA 4 do arquivo SQL (diagnóstico)
4. [ ] Limpar cache do navegador (Ctrl+Shift+Delete)
5. [ ] Reiniciar servidor (Ctrl+C e `npm run dev`)

### Se login não funcionar:

1. [ ] Verificar que usuário está "confirmed" no Supabase
2. [ ] Confirmar email/senha corretos
3. [ ] Verificar credenciais no .env.local estão corretas

---

**Data de implementação**: __/__/____  
**Implementado por**: ________________  
**Status**: ⬜ Em andamento | ⬜ Concluído com sucesso
