import React, { useState } from 'react' 
import useAuth from "../../../../useAuth"
import { useNavigate } from 'react-router-dom'; 
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
