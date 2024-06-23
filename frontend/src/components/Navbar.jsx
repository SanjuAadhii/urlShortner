import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";
const Navbar = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const navbarStyle = {
    backgroundColor: isAuthenticated ? "green" : "yellow",
    color: isAuthenticated ? "white" : "black",
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-white d-flex justify-content-center`}
    >
      <div className="navbar-nav">
        <Link className="nav-item nav-link active" to="/">
          Url shortner
        </Link>
        <Link className="nav-item nav-link" to="/signup">
          Sign Up
        </Link>
        <Link className="nav-item nav-link" to="/reset-password">
          Reset Password
        </Link>
        <button
          onClick={signOut}
          className={clsx(
            "btn btn-danger",
            isAuthenticated ? "d-block" : "d-none"
          )}
        >
          Signout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
