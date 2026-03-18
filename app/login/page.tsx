// app/login/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, logado, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (logado) {
      router.push('/admin');
    }
  }, [logado, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, senha);
      router.push('/admin');
    } catch (err: any) {
      setError('E-mail ou senha incorretos');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-eensa-bg">
        <div className="text-eensa-text3">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-eensa-bg px-6 py-8 relative overflow-hidden">
      {/* Background circles */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(168,216,180,0.3) 0%, transparent 70%)',
          top: '-100px',
          left: '-100px',
        }}
      />
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(168,216,180,0.2) 0%, transparent 70%)',
          bottom: '-50px',
          right: '-50px',
        }}
      />

      {/* Login Card */}
      <div className="bg-eensa-surface rounded-[22px] p-11 px-9 w-full max-w-[380px] shadow-lg text-center border-[1.5px] border-eensa-border relative z-10 animate-modal-up">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-eensa-green to-eensa-green-mid rounded-2xl flex items-center justify-center font-display font-black text-[22px] text-white tracking-tight mx-auto mb-5 shadow-[0_6px_20px_rgba(26,107,46,0.3)]">
          EE
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-[22px] text-eensa-green mb-1">
          EENSA
        </h1>
        <p className="text-[13px] text-eensa-text3 mb-[30px]">
          Painel Administrativo
        </p>

        {/* Hint */}
        <div className="text-[11px] text-eensa-text3 bg-eensa-surface2 rounded-lg px-3 py-[9px] mb-4 text-left border border-eensa-border leading-relaxed">
          <strong>💡 Dica:</strong> Use as credenciais de admin configuradas no Supabase
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-[1.5px] border-eensa-border rounded-lg px-[13px] py-2.5 font-body text-sm text-eensa-text bg-eensa-bg transition-all outline-none focus:border-eensa-green-mid focus:shadow-[0_0_0_3px_rgba(45,138,71,0.12)] focus:bg-white"
              placeholder="admin@eensa.edu.br"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block font-display font-bold text-[11px] text-eensa-text2 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border-[1.5px] border-eensa-border rounded-lg px-[13px] py-2.5 font-body text-sm text-eensa-text bg-eensa-bg transition-all outline-none focus:border-eensa-green-mid focus:shadow-[0_0_0_3px_rgba(45,138,71,0.12)] focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-eensa-red text-sm text-center bg-eensa-red-lt border border-[#f5c5b8] rounded-lg py-2 px-3">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary"
            className="w-full py-3"
            disabled={submitting}
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <a 
            href="/" 
            className="text-xs text-eensa-text3 hover:text-eensa-green transition-colors"
          >
            ← Voltar para avisos públicos
          </a>
        </div>
      </div>
    </div>
  );
}
