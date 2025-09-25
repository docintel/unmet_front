import React from 'react'
import axios from "axios";
import useAuth from "../../useAuth";

const LoginWithSSO = () => {

      const { login,logout, isAuthenticated } = useAuth();

      const clearLocalStorageExcept = () => {
    const keysToKeep = ["uname", "pass", "acceptedCookies"];
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    }
  };

  const handleLoginSuccess = (res, email = "") => {
    clearLocalStorageExcept();

    const { userToken, groupId, webinar_flag, name, jwtToken, loginCounter, ssoMail } =
      res?.data?.data || {};

    localStorage.setItem("user_id", userToken);
    localStorage.setItem("group_id", groupId);
    localStorage.setItem("webinar_flag", webinar_flag);
    localStorage.setItem("name", name);
    localStorage.setItem("decrypted_token", jwtToken);

    const normalizedEmail = (ssoMail || email || "").toLowerCase();
    const currentUserId = localStorage.getItem("user_id");

    const accessMap = {
      "iSnEsKu5gB/DRlycxB6G4g==": {
        all: ["lina.aires@octapharma.com"],
        vincent: ["vincent.milleret@octapharma.com"],
        limited: [
          "julien.lejeune@octapharma.com",
          "nina.ljubojevic@octapharma.com",
          "sabine.de-jong@octapharma.com",
        ],
      },
      "bWmUjqX7J011WUTYn9g==": {
        motivate: ["stefano.carta@octapharma.com"],
      },
    };

    const userAccessConfig = accessMap[currentUserId];
    if (userAccessConfig) {
      for (const [accessLevel, emails] of Object.entries(userAccessConfig)) {
        if (emails.includes(normalizedEmail)) {
          localStorage.setItem("switch_account", accessLevel);
          break;
        }
      }
    }

    // TODO: Implement navigation logic here
    // Example: navigate("/home");
  };

const handleSso = async () => {
  
  try {

    const data = await login();
    console.log("Login successful:", data);
    if (!data) {
      throw new Error("Something went wrong. Please try again");
    }
    const { id, token, id_token, email } = data;
    const res = await axios.post("https://infobackend.docintelhub.com/auth/login", {
      id,
      token,
      idToken: id_token,
      type: "sso",
    });
   // handleLoginSuccess(res, email);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome</h1>
        <button
          onClick={handleSso}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Login with SSO
        </button>
      </div>
    </div>
  );
}

export default LoginWithSSO
