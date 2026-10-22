const CACHE_NAME = 'mkk-dart-v8'; // Auf v8 erhöht für Android-Update-Zwang
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
      return cache.addAll(ASSETS).catch(err => console.log("Cache-Fehler abgefangen:", err));
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
    event.respondWith(fetch(event.request));
    return; 
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
