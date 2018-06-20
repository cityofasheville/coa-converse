
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { UPDATE_USER, UPDATE_AUTHMODAL } from './graphql/authMutations';
import { defaultAuthState } from './graphql/authDefaultState';

const GET_USER_MODAL_INFO = gql`
  query getUserModalInfo {
    user @client {
      loggedIn
      privilege
      name
      email
      provider
    }
    modal @client {
      open
    }
  }
`;

const AuthControl = () => (
  <Query query={GET_USER_MODAL_INFO}>
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      const displayName = (data.user.name) ? data.user.name : data.user.email;
      if (data.user.loggedIn === true) {
        return (
          <Mutation mutation={UPDATE_USER}>
            {updateUser => (
              <div>
                Logged in as <i>{displayName}</i>
                <br />
                <a
                  className="pull-right"
                  onClick={(e) => {
                    e.preventDefault();
                    firebase.auth().signOut()
                    .then(() => {
                      const defaultUser = defaultAuthState.user;
                      updateUser({
                        variables: {
                          loggedIn: defaultUser.loggedIn,
                          privilege: defaultUser.privilege,
                          name: defaultUser.name,
                          email: defaultUser.email,
                          provider: defaultUser.provider,
                        },
                      });
                    }, (error) => {
                      console.log(error);
                    });
                  }}
                  role="button"
                >Sign out</a>
              </div>
            )}
          </Mutation>
        );
      }

      return (
        <Mutation mutation={UPDATE_AUTHMODAL}>
          {updateAuthModal => (
            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  updateAuthModal({
                    variables: {
                      open: !data.modal.modalOpen,
                    },
                  });
                }}
                className=""
              >
                Log In
              </a>
            </div>
          )}
        </Mutation>
      );
    }}
  </Query>
);

export default AuthControl;

