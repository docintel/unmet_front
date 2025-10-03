import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import { ContentProvider } from "../../../../context/ContentContext";
import { ToastContainer } from "react-toastify";
const Layout = () => {
  return (
    <>
      {" "}
      <ContentProvider>
        <Header />
        <main>
          {" "}
          <ToastContainer closeOnClick pauseOnHover />
          <Outlet />
        </main>{" "}
      </ContentProvider>
    </>
  );
};

export default Layout;
