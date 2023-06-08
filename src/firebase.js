import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore';
import 'firebase/database';

const app = firebase.initializeApp({
  apiKey: "AIzaSyBckw2d0iq10kAqCIta-_jFSONm1YO-WZI",
  authDomain: "credchain-unsw.firebaseapp.com",
  databaseURL: "https://credchain-unsw-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "credchain-unsw",
  storageBucket: "credchain-unsw.appspot.com",
  messagingSenderId: "1028618315",
  appId: "1:1028618315:web:cfd58583f892d3f371f5ce",
  // measurementId: "G-2E4BBDRVFC"
})

export const auth = app.auth()
export const firestore = firebase.firestore()
export const db = firebase.database();
export default app
