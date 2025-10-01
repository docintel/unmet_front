import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom"; 
import ProtectedRoute from "./components/features/auth/components/ProtectedRoute"; 
import Layout from "./components/features/patientJourney/Layout/Layout"; 
import { privateRoutes, publicRoutes } from "./Routes/Routes.jsx";

const Routing = createBrowserRouter([
  ...publicRoutes, 
  {
    element: <ProtectedRoute />,
    children: [
      { element: <Layout />, children: privateRoutes }
    ]
  },
  { path: "*", element: <div>404 Not Found</div> }
]);

export default Routing;
