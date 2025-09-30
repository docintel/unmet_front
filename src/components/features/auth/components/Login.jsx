import React, { useState, useMemo } from "react";
import { Container, Form, Row, Button } from "react-bootstrap"; 
import Select from "react-select";
import { countryRegionArray } from "../../../../constants/countryRegion"; 
import { useNavigate } from "react-router-dom";
import { handleSubmit } from "../../../../services/authService";

const Login = ({ userDetails }) => { 
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const navigate = useNavigate();
  // State for inputs
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Error state
  const [errors, setErrors] = useState({});

  // Sample options (replace with real data later)
  const roleOptions = [
    { value: "Hcp", label: "Hcp" },
    { value: "Staff", label: "Staff" },
    { value: "Test", label: "Test" },
  ];

  // Generate region options dynamically from countryRegionArray
  const regionOptions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(Object.values(countryRegionArray)));
    return uniqueRegions.map(region => ({ value: region, label: region }));
  }, []);

  // Generate country options based on selected region
  const countryOptions = useMemo(() => {
    if (!selectedRegion) return [];
    return Object.entries(countryRegionArray)
      .filter(([country, region]) => region === selectedRegion.value)
      .map(([country]) => ({ value: country, label: country }));
  }, [selectedRegion]);

  const validateForm = () => {
    let newErrors = {};

    if (!selectedRole) {
      newErrors.role = "Role is required.";
    }

    if (!selectedRegion ) {
      newErrors.region = "Region is required"; 
    }

    if( !selectedCountry){
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
  return (
    <div className="login-page">
      <Container>
        <Row>
          <div className="login">
            <div className="login-box">
              <div className="login-logo">
                <img src={path_image + "logo-img.svg"} alt="logo" />
              </div>
              <div className="user-name">
                <h6>Welcome, {userDetails?.name || ""}</h6>
              </div>
              <h6>Tell us a bit about you to tailor your experience</h6>
            </div>

            <div className="login-form">
              <form onSubmit={(e) => handleSubmit(e, selectedRole, selectedRegion, selectedCountry, validateForm,navigate,userDetails)}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Role <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className={errors.role ? "split-button error" : "split-button"}
                    value={selectedRole}
                    onChange={setSelectedRole}
                    placeholder="Select your role"
                    options={roleOptions}
                  />
                  {errors.role && <div className="validation">{errors.role}</div>}
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>
                    Region <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className={errors.region ? "split-button error" : "split-button"}
                    value={selectedRegion}
                    onChange={(val) => {
                      setSelectedRegion(val);
                      setSelectedCountry(null); // reset country when region changes
                    }}
                    placeholder="Select your region"
                    options={regionOptions}
                  />
                  {errors.region && <div className="validation">{errors.region}</div>}
                </Form.Group>

                {/* Country */}
                <Form.Group className="form-group">
                  <Form.Label>
                    Country <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className={errors.country ? "split-button error" : "split-button"}
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    placeholder="Select your country"
                    options={countryOptions}
                    isDisabled={!selectedRegion} // disable until region selected
                  />
                  {errors.country && <div className="validation">{errors.country}</div>}
                </Form.Group>

                <Form.Text className="text-muted">
                  Please enter your country and/or region. At least one is required — entering both
                  is recommended for the best experience.
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
