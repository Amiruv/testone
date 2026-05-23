const CACHE = 'strm-v2';
const SHELL = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Intercept requests tagged with ?strm-proxy=1 — fetch without CORS on behalf of the page
  if (url.includes('strm-proxy=1')) {
    const target = new URL(url).searchParams.get('target');
    if (target) {
      e.respondWith(
        fetch(target, {
          mode: 'no-cors',   // service workers can make no-cors fetches
          headers: { 'User-Agent': 'Mozilla/5.0' },
        }).then(r => {
          // no-cors gives opaque response — clone it through
          return r;
        }).catch(err => new Response('SW fetch failed: ' + err.message, { status: 502 }))
      );
      return;
    }
  }

  // Don't cache streams
  if (url.includes('.m3u') || url.includes('m3u8') || url.includes('.ts')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200 && e.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
