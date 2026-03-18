// lib/supabase/auth.ts
import { createClient } from './client';

const sb = createClient();

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  nome: string;
}

/** Faz login com email e senha */
export async function signIn(credentials: LoginCredentials) {
  const { data, error } = await sb.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) throw error;
  return data;
}

/** Cria nova conta */
export async function signUp(credentials: SignUpCredentials) {
  const { data, error } = await sb.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        nome: credentials.nome,
      },
    },
  });

  if (error) throw error;
  return data;
}

/** Faz logout */
export async function signOut() {
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

/** Retorna o usuário atual */
export async function getUser() {
  const { data: { user }, error } = await sb.auth.getUser();
  if (error) throw error;
  return user;
}

/** Retorna a sessão atual */
export async function getSession() {
  const { data: { session }, error } = await sb.auth.getSession();
  if (error) throw error;
  return session;
}

/** Escuta mudanças de autenticação */
export function onAuthStateChange(callback: (session: any) => void) {
  return sb.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
