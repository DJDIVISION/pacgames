importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging.js');

// Initialize Firebase inside the service worker
firebase.initializeApp({
        apiKey: "AIzaSyCyNHnR2UfeplO8JYiXtmpAFiPGhSObxtY",
        authDomain: "pacton-4b97c.firebaseapp.com",
        projectId: "pacton-4b97c",
        storageBucket: "pacton-4b97c.firebasestorage.app",
        messagingSenderId: "801656402140",
        appId: "1:801656402140:web:420ee4c0e0431bf0d74419",
        measurementId: "G-BN49G6Z1WG"
});

const messaging = firebase.messaging();

// Background message handler for FCM
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || '/icon-96x96.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});