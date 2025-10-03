import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import { ContentProvider } from "../../../../context/ContentContext";
import { ToastContainer } from "react-toastify";
const Layout = () => {
  return (
    <>
      <Header />
      <main>
        {" "}
        <ContentProvider>
          <ToastContainer closeOnClick pauseOnHover />
          <Outlet />
        </ContentProvider>
      </main>
    </>
  );
};

export default Layout;
