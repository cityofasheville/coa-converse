import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
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
  <ApolloConsumer>
    {
      (client) => {
        const user = client.readQuery({ query: GET_USER_INFO });
        return (<div>
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
                {user && <AuthControl />}
              </div>
            </div>
          </nav>
        </div>);
      }
    }
  </ApolloConsumer>
);

export default Navbar;
