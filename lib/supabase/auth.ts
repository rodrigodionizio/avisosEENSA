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

/** 
 * Lista de emails com permissão de acesso ADMIN.
 * Apenas estes usuários podem acessar /admin.
 * Professores, pais e alunos NÃO podem acessar.
 */
const ADMIN_EMAILS = [
  'admin@eensa.com.br',
  'direcao@eensa.com.br',
  'coordenacao@eensa.com.br',
  'rodrigo.dionizio@gmail.com',
  // Adicionar outros emails de admins aqui
];

/** 
 * Verifica se o usuário atual é um administrador do sistema.
 * @returns true se o email do usuário está na lista de admins permitidos
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

/** 
 * Retorna o email do usuário autenticado (se existir).
 */
export async function getUserEmail(): Promise<string | null> {
  const user = await getUser();
  return user?.email || null;
}
