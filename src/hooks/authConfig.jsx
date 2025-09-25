// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_APP_MS_CLIENT_ID, // from Azure portal
    authority: import.meta.env.VITE_APP_MS_AUTHORITY,
    redirectUri: "/",
    postLogoutRedirectUri: "/"
  },
  cache: {
    cacheLocation: "localStorage", // or "sessionStorage"
    storeAuthStateInCookie: false, // for IE11/Edge
  },
};
 


 