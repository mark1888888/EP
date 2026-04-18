/**
 * Service Worker — 英文單字練習 PWA v13
 *
 * 快取策略：
 *   - App Shell (HTML/CSS/JS)     → Cache First + 背景更新
 *   - Supabase REST / Realtime    → 絕不快取（永遠走網路）
 *   - 其他 CDN 靜態資源            → Cache First
 *   - 字體/圖示                    → Cache First
 *
 * ⚠️ 重要：認證、session、進度同步相關的請求（Supabase）
 *    必須永遠走網路，否則踢下線與資料同步會失效。
 */

const SW_VERSION    = 'v13.0.0';
const STATIC_CACHE  = 'vocab-static-' + SW_VERSION;
const RUNTIME_CACHE = 'vocab-runtime-' + SW_VERSION;

// App shell 要預先快取的檔案
const APP_SHELL = [
  './',
  './index.html',
  './vocabulary.css',
  './vocabulary.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 絕不快取的網域（認證、即時通訊必須走網路）
const NEVER_CACHE_HOSTS = [
  'supabase.co',
  'supabase.in',
  'realtime.supabase'
];

// ── install：預先快取 app shell ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL).catch((err) => {
        // 某些資源可能不存在（如 icon），降級為個別嘗試
        console.warn('[SW] bulk cache failed, fallback per-file:', err);
        return Promise.all(APP_SHELL.map((url) =>
          cache.add(url).catch((e) => console.warn('[SW] skip', url, e.message))
        ));
      }))
      .then(() => self.skipWaiting())
  );
});

// ── activate：清除舊版本快取 ────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── fetch：攔截所有網路請求 ─────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // 只處理 GET；POST (Supabase RPC) 直接放行，不介入
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Supabase 等不快取的網域 → 網路優先，失敗才回傳錯誤
  if (NEVER_CACHE_HOSTS.some((h) => url.hostname.includes(h))) {
    event.respondWith(fetch(req).catch(() => new Response(
      JSON.stringify({ error: 'offline', message: '目前離線，無法連線到伺服器' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )));
    return;
  }

  // 同源資源 → Cache First + 背景更新 (stale-while-revalidate)
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // CDN / 跨來源資源 → Cache First
  event.respondWith(cacheFirst(req));
});

// ── 快取策略函式 ────────────────────────────────────────────
async function staleWhileRevalidate(req) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(req);
  const networkPromise = fetch(req).then((resp) => {
    if (resp && resp.ok) cache.put(req, resp.clone());
    return resp;
  }).catch(() => cached);
  return cached || networkPromise;
}

async function cacheFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const resp = await fetch(req);
    if (resp && resp.ok) cache.put(req, resp.clone());
    return resp;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
  }
}

// ── 訊息通道：讓頁面可要求立刻更新 ──────────────────────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
  }
});
