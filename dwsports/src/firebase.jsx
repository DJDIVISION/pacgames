// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, messaging };