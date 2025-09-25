import React from "react";
import {  Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import PatientJourneyLanding from "./features/patientJourney/Landing/PatientJourneyLanding";
import TouchPoints from "./features/patientJourney/Pages/TouchPoints";
import Account from "./features/patientJourney/Pages/Account";

const Routing = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginWithSSO />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PatientJourneyLanding />} />
        <Route path="*" element={<div className="d-flex align-items-center justify-content-center vh-100 page-404"><h1>404 Not Found</h1></div>} />
        <Route path="/touchpoints" element={<TouchPoints/>} />
        <Route path="/account" element={<Account />} />
      </Routes>
  );
};

export default Routing;

