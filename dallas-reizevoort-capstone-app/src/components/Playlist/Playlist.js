import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import { useLocation } from "react-router-dom";
import "./Playlist.scss";
import SpotifyPlayIcon from "../../assets/images/Spotify_Play.png";
import Create from "../../assets/images/create_icon.png";
import Save from "../../assets/images/save_icon.png";
import Refresh from "../../assets/images/icons8-refresh-90.png";

function Playlist({ accessToken }) {
  const [userID, setUserID] = useState();
  const [playlist, setPlaylist] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState(null);
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const location = useLocation();
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistName, setPlaylistName] = useState("");

  const spotifyApi = useRef(
    new SpotifyWebApi({
      clientId: process.env.REACT_APP_CLIENT_ID,
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
    console.log("Playing track with ID:", trackId);
    setPlayingTrackId(trackId);
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);

    spotifyApi.current.getMe().then((res) => {
      setUserID(res.body.id);
      console.log("User ID:", res.body.id);
    });
  }, [accessToken]);

  useEffect(() => {
    console.log(
      "playlistId or playlistCreated changed:",
      playlistId,
      playlistCreated
    );
  }, [playlistId, playlistCreated]);

  const createPlaylist = async () => {
    try {
      const topTracksResponse = await spotifyApi.current.getMyTopTracks({
        limit: 20,
        time_range: "medium_term"
      });
      const trackIds = topTracksResponse.body.items.map((track) => track.id);
      const seedTracks = trackIds.slice(0, 5);

      const recommendationsResponse =
        await spotifyApi.current.getRecommendations({ seed_tracks: seedTracks });
      const tracks = recommendationsResponse.body.tracks.map((track) => ({
        uri: track.uri,
        name: track.name,
        artist: track.artists[0].name,
        artwork: track.album.images[0].url,
        id: track.id,
      }));

      setNewPlaylist({ name: "New Playlist", tracks });
    } catch (err) {
      console.error("Error:", err);
    }
    setPlaylistCreated(true);
  };

  // Had to use axios to make the post. spotifyApi library was giving me problems here.
  const savePlaylist = async () => {
    try {
      const response = await axios.post(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          name: playlistName,
          public: false,
          description: playlistDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.current.getAccessToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newPlaylistId = response.data.id;
      const trackUris = newPlaylist.tracks.map((track) => track.uri);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
        { uris: trackUris },
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.current.getAccessToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const playlistResponse = await axios.get(
        `https://api.spotify.com/v1/playlists/${newPlaylistId}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.current.getAccessToken()}`,
          },
        }
      );

      setPlaylistId(newPlaylistId);
      setPlaylist(playlistResponse.data);
      setPlaylistCreated(true);
      window.open(playlistResponse.data.external_urls.spotify);
    } catch (err) {
      console.error("Error:", err);
    }
  };
  console.log(
    "Rendering... Current playlistId:",
    playlistId,
    "Playlist Created:",
    playlistCreated
  );
  return (
    <div className="playlists">
      {!newPlaylist ||
      !newPlaylist.tracks ||
      newPlaylist.tracks.length === 0 ? (
        <>
          <h2 className="playlists__header">
            Create a playlist based on your top songs
          </h2>
          <div className="playlists__create">
            <button className="playlists__button" onClick={createPlaylist}>
              Create{" "}
              <img
                src={Create}
                className="playlists__icon"
                alt="create icon"
              ></img>
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="playlists__header">
            Not a fan? Try again{" "}
            <img
              src={Refresh}
              className="playlists__icon"
              onClick={createPlaylist}
            ></img>
          </h2>
          <div className="playlists__save">
            <input
              type="text"
              className="playlists__name"
              placeholder="Name your playlist"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <button
              className="playlists__button"
              alt="playlists button"
              onClick={savePlaylist}
            >
              Save to Spotify
              {console.log("Rendering link with playlistId:", playlistId)}
              <img src={Save} className="playlists__icon" alt="playlist save" />
            </button>
          </div>
        </>
      )}
      {playingTrackId && <SpotifyPlayer trackId={playingTrackId} />}
      {newPlaylist && newPlaylist.tracks && newPlaylist.tracks.length > 0 && (
        <>
          {newPlaylist.tracks.map((track, index) => (
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
              </div>
              <div className="playlist__link">
                <button
                  className="playlist__button"
                  onClick={() => handlePlay(track.id)}
                >
                  <img
                    src={SpotifyPlayIcon}
                    alt="Spotify Play Icon"
                    className="playlist__icon"
                  />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {!newPlaylist}
    </div>
  );
}

export default Playlist;
