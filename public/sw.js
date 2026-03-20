// public/sw.js - Service Worker para Push Notifications
// Este arquivo roda em background no dispositivo, mesmo com o app fechado

self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body:    data.body,
    icon:    '/icon-192.png',
    badge:   data.badge || '/icon-192.png',
    tag:     data.tag || 'eensa-aviso',      // agrupa notificações do mesmo aviso
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',                  // URL que abre ao clicar
    },
    actions: [
      { action: 'ver', title: 'Ver aviso', icon: '/icon-192.png' },
      { action: 'fechar', title: 'Fechar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ao clicar na notificação → abre a URL do aviso
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'fechar') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se o app já está aberto, foca nele
        for (const client of clientList) {
          if (client.url.includes(new URL(url).pathname) && 'focus' in client) {
            return client.focus();
          }
        }
        // Senão, abre nova janela
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});

// Install event - ativa imediatamente
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - toma controle imediatamente
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
