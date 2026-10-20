/* S.G.T V32 - network-first para navegacao; nao armazena Firebase, credenciais ou HTML antigo. */
const CACHE = 'sgt-static-v32';
const STATIC = ['./manifest.webmanifest', './app-icon.svg', './apple-touch-icon-180.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, {cache:'no-store'}).catch(() => new Response(
      '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Sem conexao</title><body style="font:18px system-ui;padding:32px"><h1>Sem conexao</h1><p>Os dados locais permanecem preservados. Reconecte-se e tente novamente.</p><button onclick="location.reload()">Tentar novamente</button></body></html>',
      {status:503, headers:{'Content-Type':'text/html; charset=utf-8'}}
    )));
    return;
  }
  if (STATIC.some(path => url.pathname.endsWith(path.slice(1)))) {
    event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;})));
  }
});
