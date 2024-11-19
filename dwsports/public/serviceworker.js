

const CACHE_NAME = "v1.0.5";
const urlsToCache = [ 'index.html', /* 'offline.html', '/login.js', 'app/js' */ ];

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

console.log('Service Worker Works');

/* self.addEventListener('push', e => {
    const data = e.data.json();
    console.log(data)
    console.log('Notification Received');
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Archlinux-icon-crystal-64.svg/1024px-Archlinux-icon-crystal-64.svg.png'
    });
}); */

let firebaseConfig;

self.addEventListener('message', (event) => {
    if (event.data && event.data.firebaseConfig) {
        firebaseConfig = event.data.firebaseConfig;
        console.log('[Service Worker] Received Firebase Config:', firebaseConfig);

        // Initialize Firebase here if needed
    }
});

// Example notification logic
self.addEventListener('push', (event) => {
    const payload = event.data?.json();
    const notificationTitle = payload?.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload?.notification?.body || 'You have a new message.',
        icon: 'https://i.postimg.cc/J0LFkY8Z/logo.jpg'
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});