import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../shared/LoadingAnimation';
import Icon from '../shared/Icon';
import { IM_PENCIL7 } from '../shared/iconConstants';
import AuthControl from './AuthControl';

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

export const Navbar = () => (
  <Query
    query={GET_USER_INFO}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      return (
        <div>
          <nav
            className="navbar navbar-default"
            style={{ backgroundColor: '#f6fcff'}}
          >
            <div className="container-fluid">
              <div
                className="pull-left"
                style={{
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              >
                <a href="/">
                  <img
                    src={require('./citylogo-flatblue.png')}
                    width="80px"
                    height="80px"
                    alt="City of Asheville logo"
                  ></img>
                </a>
              </div>
              <div className="navbar-header">
                <div className="pull-left">
                  <a href="/" className="navbar-brand nounderline" >
                    <span style={{ fontSize: '30px', marginBottom: '-10px' }}>Employee Check-in
                    </span>
                    <br />
                    <span style={{ fontStyle: 'italic', fontSize: '13px' }}>City of Asheville, NC</span>
                  </a>
                </div>
              </div>
              <div className="pull-right" style={{ paddingTop: '15px' }}>
                <AuthControl />
                {data.user.loggedIn &&
                  <div style={{ clear: 'both' }}>
                    <a href="https://goo.gl/forms/iM81K4CIW3ZC1LM22" target="_blank" style={{ float: 'right', color: '#bf1bbf', fontStyle: 'italic', fontSize: '16px' }}><Icon path={IM_PENCIL7} size={18} />Give feedback</a>
                  </div>
                }
              </div>
            </div>
          </nav>
        </div>
      );
    }}
  </Query>
);

export default Navbar;
