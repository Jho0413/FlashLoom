import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyANdssX4hGdcfHvXD52cNqBNp1g7uM4tgE",
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