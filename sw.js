/* BingkaiKeren service worker — app shell offline, runtime cache for CDN library and fonts */
const VERSION = "bingkaikeren-v1.1.0";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./icons/apple-touch-icon.png"];
const RUNTIME_HOSTS = ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(SHELL);
    // Pre-cache the ZIP library so backup/restore works offline after the first visit.
    try { await c.add(new Request("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", { mode: "no-cors" })); } catch (_) {}
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Page navigations: network first, fall back to the cached app shell (offline).
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(VERSION); c.put("./index.html", fresh.clone());
        return fresh;
      } catch (_) {
        return (await caches.match("./index.html")) || (await caches.match("./")) || new Response("<h1>Offline</h1><p>Buka BingkaiKeren sekali saat online agar bisa dipakai offline.</p>", { headers: { "Content-Type": "text/html" } });
      }
    })());
    return;
  }

  // Same-origin static files and known CDNs: cache first, refresh in background.
  if (url.origin === location.origin || RUNTIME_HOSTS.includes(url.hostname)) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const hit = await c.match(req);
      const net = fetch(req).then((res) => { if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone()); return res; }).catch(() => null);
      return hit || (await net) || new Response("", { status: 504 });
    })());
  }
});
