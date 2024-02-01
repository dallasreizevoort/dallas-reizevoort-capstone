import React, { useState } from 'react';
import './Settings.scss';
import { useAuthContext } from "../../Auth/AuthProvider";

function Settings() {
  const [isOpen, setIsOpen] = useState(false);


  const { handleLogout } = useAuthContext();

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
        Settings &#9662;
      </h2>
      {isOpen && (
        <ul className="settings__dropdown">
          <li onClick={handleEmailOpt}>Toggle Email Opt-In/Out</li>
          <li onClick={handleSpotifyRedirect}>Go to Spotify</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      )}
    </div>
  );
}

export default Settings;

// function Logout() {
//   const logout = () => {
//     // Clear the access token from local storage (or wherever it's stored)
//     localStorage.removeItem('accessToken');
    
//     // Redirect the user to the login page
//     window.location.href = '/';
//   }

//   return (
//     <button onClick={logout}>Logout</button>
//   );
// }

// export default Logout;