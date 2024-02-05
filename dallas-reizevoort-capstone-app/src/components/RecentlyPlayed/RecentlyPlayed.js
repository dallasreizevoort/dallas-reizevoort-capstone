import React, { useState, useEffect, useRef } from "react";
import spotifyWebApi from "spotify-web-api-node";
import SpotifyIcon from "../../assets/images/Spotify_Icon_RGB_Green.png";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import "./RecentlyPlayed.scss";

function RecentlyPlayed({ accessToken }) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [playingTrackId, setPlayingTrackId] = useState(null);

  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
    })
  );

  const handlePlay = (trackId) => {
    console.log("Playing track with ID:", trackId); // Add this line
    setPlayingTrackId(trackId);
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);

    spotifyApi.current.getMyRecentlyPlayedTracks().then((res) => {
      setRecentlyPlayed(res.body.items);
    });
  }, [accessToken]);

  return (
    <div className="recents">
    {playingTrackId && <SpotifyPlayer trackId={playingTrackId} />}
    {recentlyPlayed.map((track, index) => (
      <div key={index} className="recents__wrapper">
        <div className="recent__container">
          <span className="recent__rank">{index + 1}</span>
          <img
            src={track.track.album.images[0].url}
            alt={track.track.name}
            className="recent__image"
          />
          <span className="recent__title">{track.track.name}</span>
          </div>
        <div className="recent__container">
          <span className="recent__artist"> {track.track.artists.map((artist) => artist.name).join(", ")}</span>
          </div>
        <div className="recent__link">
          <button className="recent__button" onClick={() => handlePlay(track.id)}>
            <img
              src={SpotifyIcon}
              alt="Spotify Play Icon"
              className="recent__icon"
            />
          </button>
        </div>
        
      </div>
    ))}
  </div>
  )};

export default RecentlyPlayed;
