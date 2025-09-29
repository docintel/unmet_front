import React, { useState } from "react";
import { Container, Form, Row, Button } from "react-bootstrap"; 
import Select from "react-select";



const Login = ({userDetails}) => {
  console.log(userDetails,"userDeatils")
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  // State for inputs
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Error state
  const [errors, setErrors] = useState({});

  // Sample options (replace with real data later)
  const roleOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const regionOptions = [
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
  ];

  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "in", label: "India" },
  ];

  const validateForm = () => {
    let newErrors = {};

    if (!selectedRole) {
      newErrors.role = "Role is required.";
    }

    if (!selectedRegion && !selectedCountry) {
      newErrors.region = "Region is required";
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted with values:", {
        role: selectedRole,
        region: selectedRegion,
        country: selectedCountry,
      })
    }
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
              <form onSubmit={handleSubmit}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Role <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className={errors.role ? "split-button error" :"split-button" }
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
                    className={errors.region ? "split-button error" :"split-button" } 
                    value={selectedRegion}
                    onChange={setSelectedRegion}
                    placeholder="Select your region"
                    options={regionOptions}
                  />
                  {errors.region && <div className="validation">{errors.region}</div>}
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>
                    Country <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className= {errors.country ? "split-button error" :"split-button" }
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    placeholder="Select your country"
                    options={countryOptions}
                  />
                  {errors.country && <div className="validation">{errors.country}</div>}
                </Form.Group>
                <Form.Text className="text-muted">
                  Please enter your country and/or region. At least one is required — entering both
                  is recommended for the best experience.
                </Form.Text>
                <Button variant="primary" type="submit" className="mt-3">
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
