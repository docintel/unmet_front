import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import { ContentProvider } from "../../../../context/ContentContext";
import { ToastContainer } from "react-toastify";
import Toast from "../Common/Toast";
const Layout = () =>
{
  return (
    <>
      {" "}
      <ContentProvider>
        <main>
        <Header />
          {" "}<Toast />
          <ToastContainer closeOnClick pauseOnHover />
          <Outlet />
        </main>{" "}
      </ContentProvider>
    </>
  );
};

export default Layout;
