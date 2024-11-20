importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase configuration (same as your main app)
const firebaseConfig = {
    apiKey: "AIzaSyCyNHnR2UfeplO8JYiXtmpAFiPGhSObxtY",
    authDomain: "pacton-4b97c.firebaseapp.com",
    projectId: "pacton-4b97c",
    storageBucket: "pacton-4b97c.firebasestorage.app",
    messagingSenderId: "801656402140",
    appId: "1:801656402140:web:420ee4c0e0431bf0d74419",
    measurementId: "G-BN49G6Z1WG"
  };

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Background Message received:', payload);

    const { title, body, icon } = payload.notification || {};

    // Display the notification
    self.registration.showNotification(title || 'Notification', {
        body: body || 'You have a new message!',
        icon: icon || 'https://i.postimg.cc/T3H2R0LV/icon-48x48.png', // Default icon fallback
        vibrate: [200, 100, 200], // Vibrate pattern
        tag: 'notification-tag', // Ensures unique tag for replacing existing notifications
        data: {
            url: payload.notification.click_action || 'https://pactongamingzone.onrender.com/', // Fallback URL for action
        },
        actions: [
            {
                action: 'open_url',
                title: 'Go to App',
            },
        ],
    });
});

// Add listener for notification actions
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click Received:', event);

    // Close the notification
    event.notification.close();

    // Handle custom actions
    if (event.action === 'open_url') {
        clients.openWindow(event.notification.data.url);
    } else {
        // Default action if no action is specified
        clients.openWindow('https://pactongamingzone.onrender.com/');
    }
});
