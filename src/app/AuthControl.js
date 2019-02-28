import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { GET_USER_INFO } from '../app/Queries';

const saveLocationThenLogin = (location) => {
  localStorage.setItem('preLoginPathname', location.pathname);
  localStorage.setItem('preLoginSearch', location.search);
  window.location = process.env.REACT_APP_COGNITO_LOGIN;
};

const AuthControl = () => (
  <ApolloConsumer>
    {
      (client) => {
        const user = client.readQuery({ query: GET_USER_INFO });
        if (user.user.id !== null) {
          return (
            <a href={process.env.REACT_APP_COGNITO_LOGOUT}>Log out</a>
          );
        }
        return (
          <a
            href={process.env.REACT_APP_COGNITO_LOGIN}
            onClick={() => saveLocationThenLogin(location)}
          >
            Log in
          </a>
        );
      }
    }
  </ApolloConsumer>
);

export default AuthControl;
