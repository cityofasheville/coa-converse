import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginLinkClicked } from './authActions';

const AuthControl = (props) => {
  const displayName = (props.user.name) ? props.user.name : props.user.email;

  if (props.user.loggedIn === true) {
    return (
      <div>
        Logged in as <i>{displayName}</i>
        <br />
        <a className="pull-right" onClick={(e) => { e.preventDefault(); props.user.logout(props.dispatch); }} role="button" >Sign out</a>
      </div>
    );
  }

  return (
    <div>
      <a href="#" onClick={(e) => { e.preventDefault(); props.dispatch(loginLinkClicked()); }} className="">Log in</a>
    </div>
  );
};

AuthControl.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => (
  {
    user: state.auth.user,
  }
);

const mapDispatchToProps = dispatch => (
  {
    dispatch,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AuthControl);
