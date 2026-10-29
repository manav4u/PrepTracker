// Offline shell. Navigation is network-first so a new deploy is picked up as soon as the student is online.
// Visited documents are cached under their own URLs; the install-time landing document is the
// offline fallback of last resort. Hashed build assets never change, so they are cache-first.
// v3: fixes the single-slot navigation cache that overwrote the landing fallback on every visit.
// Old caches are deleted on activate, so existing users migrate on their next online visit.
const CACHE = 'preptracker-shell-v3';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './app', './manifest.webmanifest', './icon-192.png'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== 'preptracker-avatars-v1').map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          // Cache each visited document under its own URL so an offline
          // revisit serves the right page. Never overwrite './': the
          // install-time landing document stays the last-resort fallback.
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./'))
        )
    );
    return;
  }

  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/avatars/v1/')) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
  }
});
