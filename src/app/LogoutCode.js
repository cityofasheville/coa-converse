import React from 'react';

class LogoutCode extends React.Component {
  componentDidMount() {
    const { logout } = this.props;
    logout();
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default LogoutCode;
