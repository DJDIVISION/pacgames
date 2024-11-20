// firebase.jsx
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken  } from 'firebase/messaging';
import { supabase } from './supabase/client';


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
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register the service worker
export const registerServiceWorker = async () => {
    try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
    }
};

// Get FCM Token
export const getFcmToken = async () => {
  try {
      // Get session from Supabase
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.access_token) {
          throw new Error('No active session or JWT found.');
      }

      const jwt = session.access_token;  // Get Supabase JWT token

      console.log('Using JWT for FCM:', jwt); // Check JWT

      // Request the FCM token without VAPID key
      const token = await getToken(messaging, {
          serviceWorkerRegistration: await navigator.serviceWorker.ready, // Ensure Firebase uses the service worker
          headers: {
              'Authorization': `Bearer ${jwt}`, // Pass JWT for authentication
          },
      });

      if (token) {
          console.log('FCM Token:', token);
          return token;
      } else {
          console.warn('No FCM token available.');
          return null;
      }
  } catch (error) {
      console.error('Error retrieving FCM token:', error);
  }
};

const sendTokenToServer = async (fcmToken) => {
  try {
    const response = await fetch('https://pacgames-roulette-server.onrender.com/send-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcmToken }),
    });

    if (response.ok) {
      console.log('Token sent to server successfully');
    }
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};

// Request notification permission
export const requestPermission = async () => {
  try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
          console.log('Notification permission granted.');
          const token = await getFcmToken();
          if (token) {
            await sendTokenToServer(token);
          }  // Get FCM token after permission is granted
          return token;
      } else {
          console.warn('Notification permission denied.');
          return null;
      }
  } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
  }
};

// Listen for notifications in the foreground
export const listenForNotifications = () => {
  onMessage(messaging, (payload) => {
      console.log('Foreground Message received. ', payload);
      alert(payload.notification.title + ": " + payload.notification.body); // Display notification here
  });
};

export const handleForegroundNotifications = () => {
  onMessage(messaging, (payload) => {
    console.log('Foreground notification received:', payload);

    // Extract notification data
    const { title, body, icon } = payload.notification;

    // Use a fallback icon if the payload doesn't include one
    const notificationIcon = icon || "https://i.postimg.cc/T3H2R0LV/icon-48x48.png";

    // Create and display a notification
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: notificationIcon,
      });
    } else {
      console.warn('Notification permission not granted.');
    }
  });
};

export const unsubscribeFromNotifications = async () => {
  try {
    const messaging = getMessaging();
    
    // Delete the FCM token
    await deleteToken(messaging);
    
    console.log('Unsubscribed from notifications');
    
    // Optionally, also revoke notification permission
    if (Notification.permission === 'granted') {
      // The user can manually disable notifications through the browser or app settings
      console.log('You can manually disable notifications through your browser or app settings');
    }
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
  }
};