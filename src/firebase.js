import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyD8KUAfTAUvwUOOIb8rVPeb8UCMPpjEfuE",
  authDomain: "twittie-59f54.firebaseapp.com",
  databaseURL: "https://twittie-59f54.firebaseio.com",
  projectId: "twittie-59f54",
  storageBucket: "twittie-59f54.appspot.com",
  messagingSenderId: "714145250451",
  appId: "1:714145250451:web:4a23488246591c0e942166",
  measurementId: "G-46LTZ0HGY8"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export {auth, provider }

export default db