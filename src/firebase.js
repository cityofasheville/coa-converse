import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyAnu_SrM4F1IEiyRCPFAM57ZdY8Hr2EQDA',
  authDomain: 'coa-converse.firebaseapp.com',
  databaseURL: 'https://coa-converse.firebaseio.com',
  projectId: 'coa-converse',
  storageBucket: 'coa-converse.appspot.com',
  messagingSenderId: '305035449131',
};

firebase.initializeApp(config);
export default firebase;
