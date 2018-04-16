import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Error = props => (
  <div className="alert alert-danger alert-sm">
    <p>
      There was an error reaching the server. Please contact the Help Desk at x4000 or <a href="mailto:help@ashevillenc.gov" target="_blank" style={{ color: '#fff', textDecoration: 'underline' }}>help@ashevillenc.gov</a>.
    </p>
    <p>
      Time: {moment().format('M/DD/YYYY HH:mm:ss Z')} UTC
    </p>    
    <p>
      <span>Error details: </span>{props.message}
    </p>
  </div>
);

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
