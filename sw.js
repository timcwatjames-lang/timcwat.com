var CACHE = 'web-dev-play-v2';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/css.html',
  '/javascript.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/tools.html',
  '/timmy.html',
  '/accessibility.html',
  '/index.css',
  '/index.js',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/images/no-bg.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(STATIC_FILES).catch(function () {});
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(e.request).then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) { cache.put(e.request, copy); });
        }
        return res;
      });
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })
      );
    })
  );
});
