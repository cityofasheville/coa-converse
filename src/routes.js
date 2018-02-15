import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';

// GraphQL Client
import { client } from './gqlClient';

// Routed components
import App from './app/App';
import Home from './app/Home';
import Reviews from './app/Reviews';
import ReviewContainer from './app/ReviewContainer';

const Routes = () => (
  <ApolloProvider client={client} >
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="check-ins" component={Reviews}></Route>
        <Route path="check-in" component={ReviewContainer}></Route>
      </Route>
    </Router>
  </ApolloProvider>
);

export default Routes;

