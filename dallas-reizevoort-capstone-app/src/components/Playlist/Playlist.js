import React, { useState, useEffect, useRef, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayIcon from "../../assets/images/Spotify_Play.png";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import { useLocation } from "react-router-dom";
import "./Playlist.scss";
import Create from "../../assets/images/create_icon.png";
import Save from "../../assets/images/save_icon.png";
import axios from "axios";

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

  const createPlaylist = async () => {
    try {
      const topTracksResponse = await spotifyApi.current.getMyTopTracks({
        limit: 5,
      });
      const trackIds = topTracksResponse.body.items.map((track) => track.id);

      const recommendationsResponse =
        await spotifyApi.current.getRecommendations({ seed_tracks: trackIds });
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
  const savePlaylist = () => {
    console.log("userID:", userID);
    console.log("newPlaylist.name:", newPlaylist.name);
    console.log("accessToken:", spotifyApi.current.getAccessToken());

    let playlistId;

    // Create a new playlist
    axios
      .post(
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
      )
      .then((response) => {
        playlistId = response.data.id;
        setPlaylistId(playlistId);

        // Map newPlaylist.tracks to an array of track URIs
        const trackUris = newPlaylist.tracks.map((track) => track.uri);

        return axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: trackUris,
          },
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.current.getAccessToken()}`,
              "Content-Type": "application/json",
            },
          }
        );
      })
      .then(() => {
        if (playlistId) {
          return axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
              headers: {
                Authorization: `Bearer ${spotifyApi.current.getAccessToken()}`,
              },
            }
          );
        }
      })
      .then((response) => {
        if (response) {
          setPlaylist(response.data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

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
            Not a fan? Try Again{" "}
            <img
              src={Create}
              className="playlists__icon"
              onClick={createPlaylist}
            ></img>
          </h2>
          <div className="playlists__save">
            <input
              type="text"
              className="playlists__name"
              placeholder="Name your playlist"
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <button
              className="playlists__button"
              alt="playlists button"
              onClick={savePlaylist}
            >
              Save to Spotify
              <a
                href={`https://open.spotify.com/playlist/${playlistId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={Save}
                  className="playlists__icon"
                  alt="playlist save"
                ></img>
              </a>
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
            </div>
          ))}
        </>
      )}
      {!newPlaylist && <p>No tracks in playlist.</p>}
    </div>
  );
}

export default Playlist;
