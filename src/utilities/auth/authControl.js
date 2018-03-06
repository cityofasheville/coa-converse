
import React from 'react';
import firebase from 'firebase';
import { graphql, compose, withApollo } from 'react-apollo';
import { getUser, getModalOpen } from './graphql/authQueries';
import { updateUser, updateAuthModal } from './graphql/authMutations';
import { defaultAuthState } from './graphql/authDefaultState';

const AuthControl = (props) => {
  const displayName = (props.user.name) ? props.user.name : props.user.email;

  if (props.user.loggedIn === true) {
    return (
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
              props.updateUser({
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
    );
  }

  return (
    <div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          props.updateAuthModal({
            variables: {
              open: !props.modalOpen,
            },
          });
        }}
        className=""
      >
        Log In
      </a>
    </div>
  );
};

const AuthControlComposed = compose(
  graphql(updateAuthModal, { name: 'updateAuthModal' }),
  graphql(updateUser, { name: 'updateUser' }),
  graphql(getModalOpen, {
    props: ({ data: { modal } }) => ({
      modalOpen: modal.open,
    }),
  }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(AuthControl);

export default withApollo(AuthControlComposed);
