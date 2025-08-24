
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "codestreak-nt534",
  "appId": "1:1036667244069:web:a336a968898420665939cc",
  "storageBucket": "codestreak-nt534.firebasestorage.app",
  "apiKey": "AIzaSyBYtzQ1BP-HcADSG0GLyEnPRJWvQTgII4w",
  "authDomain": "codestreak-nt534.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1036667244069"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
