// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
//import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB-ohqP3FPY3bHrwWYNGMibTo3jcsgToYE",
  authDomain: "sladai.firebaseapp.com",
  projectId: "sladai",
  storageBucket: "sladai.appspot.com",
  messagingSenderId: "334516557329",
  appId: "1:334516557329:web:8b6a71475451ce1d2343b0",
  measurementId: "G-20F415G4H6"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const firebaseDB = getFirestore()