import React from 'react';
import { ApolloProvider } from 'react-apollo';
import Navbar from './Navbar';
import client from '../gqlClient';
import mainRoutes from '../mainRoutes';

const App = () => (
  <ApolloProvider client={client}>
    <main>
      <div>
        <Navbar />
        <div className="container" id="content">
          {mainRoutes}
        </div>
      </div>
    </main>
  </ApolloProvider>
);

export default App;
