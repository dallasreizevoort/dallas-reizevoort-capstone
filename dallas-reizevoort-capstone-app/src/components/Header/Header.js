import React, { useState } from "react";
import "./Header.scss";
import Settings from "../Settings/Settings";
import { Link } from "react-router-dom";
import HeaderLogo from "../../assets/images/sound-waves.png";
import ExpandArrow from "../../assets/images/Expand_Arrow.png";

function Header() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="header">
      <div className="header__container">
        <img className="header__container--logo" src={HeaderLogo} alt="logo" />
        <h1>Soundtrack Analyzer</h1>

        <ul className="header__nav">
          
          <li className="header__nav--list" onClick={toggleDropdown}>
          <div className="header__nav--container">
            Stats <img className="header__nav--icon" src={ExpandArrow} alt="expand arrow" />
            </div>
            
            {isDropdownVisible && (
              <ul className="header__dropdown">
                <Link to="/dashboard/tracks">
                  <li className="header__dropdown--item">Top Tracks</li>
                </Link>
                <Link to="/dashboard/artists">
                  <li className="header__dropdown--item">Top Artists</li>
                </Link>
                <Link to="/dashboard/genres">
                  <li className="header__dropdown--item">Top Genres</li>
                </Link>
                <Link to="/dashboard/recent">
                  <li className="header__dropdown--item">Recently Played</li>
                </Link>
              </ul>
            )}
          </li>
          <Link to="/dashboard/mood">
          <li className="header__nav--list">Your Mood</li>
          </Link>
          <Link to="/dashboard/playlist">
            <li className="header__nav--list">Create a Playlist</li>
          </Link>
          <Settings />
        </ul>
      </div>
       
      </div>
  
  );
}

export default Header;



