import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import EmployeeHome from './EmployeeHome';
import { GET_USER_INFO } from '../app/Queries';

const Home = props => (
  <ApolloConsumer>
    {
      (client) => {
        const user = client.readQuery({ query: GET_USER_INFO });
        if (!user.user.email || localStorage.getItem('loggedIn') === false) {
          return (
            <div>
              Welcome to City of Asheville Employee Check-in. Please log in at top right.
            </div>
          );
        }
        if (user.user.email && !user.user.email.trim().endsWith('ashevillenc.gov')) {
          return (<div>Invalid user</div>);
        }
        return (<EmployeeHome {...props} />);
      }
    }
  </ApolloConsumer>
);

export default Home;
