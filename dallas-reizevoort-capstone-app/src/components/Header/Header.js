import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import Settings from "../Settings/Settings";
import { Link } from "react-router-dom";
import HeaderLogo from "../../assets/images/sound-waves.png";
import ExpandArrow from "../../assets/images/Expand_Arrow.png";
import spotifyWebApi from 'spotify-web-api-node';


function Header({ accessToken }) {
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
    })
  );

  useEffect(() => {
    // Set the access token
    spotifyApi.current.setAccessToken(accessToken);

    // Fetch the user's profile data when the component mounts
    spotifyApi.current.getMe()
      .then(data => {
        // Set the user's name
        setUserName(data.body.display_name);

        // Set the user's profile photo
        if (data.body.images.length > 0) {
          setUserPhoto(data.body.images[0].url);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [accessToken]);

  return (
    <div className="header">
      <div className="header__container">
        <Link to="/login">
          <div className="header__wrapper">
            
            <img className="header__avatar" src={userPhoto} alt="User profile" />
            <div className="header__container">
            <h2 className="header__name">Welcome, {userName}</h2>
            
            
            
            <p className="header__text">Let's explore your music</p>
            </div>
            <Settings />
            </div>
           
            
          
        </Link>
      </div>
    </div>
  );
}

export default Header;