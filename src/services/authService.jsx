import endPoint from "./axios/apiEndpoint";
import { postData } from "./axios/apiHelper";
import { clearLocalStorage } from "../helper/helper";

export const handleSso = async (login, handleLoginSuccess, setLoader) => {
  try {
    const data = await login();
    if (!data) {
      throw new Error("Something went wrong. Please try again");
    }
    setLoader(true);
    const { id, token, id_token, email } = data;
    const res = await postData(endPoint.Login, {
      id,
      token,
      idToken: id_token,
      type: "sso",
    });

    await handleLoginSuccess(res, email);
  } catch (error) {
    if (error.errorCode === "user_cancelled") {
      console.warn("User cancelled login flow");
      alert("Login was cancelled. Please try again.");
      setLoader(false);
    } else {
      console.error("Unexpected login error:", error);
      alert("Login failed. Please try again later.");
      setLoader(false);
    }
  }
};

export const handleSubmit = async (
  e,
  selectedRole,
  selectedRegion,
  selectedCountry,
  validateForm,
  navigate,
  userDetails,
  setLoader
) => {
  e.preventDefault();
  if (!validateForm()) {
    return;
  }
  setLoader(true);
  const data = {
    role: selectedRole.value,
    region: selectedRegion ? selectedRegion.value : null,
    country: selectedCountry ? selectedCountry.value : null,
  };
  await postData(endPoint.VERIFY_USER, data, {
    headers: {
      auth: `Bearer ${userDetails?.jwtToken}`,
    },
  });
  clearLocalStorage();
  localStorage.setItem("user_id", userDetails?.userToken);
  localStorage.setItem("name", userDetails?.name);
  localStorage.setItem("decrypted_token", userDetails?.jwtToken);
  setLoader(false);
  navigate("/home");
};

export const getUserDetails = async (userId) => {
  try {
    if (!userId) {
      return;
    }

    const userData = await postData(endPoint.GET_USER_DATA, {
      userId: userId,
    });
    if (userData.status === 200) return userData.data.data;
    else return null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
