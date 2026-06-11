// Cosmo service worker — offline-cache (kindveilig, geen netwerk nodig)
// v2: navigatie network-first + omgeleide responses schoonmaken
//     (lost iOS-fout "response served by service worker has redirections" op)
const CACHE = 'cosmo-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];

// iOS weigert een respons met .redirected=true voor de hoofdpagina.
// Daarom bouwen we redirected responses om naar een "schone" kopie.
async function clean(res) {
  if (!res || !res.redirected) return res;
  const body = await res.blob();
  return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
}

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async (url) => {
      try {
        const res = await fetch(url, { redirect: 'follow', cache: 'reload' });
        if (res && res.ok) await c.put(url, await clean(res.clone()));
      } catch (e) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Navigatie (de pagina zelf): network-first, val terug op de cache bij offline.
  // Nooit een omgeleide respons doorgeven -> voorkomt de iOS-fout.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        return await clean(fresh);
      } catch (e) {
        const c = await caches.open(CACHE);
        return (await c.match('./index.html')) || (await c.match('./'));
      }
    })());
    return;
  }

  // Overige bestanden (icons, manifest, ...): cache-first.
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        const c = await caches.open(CACHE);
        c.put(req, await clean(res.clone())).catch(() => {});
      }
      return res;
    } catch (e) {
      return caches.match('./index.html');
    }
  })());
});
