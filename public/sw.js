const CACHE_NAME = "pdfghost-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/file.svg",
  "/globe.svg",
  "/window.svg"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Cache-first for assets, network-first otherwise)
self.addEventListener("fetch", (e) => {
  // Bypass hot-reloading web sockets and development chunks
  if (
    e.request.url.includes("/_next/") || 
    e.request.url.includes("webpack") ||
    e.request.url.startsWith("ws:") ||
    e.request.url.startsWith("wss:")
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Cache static asset requests
        if (
          networkResponse.status === 200 &&
          (e.request.url.endsWith(".svg") || e.request.url.endsWith(".png") || e.request.url.endsWith(".js"))
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback
      return caches.match("/");
    })
  );
});
