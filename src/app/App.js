import React from 'react';
import { Query, ApolloProvider } from 'react-apollo';
import Navbar from './Navbar';
import client from '../gqlClient';
import LoadingAnimation from '../shared/LoadingAnimation';
import Error from '../shared/Error';
import { GET_USER_INFO } from '../app/Queries';
import mainRoutes from '../mainRoutes';

const App = () => (
  <ApolloProvider client={client}>
    <main>
      <Query
        query={GET_USER_INFO}
      >
        {({ loading, error }) => {
          if (loading) return <LoadingAnimation />;
          if (error) return <Error message={error.message} />;
          return (
            <div>
              <Navbar />
              <div className="container" id="content">
                {mainRoutes}
              </div>
            </div>
          );
        }}
      </Query>
    </main>
  </ApolloProvider>
);

export default App;
