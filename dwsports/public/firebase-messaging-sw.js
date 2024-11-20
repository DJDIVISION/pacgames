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

self.addEventListener('notificationclick', (event) => {
    console.log('Notification click Received.', event);
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://pactongamingzone.onrender.com/') // Change to your app's landing page
    );
});

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Background Message received:', payload);

    const { title, body, icon } = payload.notification;

    // Display the notification
    self.registration.showNotification(title, {
        body,
        icon: icon || 'https://i.postimg.cc/T3H2R0LV/icon-48x48.png', // Ensure this is Android-compatible
        vibrate: [200, 100, 200], // Optional vibration pattern
        actions: [
            { action: 'https://pactongamingzone.onrender.com/', title: 'Go to App' }, // Add custom actions if needed
        ],
    });
});