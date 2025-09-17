import React from "react";
import {  Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import PatientJourneyLanding from "./features/patientJourney/Landing/PatientJourneyLanding";

const Routing = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PatientJourneyLanding />} />
        <Route path="/" element={<PatientJourneyLanding />} />
      </Routes>
  );
};

export default Routing;

