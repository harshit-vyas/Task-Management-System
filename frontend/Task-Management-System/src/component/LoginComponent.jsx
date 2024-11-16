import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { loginApi, saveLoggedUser } from "../service/AuthApiService";
import { useNavigate } from "react-router-dom";
import "../css/tasks.css";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  async function handleLoginForm(event) {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await loginApi(username, password);

        // Extract necessary data from the response
        const { userId, role, token } = response.data;

        // Save the logged user details and token
        saveLoggedUser(userId, username, role, token);

        // Redirect to tasks page on successful login
        navigate(`/tasks`);
      } catch (error) {
        console.error("Login failed: ", error);
        // Handle errors (e.g., show a toast notification or set an error state)
      }
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    // Validate username
    if (!username.trim()) {
      errorsCopy.username = "Username is required";
      valid = false;
    } else {
      errorsCopy.username = "";
    }

    // Validate password
    if (!password.trim()) {
      errorsCopy.password = "Password is required";
      valid = false;
    } else {
      errorsCopy.password = "";
    }

    setErrors(errorsCopy);
    return valid;
  }

  return (
    <div className="login-page">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            {/* Adjust the image path as needed */}
            <img
              src="/src/assets/loginPage.jpg"
              alt="Login Page"
              className="img-fluid"
            />
          </Col>
          <Col md={6}>
            <div className="login-form bg-light shadow-lg p-4">
              <h2 className="mb-4 text-center">Login</h2>
              <form onSubmit={handleLoginForm}>
                {/* Username input */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                {/* Password input */}
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                {/* Submit button */}
                <div className="text-center">
                  <button type="submit" className="btn btn-dark btn-block">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginComponent;
