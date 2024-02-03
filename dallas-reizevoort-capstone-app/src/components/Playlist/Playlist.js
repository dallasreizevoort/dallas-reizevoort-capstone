import React, { useState, useEffect, useRef, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayIcon from "../../assets/images/Spotify_Play.png";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import { useLocation } from "react-router-dom";
import "./Playlist.scss";

function Playlist({ accessToken }) {
  const [userID, setUserID] = useState();
  const [playlist, setPlaylist] = useState(null); // New state variable for the playlist
  const [newPlaylist, setNewPlaylist] = useState(null);
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const location = useLocation();

  const spotifyApi = useRef(
    new SpotifyWebApi({
      clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
    })
  );

  useEffect(() => {
    setPlaylistCreated(false);
    setNewPlaylist(null);
  }, [location]);

  useEffect(
    (playlist) => {
      console.log("Playlist state:", playlist);
    },
    [playlist]
  );

  const handlePlay = (trackId) => {
    console.log("Playing track with ID:", trackId); // Add this line
    setPlayingTrackId(trackId);
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);

    // Get the user's ID
    spotifyApi.current.getMe().then((res) => {
      setUserID(res.body.id);
      console.log("User ID:", res.body.id); // Log the user ID
    });
  }, [accessToken]);

  // Cant use callbacks here, playlist stays undefined
  const createPlaylist = async () => {
    try {
      // Get the user's top tracks
      const topTracksResponse = await spotifyApi.current.getMyTopTracks({
        limit: 5,
      });
      const trackIds = topTracksResponse.body.items.map((track) => track.id);

      // Get recommendations based on these tracks
      const recommendationsResponse =
        await spotifyApi.current.getRecommendations({ seed_tracks: trackIds });
      const tracks = recommendationsResponse.body.tracks.map((track) => ({
        uri: track.uri,
        name: track.name,
        artist: track.artists[0].name,
        artwork: track.album.images[0].url,
        id: track.id,
      }));

      // Create a new playlist in the state
      setNewPlaylist({ name: "New Playlist", tracks });
    } catch (err) {
      console.error("Error:", err);
    }
    setPlaylistCreated(true);
  };

  const savePlaylist = async () => {
    try {
      // Create a new playlist on Spotify
      const playlistData = await spotifyApi.current.createPlaylist(
        userID,
        newPlaylist.name,
        { public: false, description: playlistDescription }
      );
      const playlistId = playlistData.body.id;

      // Add tracks to the playlist
      await spotifyApi.current.addTracksToPlaylist(
        playlistId,
        newPlaylist.tracks
      );

      // Fetch the playlist data
      const data = await spotifyApi.current.getPlaylist(playlistId);
      setPlaylist(data.body); // Update the playlist state
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="playlists">
      {!playlistCreated ? (
        <>
          <h2>Create a playlist based off your most listened to songs</h2>
          <button onClick={createPlaylist}>Create</button>
        </>
      ) : (
        <>
          <h2>Not a fan of this one? Try Again</h2>
          <button onClick={createPlaylist}>Create</button>
        </>
      )}
      {playingTrackId && <SpotifyPlayer trackId={playingTrackId} />}
      {newPlaylist && newPlaylist.tracks && newPlaylist.tracks.length > 0 ? (
        newPlaylist.tracks.map((track, index) => (
          <div key={index} className="playlist">
            <div className="playlist__container">
              <img
                src={track.artwork}
                alt={track.name}
                className="playlist__image"
              />
              <span className="playlist__title">{track.name} </span>
            </div>
            <div className="playlist__container">
              <span className="playlist__artist">{track.artist} </span>
              <div className="playlist__link">
                <button className="playlist__button" onClick={() => handlePlay(track.id)}>
                  <img
                    src={SpotifyPlayIcon}
                    alt="Spotify Play Icon"
                    className="playlist__icon"
                  />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No tracks in playlist.</p>
      )}
      <input
        type="text"
        placeholder="Enter a description"
        onChange={(e) => setPlaylistDescription(e.target.value)}
      />
      <button onClick={savePlaylist}>Save to Spotify</button>
    </div>
  );
}

export default Playlist;
