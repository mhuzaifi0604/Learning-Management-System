// PrivateRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, authenticated, redirectTo, ...rest }) => {
  return (
    <Route
      {...rest}
      element={authenticated ? <Element /> : <Navigate to={redirectTo} replace />}
    />
  );
};

export default PrivateRoute;
