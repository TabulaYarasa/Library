import { initializeApp } from "firebase/app";
import { getFirestore, } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// // firebase.ts
// import firebase from "firebase/compat/app"
// import "firebase/compat/auth"
// import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4UH5x0_H6bTqqcc7VfJd0tjjC_gFpIxE",
  authDomain: "my-book-project-4cf0f.firebaseapp.com",
  projectId: "my-book-project-4cf0f",
  storageBucket: "my-book-project-4cf0f.appspot.com",
  messagingSenderId: "312717171179",
  appId: "1:312717171179:web:153e2b22f1cd9e017021ae",
};

const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

//export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
 export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
   persistence: getReactNativePersistence(AsyncStorage)
  });
//export const FIREBASE_AUTH =getAuth()


// if(!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }


// const auth = firebase.auth();
// const db = firebase.firestore();

// export {auth, db}
