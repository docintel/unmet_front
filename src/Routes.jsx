import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login.jsx";
import Landing from "./component/Landing.jsx";

const Routing = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/" element={<Landing />} />
      </Routes>
  );
};

export default Routing;

