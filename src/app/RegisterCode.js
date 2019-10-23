import React from 'react';

class RegisterCode extends React.Component {
  componentDidMount() {
    const { loggedIn, registerCode, code } = this.props;
    if (!loggedIn) {
      registerCode(
        {
          variables: {
            code,
            redirect_uri: process.env.REDIRECT_URI,
          },
        }
      );
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default RegisterCode;
