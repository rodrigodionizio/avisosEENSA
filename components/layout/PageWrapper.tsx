// components/layout/PageWrapper.tsx
import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  wide?: boolean;
}

export function PageWrapper({ children, wide = false }: PageWrapperProps) {
  const maxWidth = wide ? 'max-w-[1060px]' : 'max-w-[860px]';
  
  return (
    <div className={`${maxWidth} mx-auto px-6 sm:px-8 py-8 pb-18 pt-[calc(68px+1rem)]`}>
      {children}
    </div>
  );
}
