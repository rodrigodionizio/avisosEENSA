// app/api/push/send/route.ts
import webpush from 'web-push';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Configurar VAPID
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Proteção: só o admin autenticado pode enviar push
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' }, 
        { status: 401 }
      );
    }

    const { titulo, corpo, prioridade, avisoId, slug } = await req.json();

    // Validações básicas
    if (!titulo || !corpo) {
      return NextResponse.json(
        { error: 'Título e corpo são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar todas as subscriptions ativas
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('ativo', true);

    if (subError) {
      console.error('Erro ao buscar subscriptions:', subError);
      return NextResponse.json(
        { error: 'Erro ao buscar subscriptions' },
        { status: 500 }
      );
    }

    if (!subscriptions?.length) {
      return NextResponse.json({ 
        enviados: 0, 
        message: 'Nenhuma subscription ativa encontrada' 
      });
    }

    // Montar o payload da notificação
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://avisos-eensa.vercel.app';
    const url = `${baseUrl}/aviso/${slug || avisoId}`;
    
    // Ícone padrão - usa o icon-192.png que já existe
    const badge = `${baseUrl}/icon-192.png`;

    const payload = JSON.stringify({
      title: titulo,
      body:  corpo.length > 120 ? corpo.substring(0, 117) + '...' : corpo,
      tag:   `aviso-${avisoId}`,
      url:   url,
      badge: badge,
    });

    // Enviar para todos os dispositivos em paralelo
    const resultados = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          { 
            endpoint: sub.endpoint, 
            keys: { p256dh: sub.p256dh, auth: sub.auth } 
          },
          payload
        ).then(() => sub.id) // Retorna o ID se sucesso
      )
    );

    // Separar sucesso vs falha
    const sucessos = resultados
      .filter((r): r is PromiseFulfilledResult<number> => r.status === 'fulfilled')
      .map(r => r.value);

    const falhas = resultados
      .map((r, i) => ({ r, sub: subscriptions[i] }))
      .filter(({ r }) => r.status === 'rejected')
      .map(({ sub }) => sub.endpoint);

    // Remover subscriptions inválidas (dispositivos que desinstalaram o app)
    if (falhas.length) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', falhas);
    }

    // Incrementar contador de notificações enviadas com sucesso
    // TODO: Implementar contador usando RPC function no Supabase
    // if (sucessos.length) { ... }

    return NextResponse.json({ 
      enviados: sucessos.length, 
      invalidas: falhas.length,
      message: `${sucessos.length} notificações enviadas com sucesso` 
    });

  } catch (error) {
    console.error('Erro ao enviar push notifications:', error);
    return NextResponse.json(
      { error: 'Erro interno ao enviar notificações' },
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar status (apenas admin)
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('id, criado_em, total_recebidas, ativo')
    .eq('ativo', true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    total: data?.length || 0,
    subscriptions: data,
  });
}
