import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import logo from "../../public/data/logo2.png";
import { AuthContext } from "../context/Authcontext";
import "../css/Navbar2.css"; // Import the CSS file here

const Navbar2 = ({ color = "black" }) => {
  const textColor = color === "white" ? "text-white" : "text-black";
  const { userLoggedIn, userLogout } = useContext(AuthContext);
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Hotel Logo" className="logo-image" />
        <span className={`navbar-title ${textColor}`}>URBAN OASIS</span>
      </div>

      <div className="navbar-links">
        <Link to="/" className={`link ${textColor}`}>
          Home
        </Link>
        <Link to="/AboutUs" className={`link ${textColor}`}>
          About Us
        </Link>
        <Link to="/Facilities" className={`link ${textColor}`}>
          Facilities
        </Link>
        <Link to="/RoomsPage" className={`link ${textColor}`}>
          Rooms
        </Link>
      </div>

      <div className="navbar-auth">
        <Link to="/AuthPage" className="auth-icon">
          <FaUser className={`icon ${textColor}`} />
        </Link>
        <span className={`auth-text ${textColor}`}>
          {userLoggedIn ? (
            <button onClick={userLogout} className="auth-button">
              <Link to="/" className={textColor}>
                Logout
              </Link>
            </button>
          ) : (
            <button className="auth-button">
              <Link to="/AuthPage" className={textColor}>
                Login/SignUp
              </Link>
            </button>
          )}
        </span>
      </div>
    </nav>
  );
};

export default Navbar2;
