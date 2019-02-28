import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

//Routed components
import Home from './app/Home';
import Login from './app/Login';
import Logout from './app/Logout';
import Reviews from './app/Reviews';
import ReviewContainer from './app/ReviewContainer';

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
