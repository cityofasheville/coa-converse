import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getModalOpen } from './graphql/authQueries';
import { UPDATE_AUTHMODAL } from './graphql/authMutations';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';

const AuthProviderModal = () => (
  <Query query={getModalOpen}>
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      const display = (data.modal.open) ? { display: 'block' } : { display: 'none' };

      return (
        <Mutation mutation={UPDATE_AUTHMODAL}>
          {updateAuthModal => (
            <div className="">
              <div className="modal fade in" style={display} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => updateAuthModal({
                          variables: {
                            open: !data.modal.open,
                          },
                        })}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div id="firebaseui-auth-container"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Mutation>
      );
    }}
  </Query>
);

export default AuthProviderModal;
