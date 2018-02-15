import React from 'react';
import { graphql, compose } from 'react-apollo';
import EmployeeHome from './EmployeeHome';
import { updateAuthModal } from '../utilities/auth/graphql/authMutations';
import { getUser } from '../utilities/auth/graphql/authQueries';

const Homepage = (props) => {
  if (!props.user.loggedIn) {
    return (
      <div>
        Welcome to City of Asheville Employee Check-in. Please&nbsp;
        <a
          href="#" onClick={(e) => {
            e.preventDefault();
            props.updateAuthModal({
              variables: {
                open: true,
              },
            });
          }}
          className=""
        >log in</a>.
      </div>
    );
  }
  if (props.user.loggedIn && !props.user.email.endsWith('ashevillenc.gov')) {
    return (<div>Invalid user</div>);
  }
  return (<EmployeeHome {...props} />);
};

export default compose(
  graphql(updateAuthModal, { name: 'updateAuthModal' }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(Homepage);
