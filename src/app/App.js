
import React from 'react';
import firebase from 'firebase';
import firebaseui from 'firebaseui';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import { updateUser } from '../utilities/auth/graphql/authMutations';
import { getUser } from '../utilities/auth/graphql/authQueries';
import Navbar from './Navbar';
import AuthProviderModal from '../utilities/auth/authProviderModal';
import { defaultAuthState } from '../utilities/auth/graphql/authDefaultState';

const authProviders = [
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //firebase.auth.EmailAuthProvider.PROVIDER_ID,
];

const initializeFirebaseAuthUI = () => {
  // Initialize the FirebaseUI Widget using Firebase.
  const authUi = new firebaseui.auth.AuthUI(firebase.auth());

  // The start method will wait until the DOM is loaded.
  authUi.start('#firebaseui-auth-container', {
    signInSuccessUrl: '/',
    signInOptions: authProviders,
    signInFlow: 'popup',
    // TODO:  Terms of service url.
  });
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
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
        user.getIdToken()
          .then((token) => {
            localStorage.setItem('token', token);
            this.props.updateUser({
              variables: {
                loggedIn: true,
                privilege: user.email.endsWith('ashevillenc.gov') ? 2 : 0,
                name: user.displayName,
                email: user.email,
                provider: user.providerData[0].providerId,
              },
            });
          }, (error) => {
            console.log(`TOKEN ERROR: ${JSON.stringify(error)}`);
          });
      } else {
        const defaultUser = defaultAuthState.user;
        this.props.updateUser({
          variables: {
            loggedIn: defaultUser.loggedIn,
            privilege: defaultUser.privilege,
            name: defaultUser.name,
            email: defaultUser.email,
            provider: defaultUser.provider,
          },
        });
      }
    });

    initializeFirebaseAuthUI();
  }

  render() {
    return (
      <div className="">
        <div id="skip"><a href="#content">Skip to Main Content</a></div>
        {
          <Navbar />
        }
        <div className="container" id="content">
          { this.props.children }
        </div>
        <AuthProviderModal />
      </div>
    );
  }
}


Main.propTypes = {
  children: PropTypes.node,
};

const App = compose(
  graphql(updateUser, { name: 'updateUser' }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(Main);

export default withApollo(App);
