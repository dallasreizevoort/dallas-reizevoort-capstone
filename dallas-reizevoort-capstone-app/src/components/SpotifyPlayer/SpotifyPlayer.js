import React from "react";
import "./SpotifyPlayer.scss";

function SpotifyPlayer({ trackId }) {
  return (
    <div className="spotify-player">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?theme=white&view=list`}
        width="300"
        height="150"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
    </div>
  );
}

export default SpotifyPlayer;
