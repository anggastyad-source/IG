/* Serialist offline worker.
   It keeps a copy of the app files so Serialist opens without internet.
   When you change any file and publish again, raise the number in CACHE
   (serialist-v2, serialist-v3, ...) so phones pick up the new version. */
const CACHE = 'serialist-v4';
const FILES = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './fonts/figtree-latin-wght-normal.woff2',
  './fonts/figtree-latin-ext-wght-normal.woff2',
  './fonts/literata-latin-standard-normal.woff2',
  './fonts/literata-latin-ext-standard-normal.woff2',
  './fonts/literata-latin-standard-italic.woff2',
  './fonts/literata-latin-ext-standard-italic.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('serialist-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// The app asks for this when you tap "Update" on the new-version notice.
self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(caches.match('./index.html').then((hit) => hit || fetch(req)));
    return;
  }
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((cache) => cache.put(req, copy)); }
      return res;
    }))
  );
});
