import React from "react";
import {  Routes, Route,createBrowserRouter } from "react-router-dom";
import Login from "./components/features/auth/components/Login"
import TouchPoints from "./components/features/patientJourney/Pages/TouchPoints";
import Account from "./components/features/patientJourney/Pages/Account" 
import LoginWithSSO from "./components/features/auth/components/LoginWithSSO";
import { lazy, Suspense } from 'react';
import ProtectedRoute from "./components/features/auth/components/ProtectedRoute";
// Lazy load pages for code splitting
const PatientJourneyLanding = lazy(() => import('./components/features/patientJourney/Landing/PatientJourneyLanding'));

const Routing = createBrowserRouter(
  [
    {
      path: '/',
      element: <LoginWithSSO />,
      index: true
    },
    {
      element: <ProtectedRoute/>,
      children: [
        {
          path: '/home',
          element: <PatientJourneyLanding />
        },
        {
          path: '/touchpoints',
          element: <TouchPoints />
        },
        {
          path: '/account',
          element: <Account />
        }, 
      ]
    },
    {
      path: '*',
      element: <div className="d-flex align-items-center justify-content-center vh-100 page-404"><h1>404 Not Found</h1></div>
    }
  ]
);




// const Routing = () => {
//   return (
//       <Routes>
//         <Route path="/" element={<LoginWithSSO />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/home" element={<PatientJourneyLanding />} />
//         <Route path="*" element={<div className="d-flex align-items-center justify-content-center vh-100 page-404"><h1>404 Not Found</h1></div>} />
//         <Route path="/touchpoints" element={<TouchPoints/>} />
//         <Route path="/account" element={<Account />} />
//       </Routes>
//   );
// };

export default Routing;

