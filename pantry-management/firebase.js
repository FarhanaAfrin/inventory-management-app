// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASx_0k6vX1cinbAyHsAhZiHYgF5NOkv9M",
  authDomain: "inventory-management-a6cf2.firebaseapp.com",
  projectId: "inventory-management-a6cf2",
  storageBucket: "inventory-management-a6cf2.appspot.com",
  messagingSenderId: "161248626125",
  appId: "1:161248626125:web:4d329b241fad2318daf084",
  measurementId: "G-WN3SFHBPWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };