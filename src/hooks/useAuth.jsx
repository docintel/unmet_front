import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
const useAuth = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      instance.setActiveAccount(accounts[0]);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [accounts, instance]);

  const login = async () => {
    try {
      const loginRequest = {
        scopes: ["openid", "profile", "email", "User.Read"],
      };

      const response = await instance.loginPopup(loginRequest);
      instance.setActiveAccount(response.account);
      setIsAuthenticated(true);
      return {
        token: response.accessToken,
        id_token: response.idToken,
        email: response.account.username,
      };
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          await instance.loginRedirect(loginRequest);
        } catch (redirectError) {
          console.error("Login redirect error:", redirectError);
        }
      } else {
        console.error("Login error:", error);
      }
    }
  };
  const logout = async () => {
    try {
      await instance.logoutPopup();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;
