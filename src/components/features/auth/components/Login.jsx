import React, { useState } from "react";
import { Container, Form, Row, Button } from "react-bootstrap"; 
import Select from "react-select";


const Login = () => {

  const path_image = import.meta.env.VITE_IMAGES_PATH


  // Separate states for each dropdown
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Sample options (replace with real data later)
  const roleOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const regionOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const countryOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];




  const handleSubmit = (e) => {
    e.preventDefault(); 
  };

  return (
    <div className="login-page">
      <Container>
        <Row>
          <div className="login">
            <div className="login-box">
              <div className="login-logo">
                <img src={ path_image + "logo-img.svg"} alt="logo" />
              </div>
              <div className="user-name">
                <h6>Welcome, FirstName</h6>
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
                    className="split-button"
                    value={selectedRole}
                    onChange={setSelectedRole}
                    placeholder="Select your role"
                    options={roleOptions}
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>
                    Region <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className="split-button"
                    value={selectedRegion}
                    onChange={setSelectedRegion}
                    placeholder="Select your region"
                    options={regionOptions}
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>
                    Country <span>(Required)</span>
                  </Form.Label>
                  <Select
                    className="split-button"
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    placeholder="Select your country"
                    options={countryOptions}
                  />
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
