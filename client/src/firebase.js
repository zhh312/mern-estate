// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8f972.firebaseapp.com",
  projectId: "mern-estate-8f972",
  storageBucket: "mern-estate-8f972.appspot.com",
  messagingSenderId: "542078115921",
  appId: "1:542078115921:web:867e51f34d7f652d6a1870",
  measurementId: "G-QZSYCV610E",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
