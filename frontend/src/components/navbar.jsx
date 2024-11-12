import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ color }) => {
  const textColor = (color === "white") ? "text-white" : "text-black";
  const navigate = useNavigate(); // Initialize the navigate function

  const handleNavigation = (path) => {
    navigate(path); // Use navigate to change the route
  };

  return (
    <div>
      <nav className="absolute top-0 left-0 w-full p-4 mt-[-20px] flex justify-between items-center bg-transparent">
        <div className="flex items-center">
          <img
            src="/data/logo.png"
            alt="Hotel Logo"
            className="w-24 h-24"
          />
          <span className={`font-bold text-lg ${textColor}`}>URBAN OASIS</span>
        </div>
        <div className="mr-10">
          <ul className={`flex space-x-7 text-black font-bold ${textColor}`}>
            <li>
              <button onClick={() => handleNavigation('/')} className="hover:underline">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/Facilities')} className="hover:underline">
                Facilities
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/RoomsPage')} className="hover:underline">
                Rooms
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/AboutUs')} className="hover:underline">
                About Us
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
