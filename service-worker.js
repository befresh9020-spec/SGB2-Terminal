// ─── Cache-Name ───────────────────────────────────────────────────────────────
// Versionsnummer hochzählen (v2, v3 …), wenn sich Dateien geändert haben.
// Das löst automatisch den Update-Mechanismus aus.
const CACHE_NAME = “sgb2-terminal-cache-v1”;

// ─── Zu cachende Dateien ───────────────────────────────────────────────────────
// Alle Pfade müssen exakt mit dem Server übereinstimmen (Groß-/Kleinschreibung!).
const PRECACHE_URLS = [
“index.html”,
“terminal-bg.html”,
“terminal-mb.html”,
“terminal-vm.html”,
“BG-script.js”,
“manifest.json”,
“icons/icon-192.png”,
“icons/icon-512.png”
];

// ─── INSTALL ──────────────────────────────────────────────────────────────────
// Jede Datei wird einzeln gecacht. Schlägt eine fehl, bricht nicht alles ab.
self.addEventListener(“install”, event => {
event.waitUntil(
caches.open(CACHE_NAME).then(async cache => {
const results = await Promise.allSettled(
PRECACHE_URLS.map(url =>
cache.add(url).catch(err => {
console.warn(`[SW] Konnte nicht cachen: ${url}`, err);
})
)
);
const failed = results.filter(r => r.status === “rejected”);
if (failed.length) {
console.warn(`[SW] ${failed.length} Datei(en) konnten nicht gecacht werden.`);
}
})
// skipWaiting: neuer SW wird sofort aktiv, ohne auf Tab-Reload zu warten
.then(() => self.skipWaiting())
);
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
// Alte Caches löschen, dann sofort alle Clients übernehmen.
self.addEventListener(“activate”, event => {
event.waitUntil(
caches.keys()
.then(keys =>
Promise.all(
keys
.filter(key => key !== CACHE_NAME)
.map(key => {
console.log(`[SW] Alter Cache gelöscht: ${key}`);
return caches.delete(key);
})
)
)
// clients.claim: offene Tabs werden sofort vom neuen SW kontrolliert
.then(() => self.clients.claim())
);
});

// ─── FETCH ────────────────────────────────────────────────────────────────────
// Strategie: Cache First → Netzwerk als Fallback.
// Netzwerkantworten werden dynamisch nachgecacht (z. B. Schriften von Google).
self.addEventListener(“fetch”, event => {
// Nur GET-Anfragen behandeln
if (event.request.method !== “GET”) return;

// chrome-extension:// und andere Non-HTTP-Schemes ignorieren
if (!event.request.url.startsWith(“http”)) return;

event.respondWith(
caches.match(event.request).then(cached => {
if (cached) {
return cached; // Cache-Treffer → sofort zurückgeben
}

```
  // Cache-Miss → Netzwerk
  return fetch(event.request)
    .then(networkResponse => {
      // Nur gültige Antworten dynamisch cachen (kein opaque response-Risiko)
      if (
        networkResponse &&
        networkResponse.status === 200 &&
        networkResponse.type !== "opaque"
      ) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
      }
      return networkResponse;
    })
    .catch(() => {
      // Offline-Fallback: Falls nichts gecacht und kein Netz → index.html
      return caches.match("index.html");
    });
})
```

);
});