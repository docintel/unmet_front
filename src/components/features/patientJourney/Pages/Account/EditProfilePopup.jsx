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
                    className={"input-with-icon" + (error.name ? " error" : "")}
                  >
                    <span className="icon">
                      <img src={path_image + "hcp-name.svg"} alt="Logo" />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>{" "}
                  {error.name && <div className="validation">{error.name}</div>}
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>
                    Role <span>(Required)</span>
                  </Form.Label>
                  <div
                    className={"input-with-icon" + (error.role ? " error" : "")}
                  >
                    <span className="icon">
                      <img src={path_image + "role-icon.svg"} alt="" />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Enter your role"
                      value={selectedRole}
                      onChange={(e) =>
                        e.target.value.length <= 50 &&
                        setSelectedRole(e.target.value)
                      }
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
                      className={`split-button ${error.region ? "error" : ""}`}
                      value={selectedRegion}
                      onChange={handleRegionChange}
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
                      <img src={path_image + "region-icon.svg"} alt="" />
                    </span>

                    {error.country && error.region && (
                      <div className="validation">{error.region}</div>
                    )}
                  </div>
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>
                    Country 
                    {/* <span>(Required)</span> */}
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
                        error.country && error.region ? "error" : ""
                      }`}
                      value={selectedCountry}
                      onChange={setSelectedCountry}
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
                    />
                    <span>
                      <img src={path_image + "country-icon.svg"} alt="" />
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
