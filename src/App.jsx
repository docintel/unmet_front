import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Routing from "./Routes.jsx";
import "./assets/css/style.scss";
import "./assets/css/responsive.scss";
import "./assets/fonts/fonts.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./hooks/authConfig.jsx";
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing MSAL:", error);
      }
    };
    initializeMSAL();
  }, []);

  if (!isInitialized) {
    return;
  }

  return (
    <MsalProvider instance={msalInstance}>
      <RouterProvider router={Routing} />{" "}
    </MsalProvider>
  );
}

export default App;
