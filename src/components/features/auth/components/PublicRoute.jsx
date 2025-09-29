import React from "react";
import { Navigate, Outlet } from "react-router-dom"; 

const PublicRoute = () => {
  const isAuthenticated  =  localStorage.getItem("decrypted_token") ? true : false;

  if (isAuthenticated) {
    // already logged in → send home
    return <Navigate to="/home" replace />;
  }

  return <Outlet />; // show login page
};

export default PublicRoute;
