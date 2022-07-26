import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';  
 
const firebaseConfig = {
    apiKey: "AIzaSyALtz39hyFUk9t87zQrARA4ki5ZcPLTBck",
    authDomain: "pwa-project-beb8e.firebaseapp.com",
    projectId: "pwa-project-beb8e",
    storageBucket: "pwa-project-beb8e.appspot.com",
    messagingSenderId: "197133559991",
    appId: "1:197133559991:web:6460400069585aa9c2c532",
    measurementId: "G-YB5HXD1VW0"
  };

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)