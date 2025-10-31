import React from "react";
import { createBrowserRouter } from "react-router-dom"; 
import ProtectedRoute from "./components/features/auth/components/ProtectedRoute"; 
import PublicRoute from "./components/features/auth/components/PublicRoute.jsx";
import Layout from "./components/features/patientJourney/Layout/Layout"; 
import { privateRoutes, publicRoutes } from "./Routes/Routes.jsx";

const Routing = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: publicRoutes,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: privateRoutes,
      }
    ]
  },
  { path: "*", element: <div className="page-404"><h1>404 Not Found</h1></div> }
]);

export default Routing;
