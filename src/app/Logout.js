import React from 'react';
import gql from 'graphql-tag';
import { Mutation, ApolloConsumer } from 'react-apollo';
import LogoutCode from './LogoutCode';
import Error from '../shared/Error';
import LoadingAnimation from '../shared/LoadingAnimation';
import { browserHistory } from 'react-router';

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
      <ApolloConsumer>
        {client => (
          <Mutation
            mutation={LOGOUT_CODE}
            onCompleted={(data) => {
              this.setState({
                isLoggedIn: data.logout.loggedIn,
                message: data.logout.message,
                fail: data.logout.loggedIn,
              }, () => {
                const { isLoggedIn } = this.state;
                if (!isLoggedIn) {
                  localStorage.setItem('loggedIn', false);
                  client.resetStore().then(() => {
                    browserHistory.push('/');
                  });
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
                            : <div></div>
                      }
                    </div>
                  </LogoutCode>
                </div>
              );
            }
          }
          </Mutation>
      )}
      </ApolloConsumer>
    );
  }
}

export default Logout;
