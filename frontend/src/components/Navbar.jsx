import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
      </li>
      {isAuthenticated && user?.role === "admin" && (
        <li>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
        </li>
      )}
      {!isAuthenticated && (
        <>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Register
            </NavLink>
          </li>
        </>
      )}
      {isAuthenticated && (
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      )}
    </>
  );

  return (
    <header className="navbar">
      <div className="nav-container container">
        <Link to="/" className="nav-logo">
          BlogPlatform
        </Link>
        <nav className="nav-menu">
          <ul className="nav-links">{navLinks}</ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
