// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
//import { getAnalytics } from "firebase/analytics"

import * as Firestore from "firebase/firestore"

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
export const firebaseDB = Firestore.getFirestore()


export function getCollection<T>(path: string) {
  return Firestore.collection(firebaseDB, path) as Firestore.CollectionReference<T>
}

export async function deleteDocument(collectionPath: string, id: string) {
  const doc = Firestore.doc(firebaseDB, `${collectionPath}/${id}`)

  const result = await Firestore.deleteDoc(doc)
  return result
}
export async function updateDocument<T extends Record<string, any>>(collectionPath: string, id: string, data: T) {
  const doc = Firestore.doc(firebaseDB, `${collectionPath}/${id}`)

  await Firestore.updateDoc(doc, data)
}
export async function addDocument<T extends Record<string, any>>(collectionPath: string, data: T) {
  const result = await Firestore.addDoc(getCollection(collectionPath),data)
  console.log(result)
  return result.id
}
