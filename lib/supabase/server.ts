// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Cria um cliente Supabase para Server Components e Server Actions.
 * Usa cookies para manter a sessão do usuário.
 * 
 * IMPORTANTE: Este cliente só funciona no servidor (Server Components, API Routes, Server Actions).
 * Para Client Components, use './client.ts'
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Set method pode falhar em Server Components read-only
            // Isso é esperado e seguro de ignorar
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Remove method pode falhar em Server Components read-only
            // Isso é esperado e seguro de ignorar
          }
        },
      },
    }
  );
}