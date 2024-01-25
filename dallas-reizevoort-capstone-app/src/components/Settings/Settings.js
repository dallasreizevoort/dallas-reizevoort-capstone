import React, { useState } from 'react';
import './Settings.scss';

function UserSettings() {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmailOpt = (e) => {
    // handle email opt in/out
  };

  const handleSpotifyRedirect = () => {
    // redirect to user's Spotify page
    window.location.href = 'https://open.spotify.com';
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="settings">
      <h2 className="settings__title" onClick={toggleDropdown}>
        Settings &#9662;
      </h2>
      {isOpen && (
        <ul className="settings__dropdown">
          <li onClick={handleEmailOpt}>Toggle Email Opt-In/Out</li>
          <li onClick={handleSpotifyRedirect}>Go to Spotify</li>
        </ul>
      )}
    </div>
  );
}

export default UserSettings;