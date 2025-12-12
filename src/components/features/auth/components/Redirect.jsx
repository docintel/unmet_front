import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../../services/axios/apiHelper";
import Loader from "../../patientJourney/Common/Loader";
import { trackingUserAction } from "../../../../helper/helper";


const Redirect = () => {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const loginWithToken = async () => {
      try {
        setLoader(true);
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const res = await postData("/auth/login", { user_id: token });
        if (res.status === 200) {
          const { userToken, name, jwtToken, sessionId } = res?.data?.data;
          localStorage.setItem("user_id", userToken);
          localStorage.setItem("name", name);
          localStorage.setItem("decrypted_token", jwtToken);
          localStorage.setItem("sessionId", sessionId);
          trackingUserAction("login_clicked", `Login through  SSI link`, "");
          //  navigate("/account", { state: { fromSsi: true } });

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
        navigate("/login");
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
