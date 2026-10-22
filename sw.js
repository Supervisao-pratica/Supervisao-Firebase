const CACHE='supervisao-senac-v39';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.mode!=='navigate')return;e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./index.html')).then(async r=>{if(r&&r.ok){const c=await caches.open(CACHE);c.put('./index.html',r.clone())}return r||new Response('Sem conexão',{status:503})}))});
