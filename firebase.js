import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDHprDNv9eUQxQF6uC4ob6YMrTtnRniUuQ",
  authDomain: "whatsapp-2-8cb21.firebaseapp.com",
  projectId: "whatsapp-2-8cb21",
  storageBucket: "whatsapp-2-8cb21.appspot.com",
  messagingSenderId: "65017500372",
  appId: "1:65017500372:web:b5461994f2e01cbc2c6141",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
