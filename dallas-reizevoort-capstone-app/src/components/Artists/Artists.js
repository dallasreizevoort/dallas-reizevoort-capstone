import React, { useState, useEffect, useRef } from 'react';
import spotifyWebApi from 'spotify-web-api-node';
import SpotifyIcon from "../../assets/images/Spotify_Play.png";
import './Artists.scss';

function Artists({ accessToken, selectedTimeRange}) {
    const [topArtistsShort, setTopArtistsShort] = useState([]);
    const [topArtistsMedium, setTopArtistsMedium] = useState([]);
    const [topArtistsLong, setTopArtistsLong] = useState([]);

    const spotifyApi = useRef(
        new spotifyWebApi({
            clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
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

    // Render your artists here
    return (
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
                      <span className="artist__title">{artist.name}</span>
                      <div className="artist__link">
                        <a
                          href={artist.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="artist__button"
                        >
                          <img className="artist__icon" src={SpotifyIcon} alt="Spotify Icon" />
                        </a>
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
                      <span className="artist__title">{artist.name}</span>
                      <div className="artist__link">
                        <a
                          href={artist.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="artist__button"
                        >
                          <img className="artist__icon" src={SpotifyIcon} alt="Spotify Icon" />
                        </a>
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
                      <span className="artist__title">{artist.name}</span>
                      <div className="artist__link">
                        <a
                          href={artist.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="artist__button"
                        >
                          <img className="artist__icon" src={SpotifyIcon} alt="Spotify Icon" />
                        </a>
                      </div>
                    </div>
                  ))}
      </div>
    );
  }
  
  export default Artists;