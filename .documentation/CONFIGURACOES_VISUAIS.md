# 📐 Guia de Configurações Visuais - Sistema EENSA

## 🎨 Onde configurar tamanhos e estilos

### 1️⃣ **Modo TV** (`/tv`)

#### 📍 Arquivo: `components/tv/TVSlider.tsx`

**Card do Aviso (linhas 109-116):**
```tsx
<div 
  className="relative ... p-8 ..."
  style={{ 
    minHeight: '360px',  // 🔧 Altura mínima do card
    maxHeight: '480px'   // 🔧 Altura máxima do card
  }}
>
```

**Largura máxima do card (linha 108):**
```tsx
<div className="flex-1 ... max-w-[1100px] ...">
  {/* 🔧 Ajuste max-w-[1100px] para mudar largura */}
</div>
```

**Tamanhos de texto:**
- Título: `text-4xl` (linha 133) → Opções: text-3xl, text-5xl, text-6xl
- Corpo: `text-2xl` (linha 139) → Opções: text-xl, text-3xl
- Badges: `text-base` (linha 123) → Opções: text-sm, text-lg
- Meta: `text-lg` (linha 145) → Opções: text-base, text-xl

**Espaçamentos (padding):**
- Card principal: `p-8` (linha 111) → Opções: p-6, p-10, p-12
- Badges: `px-4 py-1.5` (linha 123)
- Margens laterais: `ml-3` (linhas 122, 133, 139, 145)

---

### 2️⃣ **Página Principal** (`/`)

#### 📍 Arquivo: `components/avisos/AvisoCard.tsx`

**Card do Aviso:**
```tsx
<div className="bg-eensa-surface rounded-md p-5 ...">
  {/* 🔧 Ajuste p-5 para mudar padding interno */}
</div>
```

**Título:**
```tsx
<h3 className="font-display font-extrabold text-[17px] ...">
  {/* 🔧 Ajuste text-[17px] */}
</h3>
```

**Corpo:**
```tsx
<p className="text-[15px] ...">
  {/* 🔧 Ajuste text-[15px] */}
</p>
```

---

### 3️⃣ **Dashboard Admin** (`/admin`)

#### 📍 Arquivo: `components/admin/AvisosTable.tsx`

**Linhas da tabela:**
```tsx
<div className="px-5 py-3.5 ...">
  {/* 🔧 Ajuste px-5 py-3.5 */}
</div>
```

**Cards de estatísticas** - Arquivo: `components/admin/StatsRow.tsx`
```tsx
<div className="p-5 pb-[18px] ...">
  {/* 🔧 Ajuste padding dos cards */}
</div>
```

**Números grandes:**
```tsx
<div className="text-[30px] ...">
  {/* 🔧 Tamanho dos números */}
</div>
```

---

### 4️⃣ **Modal de Confirmação**

#### 📍 Arquivo: `components/ui/ConfirmDialog.tsx`

**Largura do modal (linha 52):**
```tsx
<div className="... max-w-[460px] ...">
  {/* 🔧 Ajuste max-w-[460px] */}
</div>
```

**Ícone de alerta:**
```tsx
<div className="w-20 h-20 ...">
  {/* 🔧 Tamanho do ícone: w-20 h-20 */}
</div>
```

**Textos:**
- Título: `text-[21px]` (linha 61)
- Mensagem: `text-[15px]` (linha 66)
- Botões: `text-[14px]` (linhas 73, 80)

---

## 🎯 Classes Tailwind Úteis

### Tamanhos de Texto
```
text-xs   → 12px
text-sm   → 14px
text-base → 16px
text-lg   → 18px
text-xl   → 20px
text-2xl  → 24px
text-3xl  → 30px
text-4xl  → 36px
text-5xl  → 48px
text-6xl  → 60px
```

### Padding/Margin
```
p-2  → 8px
p-3  → 12px
p-4  → 16px
p-5  → 20px
p-6  → 24px
p-8  → 32px
p-10 → 40px
p-12 → 48px
```

### Larguras Máximas
```
max-w-sm  → 384px
max-w-md  → 448px
max-w-lg  → 512px
max-w-xl  → 576px
max-w-2xl → 672px
max-w-[valor] → Custom (ex: max-w-[1100px])
```

---

## 🔧 Configurações do Modo TV (Banco de Dados)

**Tabela:** `tv_settings`

| Campo | Valor Padrão | Descrição |
|-------|--------------|-----------|
| `timer_seconds` | 20 | Segundos por slide |
| `transition_duration` | 500 | Duração da transição (ms) |

**Como alterar:**
- Acesse `/admin` → Botão "⚙️ Modo TV"
- Ajuste os valores e salve
- Mudanças aplicadas em tempo real via Supabase Realtime

---

## 📱 Responsividade

### Breakpoints Tailwind
```
sm:  → 640px
md:  → 768px
lg:  → 1024px
xl:  → 1280px
2xl: → 1536px
```

### Exemplo de uso:
```tsx
<h2 className="text-2xl md:text-4xl lg:text-5xl">
  {/* Mobile: 24px, Tablet: 36px, Desktop: 48px */}
</h2>
```

---

## 🎨 Cores do Tema EENSA

**Arquivo:** `app/globals.css` (linhas 20-50)

```css
--green: #1A6B2E;      /* Verde EENSA */
--orange: #D67530;     /* Laranja urgente */
--teal: #2BAAC7;       /* Azul-turquesa normal */
--yellow: #E6B800;     /* Amarelo informativo */
```

**Como usar:**
```tsx
className="text-eensa-green"
className="bg-eensa-orange"
className="border-eensa-teal"
```

---

## ✅ Recomendações

### Modo TV:
- **Título:** Mantenha entre `text-3xl` e `text-5xl`
- **Corpo:** Mantenha entre `text-xl` e `text-3xl`
- **Padding:** Entre `p-6` e `p-10`
- **Largura máxima:** Entre `1000px` e `1300px`

### Admin:
- **Cards stats:** Números grandes (`text-[28px]` a `text-[36px]`)
- **Tabela:** Texto legível (`text-sm` a `text-base`)

### Modais:
- **Largura:** Entre `400px` e `600px`
- **Padding:** `p-6` a `p-8`

---

## 📝 Últimas Alterações (19/03/2026)

1. **Modo TV redimensionado:**
   - Card: `minHeight: 360px` → `maxHeight: 480px`
   - Largura: `max-w-[1400px]` → `max-w-[1100px]`
   - Padding: `p-12` → `p-8`
   - Título: `text-5xl` → `text-4xl`
   - Corpo: `text-3xl` → `text-2xl`

2. **Console limpo:**
   - Removidos logs excessivos de Supabase
   - Configurado autoRefreshToken no client

3. **Modal de confirmação adicionado:**
   - Substituído `confirm()` nativo
   - Design consistente com identidade EENSA
