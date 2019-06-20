import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9aPtiWZHjKxT4fb_ar9R9MjKIeo9T7Oc",
  authDomain: "banding-harga.firebaseapp.com",
  databaseURL: "https://banding-harga.firebaseio.com",
  projectId: "banding-harga",
  storageBucket: "banding-harga.appspot.com",
  messagingSenderId: "134263493458",
  appId: "1:134263493458:web:079c959866cc66db"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
