import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authorization from '../utility/authorization';

/**
 * If we have a logged-in user, display the component, otherwise redirect to login page.
 */

const PrivateRoute = ({ component: Component, section, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (Authorization.isLoggedIn()) {
        return <Component {...props} />;
      } else {
        return <Redirect to={{ pathname: '/login' }} />;
      }
    }}
  />
);

export default PrivateRoute;
