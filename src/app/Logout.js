import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import LogoutCode from './LogoutCode';
import Error from '../shared/Error';
import LoadingAnimation from '../shared/LoadingAnimation';

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

const LOGOUT_CODE = gql`
  mutation logout {
    logout {
      loggedIn
      message
      reason
    }
  }
`;

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true, // weird to set this true ...
      message: 'No message',
      fail: false,
    };
  }

  render() {
    return (
      <Mutation
        mutation={LOGOUT_CODE}
        refetchQueries={() => ([{
          query: GET_USER_INFO,
        }])}
        onCompleted={(data) => {
          this.setState({
            isLoggedIn: data.logout.loggedIn,
            message: data.logout.message,
            fail: data.logout.loggedIn,
          }, () => {
            const { isLoggedIn } = this.state;
            const { history } = this.props;
            if (!isLoggedIn) {
              localStorage.setItem('loggedIn', false);
              history.push('/');
            }
          });
        }}
      >
        {
          (logout, { data, error }) => {
            const { isLoggedIn, message, fail } = this.state;
            return (
              <div>
                <LogoutCode
                  logout={logout}
                  loggedIn={isLoggedIn}
                >
                  <div>
                    {
                      fail // eslint-disable-line no-nested-ternary
                        ? <Error message={message} />
                        : isLoggedIn
                          ? <LoadingAnimation />
                          : <div>You are logged out</div>
                    }
                  </div>
                </LogoutCode>
              </div>
            );
          }
        }
      </Mutation>
    );
  }
}

export default Logout;
