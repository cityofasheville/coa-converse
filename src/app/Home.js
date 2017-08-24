import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EmployeeHome from './EmployeeHome';
import { loginLinkClicked } from '../utilities/auth/authActions';
import LoadingAnimation from '../shared/LoadingAnimation';

const Homepage = (props) => {
  if (!props.user.loggedIn) {
    return (
      <div>
        Welcome to City of Asheville Conversations. Please <a href="#" onClick={(e) => { e.preventDefault(); props.dispatch(loginLinkClicked()); }} className="">log in</a>.
      </div>
    );
  }
  if (props.user.loggedIn && !props.user.email.endsWith('ashevillenc.gov')) {
    return (<div>Invalid user</div>);
  }
  return (<EmployeeHome {...props} />);
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

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);