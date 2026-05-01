/**
 * CivicPath Service Worker — Offline-First PWA Strategy
 * 
 * Uses a cache-first strategy for static assets and network-first for API calls.
 * This ensures the app remains usable even with unreliable connectivity,
 * which is critical for voters in rural areas with poor internet.
 */

const CACHE_NAME = 'civicpath-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/logo.png',
];

// Install: precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Network-first for API calls
  if (url.hostname.includes('googleapis.com') || 
      url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('open-meteo.com') ||
      url.hostname.includes('wikidata.org')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses for offline fallback
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache new static assets
        if (response.ok && url.origin === self.location.origin) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      });
    })
  );
});
