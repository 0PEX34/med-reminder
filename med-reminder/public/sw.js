self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'taken') {
    self.clients.matchAll({ type: 'window' }).then(cls => {
      cls.forEach(c => c.postMessage({ type: 'MED_TAKEN', id: e.notification.data.id }));
    });
  } else {
    self.clients.openWindow('/');
  }
});
