// lib/auth/domain-check.ts
// Validação de domínio de email para Google OAuth

/**
 * Domínio permitido para autenticação de professores/equipe escolar
 * Apenas emails corporativos @educacao.mg.gov.br são aceitos
 */
const DOMINIO_PERMITIDO = '@educacao.mg.gov.br';

/**
 * Verifica se o email fornecido pertence ao domínio corporativo permitido
 * 
 * @param email - Email a ser validado (pode ser undefined)
 * @returns true se o email termina com @educacao.mg.gov.br (case-insensitive)
 * 
 * @example
 * isDominioValido('joao.silva@educacao.mg.gov.br') // true
 * isDominioValido('maria@gmail.com') // false
 * isDominioValido(undefined) // false
 */
export function isDominioValido(email: string | undefined | null): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith(DOMINIO_PERMITIDO.toLowerCase());
}

/**
 * Retorna o domínio corporativo permitido
 * Útil para mensagens de erro e validações na UI
 * 
 * @returns String com o domínio (@educacao.mg.gov.br)
 */
export function getDominioPermitido(): string {
  return DOMINIO_PERMITIDO;
}

/**
 * Extrai o nome do usuário a partir do email corporativo
 * Remove o domínio e formata o nome (substitui pontos por espaços)
 * 
 * @param email - Email corporativo
 * @returns Nome formatado ou string vazia
 * 
 * @example
 * extrairNomeDoEmail('joao.silva@educacao.mg.gov.br') // 'joao silva'
 * extrairNomeDoEmail('maria@gmail.com') // 'maria'
 */
export function extrairNomeDoEmail(email: string | undefined | null): string {
  if (!email) return '';
  
  const parteLocal = email.split('@')[0];
  return parteLocal.replace(/\./g, ' ');
}
