import React, { useState, useEffect, useRef } from "react";
import spotifyWebApi from "spotify-web-api-node";
import SpotifyIcon from "../../assets/images/Spotify_Icon_RGB_White.png";

function RecentlyPlayed({ accessToken }) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
    })
  );

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);

    spotifyApi.current.getMyRecentlyPlayedTracks().then((res) => {
      setRecentlyPlayed(res.body.items);
    });
  }, [accessToken]);

  return (
    <div className="dashboard__recents">
      {recentlyPlayed.map((track, index) => (
        <div key={index} className="recent">
          <span className="track__rank">{index + 1}</span>
          <img
            src={track.track.album.images[0].url}
            alt={track.track.name}
            className="track__image"
          />
          <span className="track__title">{track.track.name}</span>
        </div>
      ))}
    </div>
  );
}

export default RecentlyPlayed;
