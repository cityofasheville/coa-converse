import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import EmployeeHome from './EmployeeHome';
import LoadingAnimation from '../shared/LoadingAnimation';
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

const Home = props => (
  <Query query={GET_USER_INFO}>
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      if (!data.user.email) {
        return (
          <div>
            Welcome to City of Asheville Employee Check-in. Please log in at top right.
          </div>
        );
      }
      if (data.user.email && !data.user.email.trim().endsWith('ashevillenc.gov')) {
        return (<div>Invalid user</div>);
      }
      return (<EmployeeHome {...props} />);
    }}
  </Query>
);

export default Home;
