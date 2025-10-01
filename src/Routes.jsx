import React, { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginWithSSO from "./components/features/auth/components/LoginWithSSO"; 
import ProtectedRoute from "./components/features/auth/components/ProtectedRoute"; 
import Layout from "./components/features/patientJourney/Layout/Layout"; 
import { privateRoutes, publicRoutes } from "./Routes/Routes.jsx";

const PatientJourneyLanding = lazy(() =>
  import("./components/features/patientJourney/Landing/PatientJourneyLanding")
);

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
