import React, { useState, useMemo, useCallback } from "react";
import { Container, Form, Row, Button } from "react-bootstrap";
import Select from "react-select";
import { countryRegionArray } from "../../../../constants/countryRegion";
import { useNavigate } from "react-router-dom";
import { handleSubmit } from "../../../../services/authService";

const Login = ({ userDetails, setLoader }) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const navigate = useNavigate();

  // State
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errors, setErrors] = useState({});

  // Options
  const roleOptions = useMemo(
    () => [
      { value: "Hcp", label: "Hcp" },
      { value: "Staff", label: "Staff" },
      { value: "Test", label: "Test" },
    ],
    []
  );

  const regionOptions = useMemo(() => {
    const uniqueRegions = [...new Set(Object.values(countryRegionArray))];
    return uniqueRegions
      .map((region) => ({ value: region, label: region }))
      .sort((a, b) =>
        a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      );
  }, []);

  const countryOptions = useMemo(() => {
    if (!selectedRegion) return [];
    return Object.entries(countryRegionArray)
      .filter(([, region]) => region === selectedRegion.value)
      .map(([country]) => ({ value: country, label: country }));
  }, [selectedRegion]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!selectedRole) newErrors.role = "Role is required.";
    if (!selectedRegion) newErrors.region = "Region is required.";
    if (!selectedCountry) newErrors.country = "Country is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedRole, selectedRegion, selectedCountry]);

  // Handlers
  const handleRegionChange = useCallback((val) => {
    setSelectedRegion(val);
    setSelectedCountry(null);
  }, []);

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
        setLoader
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
      <Container>
        <Row>
          <div className="login">
            <div className="login-box">
              <div className="login-logo">
                <img src={`${path_image}logo-img.svg`} alt="logo" />
              </div>
              <div className="user-name">
                <h6>Welcome, {userDetails?.name || ""}</h6>
              </div>
              <h6>Tell us a bit about you to tailor your experience</h6>
            </div>

            <div className="login-form">
              <form onSubmit={onSubmit}>
                {/* Role */}
                <Form.Group className="form-group">
                  <Form.Label>
                    Role <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className={`split-button ${errors.role ? "error" : ""}`}
                    value={selectedRole}
                    onChange={setSelectedRole}
                    placeholder="Select your role"
                    options={roleOptions}
                  />
                  {errors.role && (
                    <div className="validation">{errors.role}</div>
                  )}
                </Form.Group>

                {/* Region */}
                <Form.Group className="form-group">
                  <Form.Label>
                    Region <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className={`split-button ${errors.region ? "error" : ""}`}
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    placeholder="Select your region"
                    options={regionOptions}
                  />
                  {errors.region && (
                    <div className="validation">{errors.region}</div>
                  )}
                </Form.Group>

                {/* Country */}
                <Form.Group className="form-group">
                  <Form.Label>
                    Country <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className={`split-button ${errors.country ? "error" : ""}`}
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    placeholder="Select your country"
                    options={countryOptions}
                    isDisabled={!selectedRegion}
                  />
                  {errors.country && (
                    <div className="validation">{errors.country}</div>
                  )}
                </Form.Group>

                <Form.Text className="text-muted">
                  Please enter your country and/or region. At least one is
                  required — entering both is recommended for the best
                  experience.
                </Form.Text>

                <Button variant="primary" type="submit">
                  Login
                </Button>
              </form>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
