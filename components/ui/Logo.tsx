// components/ui/Logo.tsx
interface LogoProps {
  size?: number;
  variant?: 'icon' | 'full' | 'compact';
  className?: string;
}

// Logo Principal - Ícone moderno com livro e folhas (crescimento + conhecimento)
export function Logo({ size = 44, variant = 'icon', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        className={className}
      >
        {/* Fundo com gradiente */}
        <rect width="48" height="48" rx="10" fill="url(#logoGradient)" />
        
        {/* Livro aberto */}
        <path
          d="M24 14L16 17V32L24 29L32 32V17L24 14Z"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M24 14V29M16 17L24 14L32 17"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        {/* Folha de crescimento */}
        <path
          d="M30 20C30 20 32 18 34 20C36 22 34 24 32 24C30 24 28 22 28 20C28.5 19 29.5 19 30 20Z"
          fill="white"
          opacity="0.85"
        />
        
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A6B2E" />
            <stop offset="1" stopColor="#2D8F47" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        className={className}
      >
        {/* Fundo */}
        <rect width="48" height="48" rx="10" fill="url(#compactGradient)" />
        
        {/* Letras EE estilizadas */}
        <text
          x="24"
          y="32"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="900"
          fill="white"
          textAnchor="middle"
          letterSpacing="-1"
        >
          EE
        </text>
        
        {/* Linha de destaque */}
        <rect x="14" y="36" width="20" height="2" rx="1" fill="white" opacity="0.6" />
        
        <defs>
          <linearGradient id="compactGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A6B2E" />
            <stop offset="1" stopColor="#2D8F47" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return null;
}

// Logo alternativa - Design minimalista e moderno
export function LogoAlt({ size = 44, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
    >
      {/* Fundo arredondado */}
      <rect width="48" height="48" rx="12" fill="url(#altGradient)" />
      
      {/* Símbolo de educação - prédio escolar estilizado */}
      <path
        d="M24 12L14 18V20H34V18L24 12Z"
        fill="white"
        opacity="0.95"
      />
      <rect x="16" y="20" width="4" height="10" rx="1" fill="white" opacity="0.85" />
      <rect x="22" y="20" width="4" height="10" rx="1" fill="white" opacity="0.85" />
      <rect x="28" y="20" width="4" height="10" rx="1" fill="white" opacity="0.85" />
      <rect x="14" y="30" width="20" height="4" rx="1" fill="white" opacity="0.95" />
      
      {/* Estrela de excelência */}
      <path
        d="M38 14L39 17L42 17L39.5 19L40.5 22L38 20L35.5 22L36.5 19L34 17L37 17L38 14Z"
        fill="#FFD700"
        opacity="0.9"
      />
      
      <defs>
        <linearGradient id="altGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A6B2E" />
          <stop offset="1" stopColor="#145A26" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Logo com árvore do conhecimento
export function LogoTree({ size = 44, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
    >
      {/* Fundo */}
      <rect width="48" height="48" rx="11" fill="url(#treeGradient)" />
      
      {/* Tronco */}
      <rect x="22" y="26" width="4" height="8" rx="2" fill="white" opacity="0.9" />
      
      {/* Copa da árvore - três níveis representando crescimento */}
      <circle cx="24" cy="24" r="8" fill="white" opacity="0.3" />
      <circle cx="24" cy="22" r="6" fill="white" opacity="0.5" />
      <circle cx="24" cy="20" r="4.5" fill="white" opacity="0.8" />
      
      {/* Detalhes - livro na árvore */}
      <path
        d="M22 19L24 18L26 19V22L24 21L22 22V19Z"
        fill="#1A6B2E"
        opacity="0.8"
      />
      
      <defs>
        <linearGradient id="treeGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2D8F47" />
          <stop offset="1" stopColor="#1A6B2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Logo com escudo acadêmico
export function LogoShield({ size = 44, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
    >
      {/* Fundo */}
      <rect width="48" height="48" rx="11" fill="url(#shieldGradient)" />
      
      {/* Escudo */}
      <path
        d="M24 12C24 12 18 14 18 14C18 14 18 24 18 26C18 30 24 34 24 34C24 34 30 30 30 26C30 24 30 14 30 14C30 14 24 12 24 12Z"
        fill="white"
        opacity="0.95"
      />
      
      {/* Livro no escudo */}
      <path
        d="M24 18L20 20V28L24 26L28 28V20L24 18Z"
        fill="#1A6B2E"
        opacity="0.85"
      />
      <line x1="24" y1="18" x2="24" y2="26" stroke="#1A6B2E" strokeWidth="1" opacity="0.6" />
      
      {/* Estrelas de excelência */}
      <circle cx="24" cy="30" r="1" fill="#FFD700" opacity="0.9" />
      
      <defs>
        <linearGradient id="shieldGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A6B2E" />
          <stop offset="1" stopColor="#2D8F47" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Wrapper que permite escolher entre as variantes
export function EensaLogo({ 
  variant = 'default',
  size = 44,
  className = ''
}: {
  variant?: 'default' | 'alt' | 'tree' | 'shield' | 'compact';
  size?: number;
  className?: string;
}) {
  switch (variant) {
    case 'alt':
      return <LogoAlt size={size} className={className} />;
    case 'tree':
      return <LogoTree size={size} className={className} />;
    case 'shield':
      return <LogoShield size={size} className={className} />;
    case 'compact':
      return <Logo variant="compact" size={size} className={className} />;
    default:
      return <Logo size={size} className={className} />;
  }
}
