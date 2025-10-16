import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMvZph_lYxKDMUm6w2pzWQogAUKwjFdBE",
  authDomain: "opening-horizons-app.firebaseapp.com",
  projectId: "opening-horizons-app",
  storageBucket: "opening-horizons-app.firebasestorage.app",
  messagingSenderId: "157904727603",
  appId: "1:157904727603:web:d246040568453ec7f1bd46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
