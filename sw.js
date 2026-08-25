// Priorities service worker: versioned cache so the app works offline and
// installs as a PWA. Bump CACHE on every release so clients pick up new files.
const CACHE = "priorities-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./locales/manifest.js",
  "./locales/en.js",
  "./locales/fr.js",
  "./locales/ar.js",
  "./styles/manifest.js",
  "./styles/ledger.js",
  "./styles/classic.js",
  "./styles/midnight.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  // cache:"reload" bypasses the browser HTTP cache (GitHub Pages serves max-age=600),
  // so a version bump can never seed the new cache with stale pre-release files.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  // Navigations: network first so deployments arrive promptly; cache when offline.
  // Only cache successful responses: a transient 404/502 must never replace the
  // offline app shell or get pinned by the cache-first branch.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put("./index.html", copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Everything else same-origin: cache first, then network (caching good results).
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
