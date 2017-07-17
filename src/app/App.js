import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';

import AuthProviderModal from '../utilities/auth/authProviderModal';

const App = props => (
  <div className="">
    <div id="skip"><a href="#content">Skip to Main Content</a></div>
    {
      <Navbar />
    }
    <div className="container" id="content">
      { props.children }
    </div>
    <AuthProviderModal />
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
