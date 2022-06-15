import React from 'react';
import { Query, Mutation } from 'react-apollo';
import EmployeeHome from './EmployeeHome';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';
import { UPDATE_AUTHMODAL } from '../utilities/auth/graphql/authMutations';
import { getUser } from '../utilities/auth/graphql/authQueries';

const Homepage = props => (
  <Query query={getUser}>
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      if (!data.user.loggedIn) {
        return (
          <Mutation mutation={UPDATE_AUTHMODAL}>
            {updateAuthModal => (
              <div>
                Welcome to City of Asheville Employee Check-in. Please&nbsp;
                <a
                  href="#" onClick={(e) => {
                    e.preventDefault();
                    updateAuthModal({
                      variables: {
                        open: true,
                      },
                    });
                  }}
                  className=""
                >log in</a>.
                <p><span style={{ color: '#ef6601', fontStyle: 'italic' }}>Remember to use Chrome or Firefox. IE is not yet supported.</span></p>
              </div>
            )}
          </Mutation>
        );
      }
      if (data.user.loggedIn && !data.user.email.endsWith('ashevillenc.gov')) {
        return (<div>Invalid user: You must log in with an ashevillenc.gov account.</div>);
      }
      return (<EmployeeHome {...props} />);
    }}
  </Query>
);

export default Homepage;
