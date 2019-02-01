import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from '../shared/Error';

const GET_USER_INFO = gql`
  query user {
    user {
      id,
      name,
      email,
      position,
      department,
      division,
      supervisor_id,
      supervisor,
      supervisor_email,
    }
  }
`;

const saveLocationThenLogin = (location) => {
  localStorage.setItem('preLoginPathname', location.pathname);
  localStorage.setItem('preLoginSearch', location.search);
  window.location = process.env.REACT_APP_COGNITO_LOGIN;
};

const AuthControl = (props) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const { location } = props;

  return (
    <Query
      query={GET_USER_INFO}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <div class="alert alert-danger">Error</div>;
        if (loggedIn) {
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
      }}
    </Query>
  );
};

export default AuthControl;
