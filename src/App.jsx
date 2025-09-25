import { StrictMode, useEffect, useState } from 'react'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Routing from './Routes.jsx'
import './assets/css/style.scss'
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
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
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </MsalProvider>
 
  )
}

export default App
