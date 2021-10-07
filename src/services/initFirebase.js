import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDHpUO08qfO43u78AVHS8MKi8Wt6Tnd3jc",
  authDomain: "files-directory.firebaseapp.com",
  projectId: "files-directory",
  storageBucket: "files-directory.appspot.com",
  messagingSenderId: "399103769387",
  appId: "1:399103769387:web:7343fe2ed8c3561d86a36e",
};
export const fbApp = firebase.initializeApp(firebaseConfig);