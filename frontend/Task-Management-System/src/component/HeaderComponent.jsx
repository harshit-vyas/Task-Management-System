import React from "react";
import logo from "../assets/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { isUserLoggedIn, logout } from "../service/AuthApiService";

const HeaderComponent = () => {
  const isAuth = isUserLoggedIn();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isUrlHistory() {
    const url = window.location.href;
    return url.endsWith("history");
  }

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed-top navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          {/* Brand Logo */}
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="logo" width={30} height={30} />
          </NavLink>

          {/* Navbar Toggler for Mobile View */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav gap-4">
              {/* Conditional Rendering of Links Based on Authentication */}
              {isAuth ? (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={isUrlHistory() ? "/tasks" : "/history"}
                  >
                    {isUrlHistory() ? "Tasks" : "Task History"}
                  </NavLink>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/create-account">
                      Create account
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  </li>
                </>
              )}
              {isAuth && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/login"
                    onClick={handleLogout}
                  >
                    Logout
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer to Avoid Overlapping */}
      <div style={{ height: "70px" }}></div>
    </>
  );
};

export default HeaderComponent;
