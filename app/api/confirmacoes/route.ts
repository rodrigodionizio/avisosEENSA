// app/api/confirmacoes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashIP, getClientIP } from '@/lib/ip-hash';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { aviso_id, device_hash, display_name, origem } = body;

    // ── Validação de entrada ──────────────────────────────────
    if (!aviso_id || typeof aviso_id !== 'number') {
      return NextResponse.json({ error: 'aviso_id inválido' }, { status: 400 });
    }

    if (!device_hash || typeof device_hash !== 'string' || device_hash.length !== 64) {
      return NextResponse.json({ error: 'device_hash inválido' }, { status: 400 });
    }

    const origens = ['web', 'push', 'tv', 'qrcode'] as const;
    if (origem && !origens.includes(origem)) {
      return NextResponse.json({ error: 'origem inválida' }, { status: 400 });
    }

    // ── Verificar se o aviso existe e está ativo ──────────────
    const sb = await createClient();

    const { data: aviso, error: avisoError } = await sb
      .from('avisos')
      .select('id')
      .eq('id', aviso_id)
      .gte('expira_em', new Date().toISOString())
      .lte('publica_em', new Date().toISOString())
      .maybeSingle();

    if (avisoError || !aviso) {
      return NextResponse.json({ error: 'Aviso não encontrado ou expirado' }, { status: 404 });
    }

    // ── Obter user_id se autenticado ─────────────────────────
    const { data: { user } } = await sb.auth.getUser();

    // ── Hash do IP (nunca salvar o IP bruto) ─────────────────
    const ip = getClientIP(req);
    const ipHash = hashIP(ip);

    // ── Inserir (ON CONFLICT → ignorar, não lançar erro) ─────
    const { error: insertError } = await sb
      .from('aviso_confirmacoes')
      .upsert(
        {
          aviso_id,
          device_hash,
          display_name: display_name?.trim().slice(0, 80) || null,
          user_id: user?.id ?? null,
          ip_hash: ipHash,
          user_agent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
          origem: origem ?? 'web',
        },
        {
          onConflict: 'aviso_id,device_hash',
          ignoreDuplicates: true, // Se já confirmou, retorna 200 sem erro
        }
      );

    if (insertError) {
      console.error('Erro ao salvar confirmação:', insertError);
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('Erro inesperado na confirmação:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
