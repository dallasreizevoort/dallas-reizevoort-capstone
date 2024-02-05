import React, { useState } from 'react';
import './Settings.scss';
import SettingsIcon from '../../assets/images/Settings_Icon.png';

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
      <img className="settings__icon" onClick={toggleDropdown} src={SettingsIcon} alt="settings" />
      
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

