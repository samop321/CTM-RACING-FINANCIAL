const CACHE_NAME = "ctm-financial-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Network-first for the app itself: always try to fetch the latest version
// when online, and only fall back to the last cached copy when offline.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode === "navigate" || req.destination === "document" || req.destination === "script") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
