import React from 'react';
import firebase from 'firebase';
import firebaseui from 'firebaseui';
import { browserHistory } from 'react-router';
import { userLoggedIn, userLoggedOut, loginError, logoutError } from './authActions';

const authProviders = [
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //firebase.auth.EmailAuthProvider.PROVIDER_ID,
];

const initializeFirebaseApp = (store) => {
  firebase.initializeApp({
    apiKey: 'AIzaSyAnu_SrM4F1IEiyRCPFAM57ZdY8Hr2EQDA',
    authDomain: 'coa-converse.firebaseapp.com',
    databaseURL: 'https://coa-converse.firebaseio.com',
    projectId: 'coa-converse',
    storageBucket: 'coa-converse.appspot.com',
    messagingSenderId: '305035449131',
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userData = {
        email: user.email,
        name: user.displayName,
        provider: user.providerData[0].providerId,
        // token: null,
        logout: firebaseLogout,
      };
      user.getIdToken(true) /* forceRefresh */
        .then((idToken) => {
          userData.token = idToken;
          sessionStorage.setItem('token', idToken);
          store.dispatch(userLoggedIn(userData));
        }, (error) => {
          store.dispatch(loginError(error));
          console.log(`TOKEN ERROR: ${JSON.stringify(error)}`);
        });
    } else {
      store.dispatch(userLoggedOut());
    }
  });
};

const initializeFirebaseAuthUI = () => {
  // Initialize the FirebaseUI Widget using Firebase.
  const authUi = new firebaseui.auth.AuthUI(firebase.auth());

  // The start method will wait until the DOM is loaded.
  authUi.start('#firebaseui-auth-container', {
    signInSuccessUrl: '/',
    signInOptions: authProviders,
    signInFlow: 'popup',
    // TODO:  Terms of service url.
    tosUrl: '<your-tos-url>',
  });
};

const firebaseLogout = (dispatch) => {
  return firebase.auth().signOut()
    .then(() => {
      dispatch(userLoggedOut());
      browserHistory.push('/');
    }, (error) => {
      dispatch(logoutError(error));
    });
};

export const AuthProviders = () => (
  <div id="firebaseui-auth-container"></div>
);

export const initAuth = (store) => {
  initializeFirebaseApp(store);
  initializeFirebaseAuthUI();
};
