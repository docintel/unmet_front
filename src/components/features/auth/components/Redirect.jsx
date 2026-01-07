import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../../services/axios/apiHelper";
import Loader from "../../patientJourney/Common/Loader";
import { trackingUserAction } from "../../../../helper/helper";
import CryptoJS from "crypto-js";

const Redirect = () => {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false);
  function myDecrypt(input) {
    const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_APP_ENCRYPT_KEY);
    const iv = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_APP_ENCRYPT_IV);
  
    const decrypted = CryptoJS.AES.decrypt(input, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
  
    const text = decrypted.toString(CryptoJS.enc.Utf8);
    return "5098" + text + "61";
  }

  useEffect(() => {
    const loginWithToken = async () => {
      try {
        setLoader(true);
        const params = new URLSearchParams(window.location.search);
        const gotoquestion = params.has('gotoquestion');
        const token = myDecrypt(params.get("token"));
        const res = await postData("/auth/login", { user_id: token });

        if (res.status === 200) {
          const { userToken, name, jwtToken, sessionId } = res?.data?.data;
          localStorage.setItem("user_id", userToken);
          localStorage.setItem("name", name);
          localStorage.setItem("decrypted_token", jwtToken);
          localStorage.setItem("sessionId", sessionId);
          trackingUserAction("login_clicked", `Login through  SSI link`, "");
          if(gotoquestion){
             navigate("/account", { state: { fromSsi: true } });
             return;
          }

          if (res.data.data.userRegistered) {
            document.cookie = `isHcp=${false}; 1; path=/`;
            navigate("/home");
          } else navigate("/login", { state: { userData: res.data.data } });
        } else {
          navigate("/login");
          return;
        }
      } catch (err) {
        setLoader(false);
        console.error("Auto login failed:", err);
        let error = "";
        if(err.status == "400") error = "USER_DELETED";
        navigate("/login", { state: { error } });
      } finally {
        setLoader(false);
      }
    };

    loginWithToken();
  }, [navigate]);

  return <div>
          {loader && (
        <div style={{ display: loader ? "block" : "none" }}>
          <div className="loader-overlay">
            <Loader />
          </div>
        </div>
      )}
  </div>;
};

export default Redirect;
