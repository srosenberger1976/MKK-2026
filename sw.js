const CACHE_NAME = 'mkk-dart-v6'; // Erhöht auf v6, damit das Pixel 8a sofort den neuen Code erzwingt
const ASSETS = [
  '/MKK-2026/',
  '/MKK-2026/index.html',
  '/MKK-2026/manifest.json'
];

// Installieren und Assets in den Cache laden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Dateien werden für MKK-2026 gecacht...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Alten Cache löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Anfragen verarbeiten
self.addEventListener('fetch', event => {
  // WICHTIG: Wenn nach der spieler.txt gefragt wird, GEHE IMMER DIREKT INS INTERNET!
  if (event.request.url.includes('spieler.txt')) {
    return; // Ignoriert den Cache komplett für diese Datei
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
