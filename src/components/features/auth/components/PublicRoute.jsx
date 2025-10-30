import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { clearLocalStorage } from "../../../../helper/helper";

const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem("decrypted_token");
  if (isAuthenticated) {
    // return <Navigate to="/home" replace />;
    return <Navigate to="/touchpoints" replace />;
  }
  clearLocalStorage();
  return <Outlet />;
};

export default PublicRoute;
