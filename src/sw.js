const CACHE = 'acalmo-__BUILD_HASH__';
const FILES = __PRECACHE_FILES__;
const PATHS = new Set(FILES);
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('acalmo-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !PATHS.has(url.pathname)) return;
  event.respondWith((async () => {
    try { const response = await fetch(request); if (response.ok && response.type === 'basic') { const cache = await caches.open(CACHE); await cache.put(url.pathname, response.clone()); } return response; }
    catch { const cached = await caches.match(url.pathname); return cached || new Response('Esta página ainda não está disponível offline. Volte quando tiver conexão.', { status:503,headers:{'Content-Type':'text/plain;charset=utf-8'} }); }
  })());
});
