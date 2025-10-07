import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { handleSso } from "../../../../services/authService";
import Login from "./Login";
import { Button } from "react-bootstrap";
import { clearLocalStorage } from "../../../../helper/helper";
import Loader from "../../patientJourney/Common/Loader";
const LoginWithSSO = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { login, logout, isAuthenticated } = useAuth();
  const isAuthenticatedUser = localStorage.getItem("decrypted_token")
    ? true
    : false;
  const navigate = useNavigate();
  const [userVerified, setUserVerified] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loader, setLoader] = useState(false);

  const isUserVerified = (res, email = "") => {
    clearLocalStorage();
    const { jwtToken, userRegistered, name, userToken } = res?.data?.data || {};
    if (!userRegistered) {
      setUserVerified(true);
      setUserDetails({ name, jwtToken, userToken });
    } else {
      localStorage.setItem("user_id", userToken);
      localStorage.setItem("name", name);
      localStorage.setItem("decrypted_token", jwtToken);
      navigate("/home");
    }
    setLoader(false);
  };

  return (
    <>
      {!userVerified && (
        <div className="login-page sso">
          <div className="login sso-login">
            <div className="login-logo">
              <img src={path_image + "logo-img.svg"} alt="logo" />
            </div>
            <div className="user-name">
              <h1>
                Welcome to
                <br />
                VWD JOURNEY
              </h1>
            </div>
            <Button
              variant="primary"
              type="submit"
              onClick={() => handleSso(login, isUserVerified, setLoader)}
              className="rounded-lg transition"
            >
              Login with SSO
            </Button>
          </div>
        </div>
      )}
      {userVerified && (
        <Login userDetails={userDetails} setLoader={setLoader} />
      )}
      {loader && (
        <div style={{ display: loader ? "block" : "none" }}>
          <div className="loader-overlay">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginWithSSO;
