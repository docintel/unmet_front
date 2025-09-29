import React, { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginWithSSO from "./components/features/auth/components/LoginWithSSO";
import TouchPoints from "./components/features/patientJourney/Pages/TouchPoints";
import Account from "./components/features/patientJourney/Pages/Account";
import ProtectedRoute from "./components/features/auth/components/ProtectedRoute";
import PublicRoute from "./components/features/auth/components/PublicRoute.jsx";
import Layout from "./components/features/patientJourney/Layout/Layout";
import Resources from "./components/features/patientJourney/Pages/Resources";

const PatientJourneyLanding = lazy(() =>
  import("./components/features/patientJourney/Landing/PatientJourneyLanding")
);

const Routing = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginWithSSO /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/home", element: <PatientJourneyLanding /> },
          { path: "/touchpoints", element: <TouchPoints /> },
          { path: "/resources", element: <Resources /> },
          { path: "/account", element: <Account /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="d-flex align-items-center justify-content-center vh-100 page-404">
        <h1>404 Not Found</h1>
      </div>
    ),
  },
]);

export default Routing;
