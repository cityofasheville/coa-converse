import gql from 'graphql-tag';

export const GET_USER_INFO = gql`
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