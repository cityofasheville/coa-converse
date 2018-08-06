import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';


// GraphQL Client
import { client } from './gqlClient';

// Google Analytics
import ReactGA from 'react-ga';

// Routed components
import App from './app/App';
import Home from './app/Home';
import Reviews from './app/Reviews';
import ReviewContainer from './app/ReviewContainer';

let logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname + window.location.search);
};

if (window.location.href.indexOf('dev') === -1
  && (window.location.href.indexOf('check-in.ashevillenc.gov') > -1 ||
  window.location.href.indexOf('checkin.ashevillenc.gov') > -1 ||
  window.location.href.indexOf('checkins.ashevillenc.gov') > -1)
) {
  ReactGA.initialize('UA-16340971-15');
} else {
  logPageView = null;
}

const Routes = () => (
  <ApolloProvider client={client} >
    <Router history={browserHistory} onUpdate={logPageView === null ? null : () => logPageView()}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="check-ins" component={Reviews}></Route>
        <Route path="check-in" component={ReviewContainer}></Route>
      </Route>
    </Router>
  </ApolloProvider>
);

export default Routes;

