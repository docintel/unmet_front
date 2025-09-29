import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import { ContentProvider } from "../../../../context/ContentContext";
const Layout = () => {
  return (
    <>
      <Header />
      <main>
        {" "}
        <ContentProvider>
          <Outlet />
        </ContentProvider>
      </main>
    </>
  );
};

export default Layout;
