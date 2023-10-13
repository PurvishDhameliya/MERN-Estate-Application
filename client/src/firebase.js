// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "estate-application.firebaseapp.com",
  projectId: "estate-application",
  storageBucket: "estate-application.appspot.com",
  messagingSenderId: "743457788389",
  appId: "1:743457788389:web:0d95fbe6da4d42af1e1f0c",
  measurementId: "G-N2X6GS6BYE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

