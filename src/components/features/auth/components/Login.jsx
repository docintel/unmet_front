import { useState, useMemo, useCallback, useEffect } from "react";
import { Container, Form, Row, Button, Col } from "react-bootstrap";
import Select from "react-select";
import { countryRegionArray } from "../../../../constants/countryRegion";
import { useNavigate } from "react-router-dom";
import { handleSubmit } from "../../../../services/authService";

const Login = ({ userDetails, setLoader, isHcp }) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const navigate = useNavigate();

  // State
  // const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [regionList, setRegionList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  // const regionDropdownRef = useRef(null);

  // Options
  // const roleOptions = useMemo(
  //   () => [
  //     { value: "Hcp", label: "Hcp" },
  //     { value: "Staff", label: "Staff" },
  //     { value: "Test", label: "Test" },
  //   ],
  //   []
  // );

  useEffect(() => {
    if (selectedRole) setErrors({ ...errors, role: "" });
  }, [selectedRole]);

  useEffect(() => {
    if (selectedCountry) setErrors({ ...errors, country: "", region: "" });
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedRegion) setErrors({ ...errors, region: "" });
  }, [selectedRegion]);

  useEffect(() => {
    filterCountries();
    filterRegions();
  }, []);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!selectedRole) newErrors.role = "Role is required.";
    else newErrors.role = "";
    if (selectedRegion || selectedCountry) {
      newErrors.region = "";
      newErrors.country = "";
    } else {
      newErrors.region = "Oops! Pick at least a region or a country.";
      newErrors.country = "Oops! Pick at least a region or a country.";
    }
    // if (!selectedRegion)
    //   newErrors.region = "Oops! Pick at least a region or a country.";
    // else newErrors.region = "";
    // if (!selectedRegion && !selectedCountry)
    //   newErrors.country = "Oops! Pick at least a region or a country.";
    // else newErrors.country = "";
    setErrors(newErrors);

    let valid = false;
    if (selectedRole && (selectedCountry || selectedRegion)) valid = true;
    return valid;
  }, [selectedRole, selectedRegion, selectedCountry]);

  const filterRegions = () => {
    const uniqueRegions = [
      ...new Set(
        Object.entries(countryRegionArray)
          .map(([, region]) => region)
          .filter((region) => region !== "Other")
      ),
    ]

      .map((region) => ({ value: region, label: region }))
      .sort((a, b) =>
        a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      );

    setRegionList([...uniqueRegions, { value: "Other", label: "Other" }]);
  };

  const filterCountries = () => {
    const coutries = Object.entries(countryRegionArray)
      // .filter(([, region]) => {
      //   if (selectedRegion) return region === selectedRegion.value;
      //   else return true;
      // })
      .map(([country]) => ({ value: country, label: country }));
    setCountryList(coutries);
  };

  // useEffect(() => {
  //   filterRegions();
  //   filterCountries();
  //   if (selectedCountry && !selectedRegion) {
  //     const region = Object.entries(countryRegionArray).filter(
  //       ([country]) => country === selectedCountry.value
  //     );
  //     setSelectedRegion({ value: region[0][1], label: region[0][1] });
  //     filterRegions();
  //   }
  // }, [selectedCountry, selectedRegion]);

  // Handlers
  const handleRegionChange = (val) => {
    setSelectedRegion(val);
    // setSelectedCountry(null);
  };

  const onSubmit = useCallback(
    (e) => {
      handleSubmit(
        e,
        selectedRole,
        selectedRegion,
        selectedCountry,
        validateForm,
        navigate,
        userDetails,
        setLoader,
        isHcp
      );
    },
    [
      selectedRole,
      selectedRegion,
      selectedCountry,
      validateForm,
      navigate,
      userDetails,
      setLoader,
    ]
  );

  return (
    <div className="login-page">
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
                <h6>Welcome to the VWD Journey- with a Focus on wilate® </h6>
                <p>
                  <span>The VWD Journey Tool</span> is an interactive,
                  centralized digital resource designed to support you in
                  leading meaningful, personalized conversations with healthcare
                  professionals (HCPs), centered on the patient journey and the
                  role wilate® can play in improving care outcomes. This toolbox
                  as a strategic engagement and learning hub for von Willebrand
                  Disease (VWD), enabling tailored discussions diagnosis,
                  treatment decisions, and long-term management, while
                  highlighting wilate®'s value across the full patient journey.
                </p>
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
                  {/* <h3>
                    Welcome to <strong>VWD Journey</strong>
                    {/* {userDetails?.name || ""} 
                  </h3> */}
                </div>
                <h5>
                  Tell us a bit about you to tailor your <br />
                  experience
                </h5>
              </div>

              <div className="login-form">
                <form onSubmit={onSubmit}>
                  {/* Role */}
                  <Form.Group className="form-group">
                    <Form.Label>
                      Role <span>(Required)</span>
                    </Form.Label>
                    <div
                      className={
                        "input-with-icon " +
                        (errors.role ? "error " : "") +
                        (isFocused ? "active" : "")
                      }
                    >
                      <span className="icon">
                        <span>
                          <svg
                            width="22"
                            height="21"
                            viewBox="0 0 22 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 13.2565L11 14.7565"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 9.25647L2.15288 12.1197C2.31714 15.7335 2.39927 17.5403 3.55885 18.6484C4.71843 19.7565 6.52716 19.7565 10.1446 19.7565H11.8554C15.4728 19.7565 17.2816 19.7565 18.4412 18.6484C19.6007 17.5403 19.6829 15.7335 19.8471 12.1197L20 9.25647"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M1.84718 8.69953C3.54648 11.9309 7.3792 13.2565 11 13.2565C14.6208 13.2565 18.4535 11.9309 20.1528 8.69953C20.964 7.15703 20.3498 4.25647 18.352 4.25647H3.648C1.65023 4.25647 1.03603 7.15703 1.84718 8.69953Z"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M15 4.25647L14.9117 3.94741C14.4717 2.40736 14.2517 1.63734 13.7279 1.1969C13.2041 0.75647 12.5084 0.75647 11.117 0.75647H10.883C9.49159 0.75647 8.79587 0.75647 8.2721 1.1969C7.74832 1.63734 7.52832 2.40736 7.0883 3.94741L7 4.25647"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </span>
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Enter your role"
                        value={selectedRole}
                        onChange={(e) =>
                          e.target.value.length <= 50 &&
                          setSelectedRole(e.target.value)
                        }
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </div>{" "}
                    {errors.role && (
                      <div className="validation">{errors.role}</div>
                    )}
                  </Form.Group>
                  {/* <Form.Group className="form-group">
                    <Form.Label>
                      Role <span>(Required)</span>
                    </Form.Label>
                    <div
                      onMouseEnter={(e) =>
                        e.currentTarget
                          .querySelector(".split-button")
                          .classList.add("active")
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget
                          .querySelector(".split-button")
                          .classList.remove("active")
                      }
                    >
                      <Select
                        className={`split-button ${errors.role ? "error" : ""}`}
                        value={selectedRole}
                        onChange={(e) => {
                          setErrors((prev) => ({
                            ...prev,
                            role: "",
                          }));
                          setSelectedRole(e);
                        }}
                        placeholder="Select your role"
                        options={roleOptions}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "#E6F7F8" // background for selected option
                              : state.isFocused
                              ? "#F4F6F9" // background on hover
                              : "white",
                            color: state.isSelected ? "#4CC6CF" : "#5E7683",
                          }),
                        }}
                      />
                      <span>
                        <svg
                          width="22"
                          height="21"
                          viewBox="0 0 22 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 13.2565L11 14.7565"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 9.25647L2.15288 12.1197C2.31714 15.7335 2.39927 17.5403 3.55885 18.6484C4.71843 19.7565 6.52716 19.7565 10.1446 19.7565H11.8554C15.4728 19.7565 17.2816 19.7565 18.4412 18.6484C19.6007 17.5403 19.6829 15.7335 19.8471 12.1197L20 9.25647"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.84718 8.69953C3.54648 11.9309 7.3792 13.2565 11 13.2565C14.6208 13.2565 18.4535 11.9309 20.1528 8.69953C20.964 7.15703 20.3498 4.25647 18.352 4.25647H3.648C1.65023 4.25647 1.03603 7.15703 1.84718 8.69953Z"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M15 4.25647L14.9117 3.94741C14.4717 2.40736 14.2517 1.63734 13.7279 1.1969C13.2041 0.75647 12.5084 0.75647 11.117 0.75647H10.883C9.49159 0.75647 8.79587 0.75647 8.2721 1.1969C7.74832 1.63734 7.52832 2.40736 7.0883 3.94741L7 4.25647"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </span>
                      {errors.role && (
                        <div className="validation">{errors.role}</div>
                      )}
                    </div>
                  </Form.Group> */}
                  <div className="message">
                    <div className="info-icon">
                      <img src={path_image + "info-icon.svg"} alt="" />
                    </div>
                    <Form.Text className="text-muted">
                      Please enter your country and/or region. At least one is
                      required — entering both is recommended for the best
                      experience.
                    </Form.Text>
                  </div>
                  {/* Region */}
                  <Form.Group className="form-group">
                    <Form.Label>
                      Region <span>(Required)</span>
                    </Form.Label>
                    <div
                      onMouseEnter={(e) =>
                        e.currentTarget
                          .querySelector(".split-button")
                          .classList.add("active")
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget
                          .querySelector(".split-button")
                          .classList.remove("active")
                      }
                    >
                      <Select
                        className={`split-button ${
                          errors.region ? "error" : ""
                        }`}
                        value={selectedRegion}
                        onChange={(e) => {
                          setErrors((prev) => ({ ...prev, region: "" }));
                          handleRegionChange(e);
                        }}
                        placeholder="Select your region"
                        options={regionList}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "#E6F7F8" // background for selected option
                              : state.isFocused
                              ? "#F4F6F9" // background on hover
                              : "white",
                            color: state.isSelected ? "#4CC6CF" : "#5E7683",
                          }),
                        }}
                        isClearable
                      />
                      <span>
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 11.2565C21 5.73362 16.5228 1.25647 11 1.25647C5.47715 1.25647 1 5.73362 1 11.2565C1 16.7793 5.47715 21.2565 11 21.2565C16.5228 21.2565 21 16.7793 21 11.2565Z"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M19 4.95546C18.0653 5.02283 16.8681 5.38471 16.0379 6.45924C14.5385 8.40008 13.039 8.56203 12.0394 7.91508C10.5399 6.94467 11.8 5.37283 10.0401 4.51862C8.89313 3.96189 8.73321 2.44692 9.37158 1.25647"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1 10.2565C1.7625 10.9186 2.83046 11.5247 4.08874 11.5247C6.68843 11.5247 7.20837 12.0214 7.20837 14.0083C7.20837 15.9951 7.20837 15.9951 7.72831 17.4853C8.06651 18.4546 8.18472 19.4239 7.5106 20.2565"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 12.7088C20.1129 12.1976 19 11.9873 17.8734 12.7969C15.7177 14.3463 14.2314 13.0625 13.5619 14.3454C12.5765 16.234 16.0957 16.8276 13 21.2565"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                        </svg>{" "}
                      </span>

                      {errors.country && errors.region && (
                        <div className="validation">{errors.region}</div>
                      )}
                    </div>
                  </Form.Group>

                  {/* Country */}

                  <Form.Group className="form-group">
                    <Form.Label>
                      Country {
                          selectedCountry || selectedRegion ? null :<span>(Required)</span>
                        }
                    </Form.Label>
                    <div
                      onMouseEnter={(e) =>
                        e.currentTarget
                          .querySelector(".split-button")
                          .classList.add("active")
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget
                          .querySelector(".split-button")
                          .classList.remove("active")
                      }
                    >
                      <Select
                        className={`split-button ${
                          errors.country && errors.region ? "error" : ""
                        }`}
                        value={selectedCountry}
                        onChange={(e) => {
                          setErrors((prev) => ({ ...prev, country: "" }));
                          setSelectedCountry(e);
                        }}
                        placeholder="Select your country"
                        options={countryList}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "#E6F7F8" // background for selected option
                              : state.isFocused
                              ? "#F4F6F9" // background on hover
                              : "white",
                            color: state.isSelected ? "#4CC6CF" : "#5E7683",
                          }),
                        }}
                        isClearable
                        // isDisabled={!selectedRegion}
                      />
                      <span>
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.08082 1.25647C4.47023 2.19237 1 6.26865 1 11.1554C1 16.7341 5.52238 21.2565 11.101 21.2565C15.9878 21.2565 20.0641 17.7862 21 13.1756"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M17.9375 17.2565C18.3216 17.1731 18.6771 17.0405 19 16.8595M13.6875 16.5971C14.2831 16.858 14.8576 17.0513 15.4051 17.1783M9.85461 14.2042C10.2681 14.4945 10.71 14.8426 11.1403 15.1429M2 13.0814C2.32234 12.924 2.67031 12.7433 3.0625 12.5886M5.45105 12.2565C6.01293 12.3189 6.64301 12.4791 7.35743 12.7797"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M17 6.75647C17 5.92804 16.3284 5.25647 15.5 5.25647C14.6716 5.25647 14 5.92804 14 6.75647C14 7.5849 14.6716 8.25647 15.5 8.25647C16.3284 8.25647 17 7.5849 17 6.75647Z"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M16.488 12.8766C16.223 13.1203 15.8687 13.2565 15.5001 13.2565C15.1315 13.2565 14.7773 13.1203 14.5123 12.8766C12.0855 10.6321 8.83336 8.12462 10.4193 4.48427C11.2769 2.51596 13.3353 1.25647 15.5001 1.25647C17.6649 1.25647 19.7234 2.51596 20.5809 4.48427C22.1649 8.12003 18.9207 10.6398 16.488 12.8766Z"
                            stroke="#B5C2D3"
                            strokeWidth="1.5"
                          />
                        </svg>{" "}
                      </span>
                      {errors.country && errors.region && (
                        <div className="validation">{errors.country}</div>
                      )}
                    </div>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Continue{" "}
                    <img src={path_image + "continue-arrow.svg"} alt="" />
                  </Button>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
