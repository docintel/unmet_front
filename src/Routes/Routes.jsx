import { Navigate } from "react-router-dom";
import Account from "../components/features/patientJourney/Pages/Account/Account";
import Resources from "../components/features/patientJourney/Pages/ResourcesComponent/Resources";
import TouchPoints from "../components/features/patientJourney/Pages/TouchpointsComponent/TouchPoints";
import LoginWithSSO from "../components/features/auth/components/LoginWithSSO";
import { lazy } from "react";
import Logout from "../components/features/auth/components/Logout";
const PatientJourneyLanding = lazy(() =>
  import("../components/features/patientJourney/Landing/PatientJourneyLanding")
);

export const privateRoutes = [
  // { path: "/home", element: <PatientJourneyLanding /> },
  { path: "/touchpoints", element: <TouchPoints /> },
  { path: "/resources", element: <Resources /> },
  { path: "/logout", element: <Logout /> },
  // { path: "/account", element: <Account /> },
];

export const publicRoutes = [
  { path: "/", element: <LoginWithSSO /> },
  { path: "/login", element: <LoginWithSSO /> },
];
