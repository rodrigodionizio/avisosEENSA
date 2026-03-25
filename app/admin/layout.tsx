// app/admin/layout.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/supabase/auth';
import { AlertDialog } from '@/components/ui/AlertDialog';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logado, loading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAccess() {
      if (!loading) {
        if (!logado) {
          router.push('/login');
          return;
        }
        
        // Verificar se usuário autenticado é admin REAL
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
        
        if (!adminStatus) {
          // Usuário logado mas NÃO é admin (professor/outro)
          setShowAccessDenied(true);
          setTimeout(() => router.push('/'), 2000);
        }
      }
    }
    
    checkAdminAccess();
  }, [logado, loading, router]);

  if (loading || isAdminUser === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-eensa-bg">
        <div className="text-eensa-text3">Verificando permissões...</div>
      </div>
    );
  }

  if (!logado || !isAdminUser) {
    return null;
  }

  return (
    <>
      {children}
      <AlertDialog
        isOpen={showAccessDenied}
        onClose={() => {
          setShowAccessDenied(false);
          router.push('/');
        }}
        title="Acesso Negado"
        message="Apenas administradores podem acessar esta área. Você será redirecionado para a página inicial."
        variant="warning"
        confirmText="Entendi"
      />
    </>
  );
}
