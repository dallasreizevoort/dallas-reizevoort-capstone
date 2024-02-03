import React, { useState } from 'react';
import './Settings.scss';
import DropDownArrow from "../../assets/images/Expand_Arrow.png";

function Settings() {
  const [isOpen, setIsOpen] = useState(false);


  

  const handleEmailOpt = (e) => {
    // handle email opt in/out
  };

  const handleSpotifyRedirect = () => {
  
    window.location.href = 'https://open.spotify.com';
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="settings">
      <h2 className="settings__title" onClick={toggleDropdown}>
        Settings <img className="settings__icon" src={DropDownArrow} alt="expand arrow" />
      </h2>
      {isOpen && (
        <ul className="settings__dropdown">
          <li onClick={handleEmailOpt}>Toggle Email Opt-In/Out</li>
          <li onClick={handleSpotifyRedirect}>Go to Spotify</li>
          <li> Logout</li>
        </ul>
      )}
    </div>
  );
}

export default Settings;

