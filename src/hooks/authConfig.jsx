export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_APP_MS_CLIENT_ID,
    authority: import.meta.env.VITE_APP_MS_AUTHORITY,
    redirectUri: window.location.origin + "/",
    postLogoutRedirectUri: window.location.origin + "/"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};