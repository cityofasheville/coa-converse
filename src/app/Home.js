import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EmployeeHome from './EmployeeHome';
import { loginLinkClicked } from '../utilities/auth/authActions';

const Homepage = props => (
  <div>
    {!props.user.loggedIn &&
      <div>
        Welcome to City of Asheville Conversations. Please <a href="#" onClick={(e) => { e.preventDefault(); props.dispatch(loginLinkClicked()); }} className="">log in</a>.
      </div>
    }
    {props.user.loggedIn && !props.user.email.endsWith('ashevillenc.gov') &&
      <div>Invalid user</div>
    }
    {props.user.loggedIn && props.user.email.endsWith('ashevillenc.gov') &&
      <EmployeeHome {...props} />
    }
  </div>
);

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