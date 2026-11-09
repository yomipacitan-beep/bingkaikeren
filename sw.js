/* BingkaiKeren service worker — app shell offline; campaigns.json selalu dicek terbaru saat online */
const VERSION = "bingkaikeren-v1.2.0";
// Works for both layouts: icons in an icons/ folder or next to index.html. Missing files are skipped.
const SHELL = ["./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./icons/apple-touch-icon.png",
  "./icon-192.png", "./icon-512.png", "./maskable-512.png", "./apple-touch-icon.png"];
const RUNTIME_HOSTS = ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await Promise.all(SHELL.map((u) => c.add(u).catch(() => {})));
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

async function networkFirst(req, fallbackUrl) {
  const c = await caches.open(VERSION);
  try {
    const fresh = await fetch(req, { cache: "no-cache" });
    if (fresh && fresh.ok) c.put(fallbackUrl || req, fresh.clone());
    return fresh;
  } catch (_) {
    return (await c.match(fallbackUrl || req)) || (fallbackUrl ? await c.match("./") : null) ||
      new Response("<h1>Offline</h1><p>Buka BingkaiKeren sekali saat online agar bisa dipakai offline.</p>", { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") { e.respondWith(networkFirst(req, "./index.html")); return; }
  // Daftar campaign: selalu ambil versi terbaru, pakai cache hanya saat offline.
  if (url.origin === location.origin && url.pathname.endsWith(".json")) { e.respondWith(networkFirst(req)); return; }

  if (url.origin === location.origin || RUNTIME_HOSTS.includes(url.hostname)) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const hit = await c.match(req);
      const net = fetch(req).then((res) => { if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone()); return res; }).catch(() => null);
      return hit || (await net) || new Response("", { status: 504 });
    })());
  }
});
