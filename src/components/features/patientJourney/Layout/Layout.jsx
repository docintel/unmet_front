import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
