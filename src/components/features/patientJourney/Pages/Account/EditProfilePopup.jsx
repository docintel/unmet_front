import { useEffect, useState, useContext, useMemo } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { ContentContext } from "../../../../../context/ContentContext";
import { trackingUserAction } from "../../../../../helper/helper";
import { countryRegionArray } from "../../../../../constants/countryRegion";
import Select from "react-select";
import { updateUserProfileDetails } from "../../../../../services/touchPointServices";

const EditProfilePopup = ({
  editProfilePopupShow,
  setEditProfilePopupShow,
  userData,
}) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { currentTabValue, setToast, setIsLoading, updateUserPorfileData } =
    useContext(ContentContext);
  const [name, setName] = useState("");
  // const [selectedRole, setSelectedRole] = useState({});
  const [selectedRole, setSelectedRole] = useState();
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedRegion, setSelectedRegion] = useState({});
  const [error, setError] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState({
    name: false,
    role: false,
    country: false,
    region: false
  });


  useEffect(() => setPropertyState(), [userData]);
  useEffect(() => filterCountries(), []);

  useEffect(() => {
    if (
      name !== userData?.name ||
      selectedCountry.value !== userData?.country ||
      // selectedRegion.value !== userData?.region ||
      selectedRole !== userData?.role
      // selectedRole.value !== userData?.role
    ) {
      if (name.trim() == "") setSaveDisabled(true);
      else setSaveDisabled(false);
    } else setSaveDisabled(true);
  }, [name, selectedRole, selectedCountry, selectedRegion]);

  useEffect(() => {
    filterRegions();
    filterCountries();
    if (selectedCountry && !selectedRegion) {
      const region = Object.entries(countryRegionArray).filter(
        ([country]) => country === selectedCountry.value
      );
      setSelectedRegion({ value: region[0][1], label: region[0][1] });
      filterRegions();
    }
  }, [selectedCountry, selectedRegion]);

  // const roleOptions = useMemo(
  //   () => [
  //     { value: "HCP", label: "HCP" },
  //     { value: "Staff", label: "Staff" },
  //     { value: "Test", label: "Test" },
  //   ],
  //   []
  // );

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
      .filter(([, region]) => {
        if (selectedRegion) return region === selectedRegion.value;
        else return true;
      })
      .map(([country]) => ({ value: country, label: country }));
    setCountryList(coutries);
  };

  const setPropertyState = () => {
    setName(userData?.name || "");
    // setSelectedRole(
    //   userData?.role ? { value: userData?.role, label: userData?.role } : {}
    // );
    setSelectedRole(userData?.role ? userData?.role : "");
    setSelectedRegion(
      userData?.region
        ? { value: userData?.region, label: userData?.region }
        : {}
    );
    setSelectedCountry(
      userData?.country
        ? { value: userData?.country, label: userData?.country }
        : {}
    );

    setError({});
  };

  const handleRegionChange = (val) => {
    setSelectedRegion(val);
    setSelectedCountry({});
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const newError = {};
      if (!name.trim()) newError.name = "name is required!!";
      // if (!Object.keys(selectedRole).length)
      if (!selectedRole) newError.role = "role is required!!";
      if (!Object.keys(selectedRegion).length)
        newError.region = "either region or country is required!!";
      if (
        !Object.keys(selectedRegion).length &&
        !Object.keys(selectedCountry).length
      )
        newError.country = "country is required!!";

      if (Object.keys(newError).length) {
        setError(newError);
        return;
      }

      await updateUserProfileDetails(
        name,
        // selectedRole.value,
        selectedRole,
        Object.keys(selectedCountry).length ? selectedCountry.value : null,
        Object.keys(selectedRegion).length ? selectedRegion.value : null,
        setToast,
        setIsLoading
      );

      setEditProfilePopupShow(false);
      setShowConfirmationModal(true);
      updateUserPorfileData(
        name,
        // selectedRole.value,
        selectedRole,
        Object.keys(selectedCountry).length ? selectedCountry.value : null,
        Object.keys(selectedRegion).length ? selectedRegion.value : null
      );
      await trackingUserAction(
        "profile_updated",
        {
          name: name,
          // selected_role: selectedRole.value,
          selected_role: selectedRole,
          selected_country: selectedCountry.value,
          selected_region: selectedRegion.value,
        },
        currentTabValue
      );
    } catch (ex) {
      console.error(ex);
      setError({ global: "Oops!! Failed to update profile details." });
      setPropertyState();
    }
  };

  return (
    <>
      <div className="pop_up">
        <Modal
          show={editProfilePopupShow}
          onHide={() => setEditProfilePopupShow((prev) => !prev)}
          backdrop="static"
          keyboard={false}
          centered
          className="Edit-modal"
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="Edit-form">
              <Form className="registration-form">
                <Form.Group className="form-group">
                  <Form.Label>
                    Name{" "}
                    <span style={{ fontWeight: "lighter" }}>(Required)</span>
                  </Form.Label>
                  <div
                    className={
                      "input-with-icon" +
                      (error.name ? " error" : "") +
                      (isFocused.name ? " active" : "")
                    }
                  >
                    <span className="icon">
                      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-svg">
                        <path d="M3.70222 13.5869C7.25617 11.4709 11.7606 11.4708 15.3145 13.5869C15.7052 13.8195 16.4454 14.2124 17.1016 14.6465C17.7593 15.0816 18.496 15.6578 18.9132 16.3711C19.1222 16.7287 19.0022 17.1884 18.6446 17.3975C18.2871 17.6064 17.8273 17.4864 17.6182 17.1289C17.3851 16.7301 16.8993 16.3108 16.2745 15.8975C15.648 15.4831 15.0455 15.1728 14.5469 14.876C11.4659 13.0415 7.55087 13.0415 4.4698 14.876C3.97129 15.1728 3.36871 15.4831 2.74226 15.8975C2.1173 16.3109 1.63069 16.73 1.39753 17.1289C1.18842 17.4862 0.728656 17.6064 0.371164 17.3975C0.0139483 17.1883 -0.10631 16.7285 0.10261 16.3711C0.51975 15.6577 1.25639 15.0816 1.91413 14.6465C2.57048 14.2123 3.31148 13.8196 3.70222 13.5869Z" fill="#B5C2D3" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.50788 0C12.4074 0 14.7579 2.3505 14.7579 5.25C14.7579 8.14949 12.4074 10.5 9.50788 10.5C6.60839 10.5 4.25788 8.14949 4.25788 5.25C4.25788 2.3505 6.60839 0 9.50788 0ZM9.50788 1.5C7.43682 1.5 5.75788 3.17893 5.75788 5.25C5.75788 7.32107 7.43682 9 9.50788 9C11.579 9 13.2579 7.32107 13.2579 5.25C13.2579 3.17893 11.579 1.5 9.50788 1.5Z" fill="#B5C2D3" />
                      </svg>

                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setIsFocused(prev => ({
                        ...prev, name: true
                      }))}
                      onBlur={() => setIsFocused(prev => ({
                        ...prev, name: false
                      }))}
                    />
                  </div>{" "}
                  {error.name && <div className="validation">{error.name}</div>}
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>
                    Role <span>(Required)</span>
                  </Form.Label>
                  <div
                    className={"input-with-icon" +
                      (error.role ? " error" : "") +
                      (isFocused.role ? " active" : "")
                    }
                  >
                    <span className="icon">
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
                    <Form.Control
                      type="text"
                      placeholder="Select your role"
                      value={selectedRole}
                      onChange={(e) =>
                        e.target.value.length <= 50 &&
                        setSelectedRole(e.target.value)
                      }
                      onFocus={() => setIsFocused(prev => ({
                        ...prev, role: true
                      }))}
                      onBlur={() => setIsFocused(prev => ({
                        ...prev, role: false
                      }))}
                    />
                  </div>{" "}
                  {error.role && <div className="validation">{error.role}</div>}
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
                      className={`split-button ${error.role ? "error" : ""}`}
                      value={selectedRole}
                      onChange={setSelectedRole}
                      placeholder="Select your role"
                      options={roleOptions}
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? "#E6F7F8"
                            : state.isFocused
                            ? "#F4F6F9"
                            : "white",
                          color: state.isSelected ? "#4CC6CF" : "#5E7683",
                        }),
                      }}
                    />
                    <span>
                      <img src={path_image + "role-icon.svg"} alt="" />
                    </span>
                    {error.role && (
                      <div className="validation">{error.role}</div>
                    )}
                  </div>
                </Form.Group> */}
                <Form.Group className="form-group">
                  <Form.Label>
                    Region <span>(Required)</span>
                  </Form.Label>

                  <div className="select-wrapper">
                    <Select
                      className={`split-button 
                    ${error.region ? "error" : ""} 
                    ${isFocused.region ? "active" : ""}`
                      }
                      value={selectedRegion}
                      onChange={(e) => {
                        handleRegionChange(e);
                        setIsFocused((prev) => ({ ...prev, region: false }));
                      }}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, region: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, region: false }))
                      }
                      placeholder="Select your region"
                      options={regionList}
                      isClearable
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? "#E6F7F8"
                            : state.isFocused
                              ? "#F4F6F9"
                              : "white",
                          color: state.isSelected ? "#4CC6CF" : "#5E7683",
                        }),
                      }}
                    />

                    <span className={`select-icon ${isFocused.region ? "active" : ""}`}>
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
                      </svg>
                    </span>

                    {error.country && error.region && (
                      <div className="validation">{error.region}</div>
                    )}
                  </div>
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>
                    Country <span>(Required)</span>
                  </Form.Label>

                  <div className="select-wrapper">
                    <Select
                      className={`split-button 
                        ${error.country && error.region ? "error" : ""} 
                        ${isFocused.country ? "active" : ""}`}
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e);
                        setIsFocused((prev) => ({ ...prev, country: false }));
                      }}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, country: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, country: false }))
                      }
                      placeholder="Select your country"
                      options={countryList}
                      isClearable
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? "#E6F7F8"
                            : state.isFocused
                              ? "#F4F6F9"
                              : "white",
                          color: state.isSelected ? "#4CC6CF" : "#5E7683",
                        }),
                      }}
                    />

                    <span className={`select-icon ${isFocused.country ? "active" : ""}`}>
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
                      </svg>
                    </span>

                    {error.country && error.region && (
                      <div className="validation">{error.country}</div>
                    )}
                  </div>
                </Form.Group>

                <div className="form-buttons">
                  <Button
                    className="btn edit-cancel"
                    type="button"
                    onClick={() => {
                      setEditProfilePopupShow((prev) => !prev);
                      setPropertyState();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={
                      "btn edit-save " + (saveDisabled ? "disable" : "")
                    }
                    type="button"
                    onClick={handleEditProfile}
                    disabled={saveDisabled}
                  >
                    Save
                    <img
                      src={path_image + "correct.svg"}
                      alt=""
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>
                </div>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <div className="pop_up">
        <Modal
          show={showConfirmationModal}
          onHide={() => setShowConfirmationModal(false)}
          backdrop="static"
          keyboard={false}
          centered
          className="edit-confirmation"
          size="lg"
        >
          <Modal.Body>
            <div className="confirmation-card">
              <div className="check-icon">
                <img src={path_image + "check-icon-img.png"} alt="success" />
              </div>
              <h2 className="title">All Set</h2>
              <div className="description-box">
                <p className="description allset-msg">
                  Your profile information has been saved
                  <br /> and updated.
                </p>
                <Button
                  type="button"
                  className="btn edit-done"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default EditProfilePopup;
