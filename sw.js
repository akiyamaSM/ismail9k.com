const filesToCache = [
  '/',
  'dist/css/style.css',
  'dist/js/app.js',
  'dist/font/FiraCode-Bold.ttf',
  'dist/font/FiraCode-Regular.ttf',
  'index.html',
];

const staticCacheName = 'ismail9k-cache-10022020';

// save files to cachew
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

// get rid of unused caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// serve files from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        // Fetch files
        return fetch(event.request).then(response => {
          // Add fetched files to the cache
          return caches.open(staticCacheName).then(cache => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch(error => {
        return caches.match('pages/offline.html');
      })
  );
});
