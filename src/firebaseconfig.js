  
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAtCYcz-w8Ne2yJWI4ioNfIsLe-tLnyxV0",
    authDomain: "sistemainquilinos.firebaseapp.com",
    projectId: "sistemainquilinos",
    storageBucket: "sistemainquilinos.appspot.com",
    messagingSenderId: "777023799972",
    appId: "1:777023799972:web:fa8fe66782a15da1315c31",
    measurementId: "G-YETEHK2Q1M"
  };
  // Initialize Firebase
  const fire = firebase.initializeApp(firebaseConfig);
  export const auth = fire.auth()
  export const db = fire.firestore()
