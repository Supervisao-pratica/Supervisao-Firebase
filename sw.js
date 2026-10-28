const CACHE='supervisao-senac-v65-rateio-online';
const INDEX=new URL('./index.html',self.registration.scope).href;
self.addEventListener('install',event=>{event.waitUntil((async()=>{const r=await fetch(INDEX,{cache:'reload'});if(!r.ok)throw Error('Não foi possível obter a versão completa');const cache=await caches.open(CACHE);await cache.put(INDEX,r);})());});
// Sem troca forçada no meio de uma edição: a atualização assume na próxima abertura.
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const k of await caches.keys()){if(k!==CACHE&&(k.startsWith('supervisao-senac-')||k.startsWith('senac-v')))await caches.delete(k);}await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||event.request.mode!=='navigate'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const r=await fetch(event.request,{cache:'no-store'});if(r.ok){if(url.pathname===new URL(INDEX).pathname||url.pathname===new URL(self.registration.scope).pathname)await cache.put(INDEX,r.clone());return r;}return await cache.match(INDEX)||r;}catch(e){return await cache.match(INDEX)||new Response('Sem conexão. Reabra após conectar para carregar o aplicativo.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});}})());
});