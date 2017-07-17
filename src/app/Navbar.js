import React from 'react';
import { IndexLink, Link } from 'react-router';
import Icon from '../shared/Icon';
import { IM_SEARCH } from '../shared/iconConstants';
import AuthControl from '../utilities/auth/authControl';

export const Navbar = (props) => (
  <div>
    <nav className="navbar navbar-default" style={{ backgroundColor: '#f6fcff'}}>
      <div className="container-fluid">
        <div className="pull-left" style={{ marginRight: '5px', marginTop: '5px', marginBottom: '5px' }}>
          <IndexLink to="/"><img src={require('./citylogo-flatblue.png')} width="80px" height="80px" alt="City of Asheville logo"></img></IndexLink>
        </div>
        <div className="navbar-header">
          <div className="pull-left">
            <IndexLink to="/" className="navbar-brand" style={{ fontSize: '30px', marginBottom: '-10px' }}>Talent Development Conversations</IndexLink>
            <br />
            <a href="http://www.ashevillenc.gov" target="_blank" style={{ fontSize: '12px', fontStyle: 'italic' }}>City of Asheville, NC</a>
          </div>
        </div>
        <div className="pull-right" style={{ paddingTop: '15px' }}>
          <AuthControl />
        </div>
      </div>
    </nav>
  </div>
);

export default Navbar;
