// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Diagnóstico: Verificar se as credenciais estão carregadas
  if (typeof window !== 'undefined' && !supabaseUrl) {
    console.error('❌ ERRO: NEXT_PUBLIC_SUPABASE_URL não está definida!');
    console.error('Verifique o arquivo .env.local');
  }
  
  if (typeof window !== 'undefined' && !supabaseAnonKey) {
    console.error('❌ ERRO: NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida!');
    console.error('Verifique o arquivo .env.local');
  }

  if (typeof window !== 'undefined') {
    console.log('🔧 Supabase Client Config:');
    console.log('URL:', supabaseUrl);
    console.log('Key (first 50 chars):', supabaseAnonKey?.substring(0, 50) + '...');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
