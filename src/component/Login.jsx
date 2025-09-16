import React, { useState } from 'react'
import { Container, Form, Row } from 'react-bootstrap'
import Logo from '../assets/images/logo-img.svg'
import Select from 'react-select'
import { Button } from 'react-bootstrap'

const Login = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    console.log(`Option selected:`, selectedOption);
    const role = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]
    const region = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]
    const country = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]
    return (
    <div className='login-page'>
    <Container>
        <Row>
            <div className="login">
                <div className="login-box">
                    <div className="login-logo">
                        <img src={Logo} alt="logo" />
                    </div>
                    <div className="user-name">
                        <h6>Welcome, FirstName</h6>
                    </div>
                    <h6>Tell us a bit about you to tailor your experience</h6>
                </div>
                <div className="login-form">
                    <form action="">
                        <Form.Group className="form-group" controlId="formBasicEmail">
                            <Form.Label>Role <span>(Required)</span></Form.Label>
                            <Select className='split-button'
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                placeholder="Select your role"
                                options={role} />
                        </Form.Group>
                        <Form.Group className="form-group" controlId="formBasicEmail">
                            <Form.Label>Region <span>(Required)</span></Form.Label>
                            <Select className='split-button'
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                placeholder="Select your region"
                                options={region} />
                        </Form.Group>
                        <Form.Group className="form-group" controlId="formBasicEmail">
                            <Form.Label>Country <span>(Required)</span></Form.Label>
                            <Select className='split-button'
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                placeholder="Select your country"
                                options={country} />
                        </Form.Group>
                        <Form.Text className="text-muted">
                        Please enter your country and/or region. At least one is required — entering both is recommended for the best experience.
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
  )
}

export default Login