const CACHE_NAME = "version-1";
const urlsToCache = [ 'index.html'/* , 'offline.html', '/login.js', 'app/js' */ ];

const self = this;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');

                return cache.addAll(urlsToCache);
            })
    )
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match('offline.html'))
            })
    )
});

// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});

self.addEventListener('push', event => {
    console.log('Push event received:', event);
    const data = event.data ? event.data.json() : {};
    console.log('Notification payload:', data);
  
    const options = {
      body: data.body,
      icon: '/icon-96x96.png', // Optional
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title || 'Default Title', options)
    );
  });