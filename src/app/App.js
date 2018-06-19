
import React from 'react';
import firebaseui from 'firebaseui';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import firebase from '../firebase';
import { UPDATE_USER, UPDATE_AUTHMODAL } from '../utilities/auth/graphql/authMutations';
import { getUser } from '../utilities/auth/graphql/authQueries';
import Navbar from './Navbar';
import AuthProviderModal from '../utilities/auth/authProviderModal';
import { defaultAuthState } from '../utilities/auth/graphql/authDefaultState';

const authProviders = [
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //firebase.auth.EmailAuthProvider.PROVIDER_ID,
];

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUi: new firebaseui.auth.AuthUI(firebase.auth()),
    };
  }

  componentDidMount() {
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

    if (document.getElementById('firebaseui-auth-container').children.length === 0) {
      // The start method will wait until the DOM is loaded.
      this.state.authUi.start('#firebaseui-auth-container', {
        signInOptions: authProviders,
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: () => {
            this.props.updateAuthModal({
              variables: {
                open: false,
              },
            });
            return false;
          },
        },
        // TODO:  Terms of service url.
      });
    }
  }

  componentDidUpdate() {
    if (document.getElementById('firebaseui-auth-container').children.length === 0) {
      this.state.authUi.start('#firebaseui-auth-container', {
        signInOptions: authProviders,
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: () => {
            this.props.updateAuthModal({
              variables: {
                open: false,
              },
            });
            return false;
          },
        },
        // TODO:  Terms of service url.
      });
    }
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
  graphql(UPDATE_USER, { name: 'updateUser' }),
  graphql(UPDATE_AUTHMODAL, { name: 'updateAuthModal' }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(Main);

export default withApollo(App);
