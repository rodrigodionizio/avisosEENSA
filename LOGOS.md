# Logos EENSA - Guia de Uso

## Variantes Disponíveis

O componente `<EensaLogo>` oferece 5 variantes de logo diferentes. Você pode escolher a que melhor se encaixa na identidade visual da escola.

### 1. **Default** - Livro com Folha de Crescimento
```tsx
<EensaLogo variant="default" size={44} />
```
- Representa: Conhecimento (livro) + Crescimento (folha)
- Melhor para: Design moderno e conceitual
- Simboliza: "Construindo Histórias" através do conhecimento e crescimento

### 2. **Alt** - Prédio Escolar com Estrela
```tsx
<EensaLogo variant="alt" size={44} />
```
- Representa: Instituição de ensino com símbolo de excelência
- Melhor para: Enfatizar a instituição física
- Simboliza: Escola de excelência e qualidade

### 3. **Tree** - Árvore do Conhecimento
```tsx
<EensaLogo variant="tree" size={44} />
```
- Representa: Crescimento contínuo através da educação
- Melhor para: Ênfase em desenvolvimento e crescimento
- Simboliza: Raízes firmes e crescimento constante

### 4. **Shield** - Escudo Acadêmico
```tsx
<EensaLogo variant="shield" size={44} />
```
- Representa: Tradição acadêmica e proteção do conhecimento
- Melhor para: Visual mais tradicional e formal
- Simboliza: Instituição sólida e confiável

### 5. **Compact** - Logo Simplificada (EE)
```tsx
<EensaLogo variant="compact" size={44} />
```
- Representa: Versão minimalista com iniciais
- Melhor para: Espaços reduzidos ou design minimalista
- Simboliza: Identidade direta e moderna

## Como Trocar a Logo

### No Header
Edite: `components/layout/Header.tsx`

```tsx
<EensaLogo variant="shield" size={44} className="flex-shrink-0" />
```

### Na Página TV
Edite: `app/tv/page.tsx`

```tsx
<EensaLogo variant="tree" size={52} />
```

## Exemplos de Uso

### Logo Grande (Página Principal)
```tsx
<EensaLogo variant="default" size={96} />
```

### Logo Média (Header)
```tsx
<EensaLogo variant="shield" size={44} />
```

### Logo Pequena (Favicon/Ícones)
```tsx
<EensaLogo variant="compact" size={32} />
```

## Recomendações

- **Para um visual moderno**: Use `default` ou `tree`
- **Para um visual tradicional**: Use `shield` ou `alt`
- **Para minimalismo**: Use `compact`

## Personalização

As logos usam o gradiente verde da EENSA definido em:
- Cor primária: `#1A6B2E`
- Cor secundária: `#2D8F47`

Se quiser alterar as cores, edite o arquivo `components/ui/Logo.tsx`.

## Exportar Logo para Outros Formatos

As logos são SVG puras e podem ser facilmente exportadas para:
- PNG (via screenshot ou conversão online)
- PDF (copiar o SVG e colar em design tools)
- Favicon (redimensionar para 32x32 ou 16x16)

Para converter SVG para PNG:
1. Abra https://svgtopng.com/
2. Cole o código SVG da logo escolhida
3. Defina o tamanho desejado
4. Faça o download

## Próximos Passos

Se a escola tiver uma logo oficial existente, você pode:
1. Salvar a logo como arquivo em `public/logo.png`
2. Substituir o componente `<EensaLogo>` por `<Image>` do Next.js:

```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="EENSA Logo" 
  width={44} 
  height={44}
  className="flex-shrink-0"
/>
```
