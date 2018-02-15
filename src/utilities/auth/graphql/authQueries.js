import gql from 'graphql-tag';

export const getUser = gql`
  query getUser {
    user @client {
      loggedIn
      privilege
      name
      email
      provider
    }
  }
`;

export const getModalOpen = gql`
  query getModalOpen {
    modal @client {
      open
    }
  }
`;

