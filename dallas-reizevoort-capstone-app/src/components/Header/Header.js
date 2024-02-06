import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import Settings from "../Settings/Settings";
import { Link } from "react-router-dom";
import spotifyWebApi from "spotify-web-api-node";

function Header({ accessToken }) {
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: process.env.REACT_APP_CLIENT_ID,
    })
  );

  useEffect(() => {
    spotifyApi.current.setAccessToken(accessToken);

    spotifyApi.current
      .getMe()
      .then((data) => {
        setUserName(data.body.display_name);

        if (data.body.images.length > 0) {
          const sortedImages = data.body.images.sort(
            (a, b) => b.width - a.width
          );
          setUserPhoto(sortedImages[0].url);
          console.log(sortedImages);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [accessToken]);

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__wrapper">
          <Link to="/login">
            <div
              className="header__avatar"
              style={{ backgroundImage: `url(${userPhoto})` }}
            />
          </Link>
          <div className="header__container">
            <h2 className="header__name">Welcome, {userName}</h2>

            <p className="header__text">Let's explore your music</p>
          </div>
          <Settings accessToken={accessToken} />
        </div>
      </div>
    </div>
  );  
}

export default Header;
