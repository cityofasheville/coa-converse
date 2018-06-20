import gql from 'graphql-tag';

export const UPDATE_USER = gql`
  mutation updateUser(
    $loggedIn: Boolean
    $privilege: Int
    $name: String
    $email: String
    $provider: String
   ) {
    updateUser(
      loggedIn: $loggedIn
      privilege: $privilege
      name: $name
      email: $email
      provider: $provider
    ) @client {
      loggedIn
      privilege
      name
      email
      provider
    }
  }
`;

export const UPDATE_AUTHMODAL = gql`
  mutation updateAuthModal($open: Boolean) {
    updateAuthModal(open: $open) @client {
      modal
    }
  }
`;

