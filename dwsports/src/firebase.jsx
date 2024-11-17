import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCyNHnR2UfeplO8JYiXtmpAFiPGhSObxtY",
  authDomain: "pacton-4b97c.firebaseapp.com",
  projectId: "pacton-4b97c",
  storageBucket: "pacton-4b97c.firebasestorage.app",
  messagingSenderId: "801656402140",
  appId: "1:801656402140:web:420ee4c0e0431bf0d74419",
  measurementId: "G-BN49G6Z1WG"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BOZwMhEq3agdeylLqybhzZvqGyILZzQabLuRvuE0uhUilpNxMh23xs09WTYEwHqr7ztSMwzluynjXVNP5GTj87w",
    });
    console.log("User token:", token);
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
