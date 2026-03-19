// components/ui/Icons.tsx
interface IconProps {
  className?: string;
  size?: number;
}

export const Icons = {
  // Prioridade
  Urgent: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.2" />
      <circle cx="8" cy="8" r="5" fill="currentColor" />
      <path d="M8 4V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="white" />
    </svg>
  ),

  Normal: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.2" />
      <circle cx="8" cy="8" r="5" fill="currentColor" />
      <path d="M6 8L7.5 9.5L10.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Info: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.2" />
      <circle cx="8" cy="8" r="5" fill="currentColor" />
      <path d="M8 7.5V11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5.5" r="0.75" fill="white" />
    </svg>
  ),

  // Ações
  Edit: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M11.5 2.5L13.5 4.5L6 12H4V10L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 4L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Trash: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6.5 7V11M9.5 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Plus: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // Tempo
  Clock: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Calendar: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 6H14M5 2V4M11 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Lightning: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M9 2L4 9H8L7 14L12 7H8L9 2Z" fill="currentColor" />
    </svg>
  ),

  // Pessoas e objetos
  User: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 13C3 10.7909 5.01472 9 7.5 9H8.5C10.9853 9 13 10.7909 13 13V13.5C13 13.7761 12.7761 14 12.5 14H3.5C3.22386 14 3 13.7761 3 13.5V13Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),

  TV: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <path d="M5 2L8 4L11 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  List: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 6H11M5 8.5H9M5 11H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Archive: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 3H14V6H2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 6V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 9H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Status
  Check: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  X: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  Sync: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M8 2C11.3137 2 14 4.68629 14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  ),

  Arrow: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // Localização e Social
  MapPin: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 14C8 14 13 10 13 6.5C13 3.46243 10.5376 1 7.5 1C4.46243 1 2 3.46243 2 6.5C2 10 8 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7.5" cy="6.5" r="1.5" fill="currentColor" />
    </svg>
  ),

  Instagram: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  ),

  BookOpen: ({ className = '', size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 3.5C2 3.5 4 2 8 2C12 2 14 3.5 14 3.5V12C14 12 12 10.5 8 10.5C4 10.5 2 12 2 12V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 2V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

// Named exports para compatibilidade
export const ClockIcon = Icons.Clock;
export const UserIcon = Icons.User;
export const ListIcon = Icons.List;
