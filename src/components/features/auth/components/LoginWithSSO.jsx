import { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getUserDetails, handleSso } from "../../../../services/authService";
import { postData } from "../../../../services/axios/apiHelper";
import Login from "./Login";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { clearLocalStorage } from "../../../../helper/helper";
import Loader from "../../patientJourney/Common/Loader";
import { useSearchParams } from "react-router-dom";

const LoginWithSSO = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const [searchParams] = useSearchParams();

  const { login } = useAuth();
  // const isAuthenticatedUser = localStorage.getItem("decrypted_token")
  //   ? true
  //   : false;
  const navigate = useNavigate();
  const [userVerified, setUserVerified] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loader, setLoader] = useState(false);
  const [isHcp, setIsHcp] = useState(false);
  const [userData, setUserData] = useState(null);
  const id = searchParams.get("user-id") || "";
  const userId = id.slice(4, id.length - 2);

  useEffect(() => {
    if (userId) {
      (async () => {
        const userD = await getUserDetails(userId);
        setUserData(userD);
      })();
    }
  }, [userId]);

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
      if (!isHcp) navigate("/home");
      else navigate("/touchpoints");
    }
    setLoader(false);
  };

  const toggleUserType = () => {
    setIsHcp((prev) => {
      const newValue = !prev;
      return newValue;
    });
  };

  async function loginAsGuest() {
    const mail = "Meznah.a.k@docintel.app";
    setLoader(true);
    const res = await postData("/auth/login", { mail });
    const userDetails = res?.data?.data;
    console.log("loginAsGuest", userDetails);
    clearLocalStorage();
    localStorage.setItem("user_id", userDetails?.userToken);
    localStorage.setItem("name", userDetails?.name);
    localStorage.setItem("decrypted_token", userDetails?.jwtToken);
    setLoader(false);
    if (!isHcp) navigate("/home");
    else navigate("/touchpoints");
  }

  return (
    <>
      {!userVerified && (
        <div className="login-page sso">
          <Container fluid>
            <Row>
              <Col>
                <div className="login-left">
                  <div className="terms">
                    <div>
                      <a
                        href="https://onesource.octapharma.com/octapharma-privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Octapharma Privacy Statement
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://albert.docintel.app/octapharma-privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Docintel Privacy Policy
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://albert.docintel.app/docintel-terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Use
                      </a>
                    </div>
                  </div>
                  <div className="vwd-journey">
                    <div className="vwd-logo">
                      <img src={path_image + "vwd-logo.svg"} alt="" />
                    </div>
                    <h6>
                      Lorem ipsum dolor sit amet consectetur. Eu ac consectetur
                      purus volutpat. Odio ac enim a justo feugiat varius morbi
                      nulla justo. Sed quam risus tempor dui quam bibendum.{" "}
                    </h6>
                  </div>
                  <div></div>
                </div>
              </Col>
              <Col>
                <div className="login-right">
                  <div className="login-box">
                    {/* <div className="login-logo">
                <img src={`${path_image}logo-img.svg`} alt="logo" />
              </div> */}
                    <div className="user-name">
                      <h3>
                        Welcome to VWD Journey
                        {userData && (
                          <>
                            {" "}
                            <br />
                            <span>
                              {userData?.name || userData?.first_name || ""}
                            </span>
                          </>
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="login-form">
                    <Form>
                      <Form.Group>
                        <div className="login-switch">
                          <Form.Label>View mode:</Form.Label>
                          <div className="login-switch">
                            <div className="switch">
                              <label className="switch-light">
                                <input
                                  type="checkbox"
                                  checked={isHcp}
                                  onChange={toggleUserType}
                                  style={{ margin: 0 }}
                                />
                                <span>
                                  <span
                                    className={`switch-btn ${
                                      !isHcp ? "active" : ""
                                    }`}
                                  >
                                    Octapharma
                                  </span>
                                  <span
                                    className={`switch-btn ${
                                      isHcp ? "active" : ""
                                    }`}
                                  >
                                    HCP
                                  </span>
                                </span>
                                <a className="btn"></a>
                              </label>
                            </div>
                          </div>
                        </div>
                      </Form.Group>
                      <div className="message">
                        <div className="info-icon">
                          <img src={path_image + "info-icon.svg"} alt="" />
                        </div>
                        <Form.Text className="text-muted">
                          Use Octapharma for full access, switch to HCP for
                          sharing content safely.
                        </Form.Text>
                      </div>

                      <Button
                        variant="primary"
                        onClick={() => {
                          document.cookie = `isHcp=${isHcp}; 1; path=/`;
                          handleSso(login, isUserVerified, setLoader);
                        }}
                        className="rounded-lg transition"
                      >
                        Login <img src={path_image + "login-icon.svg"} alt="" />
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          document.cookie = `isHcp=${isHcp}; 1; path=/`;
                          loginAsGuest(login, isUserVerified, setLoader);
                        }}
                        className="rounded-lg transition"
                      >
                        Login As Guest{" "}
                        <img src={path_image + "login-icon.svg"} alt="" />
                      </Button>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        //  <div className="login-page sso">
        //     <div className="login sso-login">
        //       <div className="login-logo">
        //         <img src={path_image + "logo-img.svg"} alt="logo" />
        //       </div>
        //       <div className="user-name">
        //         <h1>
        //           Welcome to
        //           <br />
        //           VWD JOURNEY
        //         </h1>
        //       </div>
        //       <Button
        //         variant="primary"
        //         type="submit"
        //         onClick={() => handleSso(login, isUserVerified, setLoader)}
        //         className="rounded-lg transition"
        //       >
        //         Login with SSO
        //       </Button>
        //     </div>
        //   </div>
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
