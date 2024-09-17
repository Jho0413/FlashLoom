import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "flashloom.firebaseapp.com",
  projectId: "flashloom",
  storageBucket: "flashloom.appspot.com",
  messagingSenderId: "924924595515",
  appId: "1:924924595515:web:175c5f31d8a0890c5ffb1e",
  measurementId: "G-NGJGC5GT1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db};