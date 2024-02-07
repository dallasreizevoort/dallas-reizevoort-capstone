import React, { useState, useEffect, useRef } from "react";
import spotifyWebApi from "spotify-web-api-node";
import SpotifyIcon from "../../assets/images/Spotify_Icon_RGB_Green.png";
import "./Artists.scss";

function Artists({ accessToken, selectedTimeRange }) {
  const [topArtistsShort, setTopArtistsShort] = useState([]);
  const [topArtistsMedium, setTopArtistsMedium] = useState([]);
  const [topArtistsLong, setTopArtistsLong] = useState([]);

  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: process.env.REACT_APP_CLIENT_ID,
    })
  );

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);

    spotifyApi.current
      .getMyTopArtists({ time_range: "short_term", limit: 50 })
      .then((res) => {
        setTopArtistsShort(res.body.items);
      });
    spotifyApi.current
      .getMyTopArtists({ time_range: "medium_term", limit: 50 })
      .then((res) => {
        setTopArtistsMedium(res.body.items);
      });
    spotifyApi.current
      .getMyTopArtists({ time_range: "long_term", limit: 50 })
      .then((res) => {
        setTopArtistsLong(res.body.items);
      });
  }, [accessToken]);

  return (
    <div className="artists__container">
    <div className="artists">
    {selectedTimeRange === "short_term" &&
        topArtistsShort.map((artist, index) => (
          <div key={index} className="artist">
            <div className="artist__container">
              <span className="artist__rank">{index + 1}</span>
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="artist__image"
              />
            </div>
            <div className="artist__container-text">
              <div>
            <span className="artist__rank--tablet-desktop">{index + 1}.</span>
              <span className="artist__title">{artist.name}</span>
              </div>
              <div className="artist__link">
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist__button"
                >
                  <img
                    className="artist__icon"
                    src={SpotifyIcon}
                    alt="Spotify Icon"
                  />
                </a>
              </div>
            </div>
          </div>
        ))}
      {selectedTimeRange === "medium_term" &&
        topArtistsMedium.map((artist, index) => (
          <div key={index} className="artist">
            <div className="artist__container">
              <span className="artist__rank">{index + 1}</span>
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="artist__image"
              />
            </div>
            <div className="artist__container-text">
              <div>
            <span className="artist__rank--tablet-desktop">{index + 1}.</span>
              <span className="artist__title">{artist.name}</span>
              </div>
              <div className="artist__link">
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist__button"
                >
                  <img
                    className="artist__icon"
                    src={SpotifyIcon}
                    alt="Spotify Icon"
                  />
                </a>
              </div>
            </div>
          </div>
        ))}
      {selectedTimeRange === "long_term" &&
        topArtistsLong.map((artist, index) => (
          <div key={index} className="artist">
            <div className="artist__container">
              <span className="artist__rank">{index + 1}</span>
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="artist__image"
              />
            </div>
            <div className="artist__container-text">
              <div>
            <span className="artist__rank--tablet-desktop">{index + 1}.</span>
              <span className="artist__title">{artist.name}</span>
              </div>
              <div className="artist__link">
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist__button"
                >
                  <img
                    className="artist__icon"
                    src={SpotifyIcon}
                    alt="Spotify Icon"
                  />
                </a>
              </div>
            </div>
          </div>
        ))}
    </div>
    </div>
  );
}

export default Artists;
