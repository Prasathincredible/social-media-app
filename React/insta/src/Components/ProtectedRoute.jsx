import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    alert('Login with username and password');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
