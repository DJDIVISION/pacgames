// Import Firebase Messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyNHnR2UfeplO8JYiXtmpAFiPGhSObxtY",
  authDomain: "pacton-4b97c.firebaseapp.com",
  projectId: "pacton-4b97c",
  storageBucket: "pacton-4b97c.firebasestorage.app",
  messagingSenderId: "801656402140",
  appId: "1:801656402140:web:420ee4c0e0431bf0d74419",
  measurementId: "G-BN49G6Z1WG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Cache version
const CACHE_NAME = 'mini-app-cache-v2';

// List of files to cache
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/main.js',
    '/dist/assets'
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Pre-caching assets...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`[Service Worker] Deleting old cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// Fetch event: Serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
                return cachedResponse;
            }

            console.log(`[Service Worker] Fetching from network: ${event.request.url}`);
            return fetch(event.request).then((networkResponse) => {
                // Optionally cache new responses
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch((error) => {
            console.error('[Service Worker] Fetch error:', error);
            return new Response('Network error occurred.', { status: 408 });
        })
    );
});

// Firebase: Listen for background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Received background message', payload);

    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
        body: payload.notification?.body || "You have a new message.",
        icon: payload.notification?.icon || '/default-icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Push event: Optional custom handling for push events
self.addEventListener('push', (event) => {
    const payload = event.data?.json();

    if (payload) {
        console.log('[Service Worker] Push event payload:', payload);

        const notificationTitle = payload.notification?.title || "Hello!";
        const notificationOptions = {
            body: payload.notification?.body || "You have a new update.",
            icon: payload.notification?.icon || '/default-icon.png'
        };

        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    }
});

// Notification click event: Handle clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click received:', event.notification);

    event.notification.close();

    // Open a specific URL
    event.waitUntil(
        clients.openWindow('/') // Replace with a specific URL if needed
    );
});
