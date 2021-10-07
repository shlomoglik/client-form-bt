// auth/index.js
import * as firebase from 'firebase'

export const auth = firebase.default.auth()

export const loginWithEmailPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const loginWithGoogle = (useRedirect = false) => {
  const provider = new auth.GoogleAuthProvider();
  if (useRedirect) {
    return auth.signInWithRedirect(provider);
  } else {
    return auth.signInWithPopup(provider);
  }
};

export const logout = () => auth.signOut();

