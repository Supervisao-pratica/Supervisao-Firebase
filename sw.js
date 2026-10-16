/* Não armazena respostas do Firebase, credenciais ou páginas com dados pessoais. */
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Sem conexão</title><body style="font:18px system-ui;padding:32px"><h1>Você está sem conexão</h1><p>As alterações salvas no dispositivo permanecem preservadas. Reconecte-se e reabra o aplicativo para sincronizar.</p><button onclick="location.reload()">Tentar novamente</button></body></html>',
    {headers:{'Content-Type':'text/html; charset=utf-8'},status:503}
  )));
});
