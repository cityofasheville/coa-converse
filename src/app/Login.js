import React from 'react';
import gql from 'graphql-tag';
import queryString from 'query-string';
import { Mutation, graphql } from 'react-apollo';
import RegisterCode from './RegisterCode';
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

const REGISTER_CODE = gql`
  mutation registerCode($code: String!, $redirect_uri: String!) {
    registerCode(code: $code, redirect_uri: $redirect_uri) {
      loggedIn
      message
      reason
    }
  }
`;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      message: 'No message',
      fail: false,
    };
  }

  render() {
    const {
      location: {
        search,
      },
      history,
    } = this.props;
    const { code } = queryString.parse(search);
    return (
      <Mutation
        mutation={REGISTER_CODE}
        refetchQueries={() => ([{
          query: GET_USER_INFO,
        }])}
        awaitRefetchQueries
        onCompleted={(data) => {
          this.setState({
            isLoggedIn: data.registerCode.loggedIn,
            message: data.registerCode.message,
            fail: !data.registerCode.loggedIn,
          }, () => {
            const { isLoggedIn } = this.state;
            if (isLoggedIn) {
              localStorage.setItem('loggedIn', true);
              const priorPath = localStorage.getItem('preLoginPathname');

              if (priorPath) {
                if (priorPath !== '/login') {
                  const priorSearch = localStorage.getItem('preLoginSearch');
                  if (priorSearch) {
                    browserHistory.push(`${priorPath}${priorSearch}`);
                  } else {
                    browserHistory.push(priorPath);
                  }
                }
              } else {
                browserHistory.push('/')
              }
            }
          });
        }}
      >
        {
          (registerCode, { data, error }) => {
            const { isLoggedIn, message } = this.state;
            return (
              <div>
                <RegisterCode
                  registerCode={registerCode}
                  code={code}
                  redirect_uri={process.env.REDIRECT_URI}
                  loggedIn={isLoggedIn}
                >
                  <div>
                    {this.state.fail ? // eslint-disable-line
                      <Error message={message} />
                      : isLoggedIn
                        ? (
                          <div>You are logged In</div>
                        )
                        : <LoadingAnimation />
                    }
                  </div>
                </RegisterCode>
              </div>
            );
          }
        }
      </Mutation>
    );
  }
}

export default graphql(GET_USER_INFO, { name: 'userInfo' })(Login);
