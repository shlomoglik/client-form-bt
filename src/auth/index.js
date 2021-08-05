// auth/index.js
import firebase from 'firebase/app';

export const loginWithEmailPassword = (email, password) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

export const loginWithGoogle = (useRedirect = false) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  if (useRedirect) {
    return auth.signInWithRedirect(provider);
  } else {
    return auth.signInWithPopup(provider);
  }
};

export const logout = () => firebase.auth().signOut();