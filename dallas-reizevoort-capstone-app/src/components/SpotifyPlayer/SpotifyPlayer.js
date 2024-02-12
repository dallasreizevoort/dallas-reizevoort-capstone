import React from "react";
import "./SpotifyPlayer.scss";

function SpotifyPlayer({ trackId, onClose }) {
  if (!trackId) {
    return null;
  }

  return (
    <div className="spotify-player">
      <button className="spotify-player__close-button" onClick={onClose}>
        X
      </button>
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?theme=white&view=list`}
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
    </div>
  );
}

export default SpotifyPlayer;
