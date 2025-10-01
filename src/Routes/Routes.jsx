import { Navigate } from "react-router-dom";
import PatientJourneyLanding from "../components/features/patientJourney/Landing/PatientJourneyLanding";
import Account from "../components/features/patientJourney/Pages/Account";
import Resources from "../components/features/patientJourney/Pages/Resources";
import TouchPoints from "../components/features/patientJourney/Pages/TouchPoints";
import LoginWithSSO from "../components/features/auth/components/LoginWithSSO";

export const privateRoutes = [
  { path: "/home", element: <PatientJourneyLanding /> },
  { path: "/touchpoints", element: <TouchPoints /> },
  { path: "/resources", element: <Resources /> },
  { path: "/account", element: <Account /> },
];

export const publicRoutes = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginWithSSO /> },
];
