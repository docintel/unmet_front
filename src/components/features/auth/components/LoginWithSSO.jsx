import React, { useState } from 'react' 
import useAuth from "../../../../useAuth"
import { useNavigate } from 'react-router-dom';
import { postData } from '../../../../services/axios/apiHelper';
import endPoint from '../../../../services/axios/apiEndpoint';
import { handleSso } from '../../../../services/authService';
import Login from './Login';
import { Button } from 'react-bootstrap';
const LoginWithSSO = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH
      const { login,logout, isAuthenticated } = useAuth();
      const navigate = useNavigate();
      const [userVerified, setUserVerified] =  useState(false);
      const [userDetails,setUserDetails]=useState({})
      const clearLocalStorageExcept = () => { 
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key) {
            localStorage.removeItem(key);
          }
        }
      };
      const handleLoginSuccess = (res, email = "") => {
        clearLocalStorageExcept();

        const { jwtToken,userRegistered,name,userToken } = res?.data?.data || {};
        console.log(jwtToken,userRegistered,name,userToken,"jwtToken,userRegistered,name,userToken")
        localStorage.setItem("user_id", userToken); 
        localStorage.setItem("name", name);
        localStorage.setItem("decrypted_token", jwtToken);
        if(!userRegistered){
          setUserVerified(true) 
          setUserDetails({name})
        }else{
          navigate("/home");
        }
      };

  const handleSso = async () => {
    try {
      const data = await login();
      console.log("Login successful:", data);
      if (!data) {
        throw new Error("Something went wrong. Please try again");
      }
      const { id, token, id_token, email } = data;
      const res = await postData(endPoint.Login, {
        id,
        token,
        idToken: id_token,
        type: "sso",
      });

      handleLoginSuccess(res, email);
    } catch (error) {
      if (error.errorCode === "user_cancelled") {
        console.warn("User cancelled login flow");
        // optional: show a toast/alert instead of console
        alert("Login was cancelled. Please try again.");
      } else {
        console.error("Unexpected login error:", error);
        alert("Login failed. Please try again later.");
      }
    }
  };


  return (
    <>
   {!userVerified && <div className="login-page">
      <div className="login sso-login">
        <div className="login-logo">
          <img src={path_image + "logo-img.svg"} alt="logo" />
        </div>
        <div className="user-name">
          <h1>Welcome to<br/>VWD JOURNEY</h1>
        </div>
        <Button variant="primary" type="submit" onClick={() => handleSso(login,handleLoginSuccess)} className="rounded-lg transition">
          Login with SSO
        </Button>
      </div> 
    </div>}
    {
      userVerified && <Login userDetails={userDetails}/>
    }
</>
  );
}

export default LoginWithSSO
