self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}

  const title = data.title || 'ASD SGM Spadafora Sport';
  const options = {
    body: data.body || 'Nuovo aggiornamento dal mondo SGM.',
    icon: data.icon || '/IMG-20250217-WA0006.jpg',
    badge: data.badge || '/IMG-20250217-WA0006.jpg',
    data: {
      url: data.target_url || '/',
      type: data.type || 'custom'
    },
    vibrate: [120, 60, 120],
    tag: 'sgm-' + (data.type || 'news'),
    renotify: true
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const raw = event.notification?.data?.url || '/';
  const url = new URL(raw, self.location.origin).href;

  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      if ('focus' in client) {
        try { await client.navigate(url); } catch (_) {}
        return client.focus();
      }
    }
    if (clients.openWindow) return clients.openWindow(url);
  })());
});
