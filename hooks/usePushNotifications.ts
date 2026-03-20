// hooks/usePushNotifications.ts
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export type PushStatus = 'idle' | 'loading' | 'subscribed' | 'denied' | 'unsupported';

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>('idle');

  // Verifica estado atual ao montar
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setStatus('denied');
      return;
    }
    if (Notification.permission === 'granted') {
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setStatus(sub ? 'subscribed' : 'idle');
    } catch (err) {
      console.error('Erro ao verificar subscription:', err);
      setStatus('idle');
    }
  }

  async function subscribe() {
    try {
      setStatus('loading');

      // 1. Registrar o Service Worker
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      // 2. Pedir permissão ao usuário
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      // 3. Criar subscription via PushManager
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as BufferSource,
      });

      // 4. Salvar no Supabase
      const subJson = sub.toJSON();
      const supabase = createClient();

      const { error } = await supabase.from('push_subscriptions').upsert({
        endpoint:   subJson.endpoint,
        p256dh:     subJson.keys!.p256dh,
        auth:       subJson.keys!.auth,
        user_agent: navigator.userAgent,
        ativo:      true,
      }, { onConflict: 'endpoint' });

      if (error) {
        console.error('Erro ao salvar subscription:', error);
        throw error;
      }

      setStatus('subscribed');
    } catch (err) {
      console.error('Erro ao assinar push:', err);
      setStatus('idle');
    }
  }

  async function unsubscribe() {
    try {
      setStatus('loading');
      const reg  = await navigator.serviceWorker.ready;
      const sub  = await reg.pushManager.getSubscription();
      if (!sub) {
        setStatus('idle');
        return;
      }

      const supabase = createClient();
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', sub.endpoint);

      await sub.unsubscribe();
      setStatus('idle');
    } catch (err) {
      console.error('Erro ao desinscrever:', err);
      setStatus('subscribed'); // Mantém como subscribed se falhar
    }
  }

  return { status, subscribe, unsubscribe };
}

// Helper: converte a chave VAPID pública para o formato que o browser espera
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
