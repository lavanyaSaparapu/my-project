
import { getAuth } from "firebase/auth";



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSlvdZZEfFGp77RW89hKeeH7zuCsldkPA",
  authDomain: "fir-auth-f1676.firebaseapp.com",
  projectId: "fir-auth-f1676",
  storageBucket: "fir-auth-f1676.firebasestorage.app",
  messagingSenderId: "589894105974",
  appId: "1:589894105974:web:78dd053aa336f5b4e81857",
  measurementId: "G-D4GEB1Q1N7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
