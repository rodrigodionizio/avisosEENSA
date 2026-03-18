// app/admin/layout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logado, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !logado) {
      router.push('/login');
    }
  }, [logado, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-eensa-bg">
        <div className="text-eensa-text3">Verificando autenticação...</div>
      </div>
    );
  }

  if (!logado) {
    return null;
  }

  return <>{children}</>;
}
