import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

  const isAuthenticated =  localStorage.getItem("user_id") ? true : true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
 
};

export default ProtectedRoute;