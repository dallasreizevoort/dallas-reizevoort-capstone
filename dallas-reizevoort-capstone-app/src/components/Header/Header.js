import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import Settings from "../Settings/Settings";
import { Link } from "react-router-dom";
import spotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";

function Header({ accessToken, }) {
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const blurTimeout = useRef(null);


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setIsDropdownVisible(true); // Show dropdown when user types
  };

  

  const handleBlur = () => {
    // Hide dropdown and clear input after 100ms delay
    blurTimeout.current = setTimeout(() => {
      setIsDropdownVisible(false);
      setSearch("");
      setSearchResults([]); // Clear previous search results
    }, 100);
  };

  const handleDropdownClick = () => {
    // If dropdown is clicked, clear the timeout to prevent hiding
    clearTimeout(blurTimeout.current);
  };

  const handleSongSelect = (track) => {
    const trackId = track.uri.split(':').pop(); // Extract the ID from the URI
    setPlayingTrackId(trackId);
    setIsDropdownVisible(false);
    setSearch("");
    setSearchResults([]);
  };

  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: process.env.REACT_APP_CLIENT_ID,
    })
  );

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
  
    let cancel = false;
    spotifyApi.current.searchTracks(search, { limit: 5 }).then(res => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );
  
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

  
  
    return () => (cancel = true);
  }, [search, accessToken]);

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
      <div className="header__wrap-all">
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
    
        </div>
      </div>
      <div className="search">
          <input type="text" placeholder="Search a song" value={search} onChange={handleSearchChange} onBlur={handleBlur}className="search__input" />
          {isDropdownVisible && searchResults.length > 0 && (
    <div className="search-dropdown" onMouseDown={handleDropdownClick}>
      {searchResults.map(track => (
        <div key={track.uri} className="search-dropdown__item" onClick={() => handleSongSelect(track)}>
          <div className="search-dropdown__wrapper">
          <img src={track.albumUrl} style={{ height: "20px", width: "20px" }} />
          <div className="search-dropdown__title">{track.title}</div>
          </div>
          <div className="search-dropdown__artist">{track.artist}</div>
        </div>
      ))}
    </div>
    )}
    </div>
      <Settings accessToken={accessToken} />
      </div>
      <div className="search-dropdown__player">
      <SpotifyPlayer trackId={playingTrackId} onClose={() => setPlayingTrackId(null)} />
      </div>
    </div>
  
  );  
}

export default Header;
