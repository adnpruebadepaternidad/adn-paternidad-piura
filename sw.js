const CACHE_NAME = 'adn-piura-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './og-image.jpg',
  './favicon.png',
  './manifest.json'
];

// Instalación: guarda los archivos en la nueva caché
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activación: elimina las cachés viejas para aplicar los cambios al instante
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepción de peticiones: sirve desde caché si existe, o descarga de la red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
