import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { registerApi } from "../service/AuthApiService";
import { useNavigate } from "react-router-dom";
import "../css/tasks.css";

const CreateAccount = () => {
  // State variables for form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Handler for form submission
  function handleRegistrationForm(event) {
    event.preventDefault();

    if (validateForm()) {
      // Construct registration data object
      const registerData = {
        firstName,
        lastName,
        username,
        email,
        password,
        role: "USER", // Default role
      };

      setLoading(true);
      setApiError("");

      // Call API to register user
      registerApi(registerData)
        .then((response) => {
          console.log("Registration successful:", response.data);
          navigate("/login"); // Navigate to login page on success
        })
        .catch((error) => {
          setApiError("Registration failed. Please try again.");
          console.error("Error during registration:", error);
        })
        .finally(() => setLoading(false));
    }
  }

  // Form validation logic
  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!firstName.trim()) {
      errorsCopy.firstName = "First name required";
      valid = false;
    } else {
      errorsCopy.firstName = "";
    }

    if (!lastName.trim()) {
      errorsCopy.lastName = "Last name required";
      valid = false;
    } else {
      errorsCopy.lastName = "";
    }

    if (!username.trim()) {
      errorsCopy.username = "Username required";
      valid = false;
    } else {
      errorsCopy.username = "";
    }

    if (!email.trim()) {
      errorsCopy.email = "Email required";
      valid = false;
    } else if (!isValidEmail(email)) {
      errorsCopy.email = "Invalid email address";
      valid = false;
    } else {
      errorsCopy.email = "";
    }

    if (!password.trim()) {
      errorsCopy.password = "Password required";
      valid = false;
    } else if (!isValidPassword(password)) {
      errorsCopy.password = "Password must be at least 6 characters long";
      valid = false;
    } else {
      errorsCopy.password = "";
    }

    setErrors(errorsCopy);
    return valid;
  }

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation function
  function isValidPassword(password) {
    return password.length >= 6;
  }

  return (
    <div className="signup-page">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <img
              src="/src/assets/loginPage.jpg"
              alt="Login Page"
              className="img-fluid"
            />
          </Col>
          <Col md={6}>
            <div className="signup-form shadow-lg p-5 rounded-3">
              <h2 className="mb-4 text-center">Create Account</h2>
              {apiError && <div className="alert alert-danger">{apiError}</div>}
              <form onSubmit={handleRegistrationForm}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="firstName"
                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                    placeholder="First Name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    aria-describedby="firstNameHelp"
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="lastName"
                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    aria-describedby="lastNameHelp"
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    aria-describedby="usernameHelp"
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-describedby="emailHelp"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-describedby="passwordHelp"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-dark btn-block"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create"}
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

export default CreateAccount;
