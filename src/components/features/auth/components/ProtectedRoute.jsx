import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { clearLocalStorage } from '../../../../helper/helper';

const ProtectedRoute = () => {
  const isAuthenticated =  localStorage.getItem("decrypted_token") ? true : false;
  if(!isAuthenticated){
    clearLocalStorage()
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;