import React from "react";
import {  Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import PatientJourneyLanding from "./features/patientJourney/Landing/PatientJourneyLanding";
import TouchPoints from "./features/patientJourney/Pages/TouchPoints";

const Routing = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PatientJourneyLanding />} />
        <Route path="/" element={<PatientJourneyLanding />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/touchpoints" element={<TouchPoints/>} />
      </Routes>
  );
};

export default Routing;

