// Name deiner Cache-Version – bei Änderungen hochzählen, z.B. "v2"
const CACHE_NAME = "sgb2-terminal-cache-v1";

// Dateien, die direkt beim Installieren gecacht werden sollen:
const PRECACHE_URLS = [
  "index.html",
  "terminal-bg.html",
  "terminal-mb.html",
  "terminal-vm.html",
  "BG-script.js",
  "manifest.json",
  "icons/icon-192.jpg",
  "icons/icon-512.jpeg"
  // ggf. weitere JS/CSS-Dateien, falls ausgelagert
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// Alte Caches aufräumen, wenn CACHE_NAME geändert wurde
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch-Handler: erst Cache, dann Netzwerk (fallback)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Wenn im Cache gefunden -> direkt zurückgeben
      if (response) {
        return response;
      }
      // Sonst normal aus dem Netz holen
      return fetch(event.request);
    })
  );
});
