import React from 'react';
import { Router, Route, browserHistory } from 'react-router';


// Google Analytics
//import ReactGA from 'react-ga';

//Routed components
import Home from './app/Home';
import Login from './app/Login';
import Logout from './app/Logout';
import Reviews from './app/Reviews';
import ReviewContainer from './app/ReviewContainer';

// let logPageView = () => {
//   ReactGA.set({ page: window.location.pathname });
//   ReactGA.pageview(window.location.pathname + window.location.search);
// };

// if (window.location.href.indexOf('dev') === -1
//   && (window.location.href.indexOf('check-in.ashevillenc.gov') > -1 ||
//   window.location.href.indexOf('checkin.ashevillenc.gov') > -1 ||
//   window.location.href.indexOf('checkins.ashevillenc.gov') > -1)
// ) {
//   ReactGA.initialize('UA-16340971-15');
// } else {
//   logPageView = null;
// }

const mainRoutes = (
  //TODO: analytics...
  <Router history={browserHistory}>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/check-ins" component={Reviews} />
    <Route path="/check-in" component={ReviewContainer} />
  </Router>
);

export default mainRoutes;
