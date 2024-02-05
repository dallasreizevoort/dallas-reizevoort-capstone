import React, { useState, useEffect, useRef } from "react";
import spotifyWebApi from "spotify-web-api-node";
import SpotifyPlayIcon from "../../assets/images/Spotify_Play.png";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import "./Tracks.scss";

function Tracks({ accessToken, selectedTimeRange, setSelectedTimeRange }) {
  console.log('Tracks component rendered');
  const [topTracks, setTopTracks] = useState([]);
  const [topTracksShort, setTopTracksShort] = useState([]);
  const [topTracksMedium, setTopTracksMedium] = useState([]);
  const [topTracksLong, setTopTracksLong] = useState([]);
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


  // trying async/await instead of callbacks.
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      spotifyApi.current.setAccessToken(accessToken);

      const { body: { items: topTracks } } = await spotifyApi.current.getMyTopTracks({ limit: 50 });
      console.log('Top Tracks:', topTracks); // Add this line
      setTopTracks(topTracks);

      const { body: { items: topTracksShort } } = await spotifyApi.current.getMyTopTracks({ time_range: "short_term", limit: 50 });
      console.log('Short Term Top Tracks:', topTracksShort); // Add this line
      setTopTracksShort(topTracksShort);

      const { body: { items: topTracksMedium } } = await spotifyApi.current.getMyTopTracks({ time_range: "medium_term", limit: 50 });
      console.log('Medium Term Top Tracks:', topTracksMedium); // Add this line
      setTopTracksMedium(topTracksMedium);

      const { body: { items: topTracksLong } } = await spotifyApi.current.getMyTopTracks({ time_range: "long_term", limit: 50 });
      console.log('Long Term Top Tracks:', topTracksLong); // Add this line
      setTopTracksLong(topTracksLong);
    };

    fetchData();
  }, [accessToken]);

  // Render your tracks here
  return (
    <div className="tracks">
      {playingTrackId && <SpotifyPlayer trackId={playingTrackId} />}
      {selectedTimeRange === "short_term" &&
        topTracksShort.map((track, index) => (
          <div key={index} className="tracks__wrapper">
            <div className="track__container">
              <span className="track__rank">{index + 1}</span>
              <img
                src={track.album?.images[0]?.url}
                alt={track.name}
                className="track__image"
              />
              <span className="track__title">{track.name}</span>
            </div>
            <div className="track__container">
              <span className="track__artist">
                {track.artists.map((artist) => artist.name).join(", ")}
              </span>
            </div>
            <div className="track__link">
              <button className="track__button" onClick={() => handlePlay(track.id)}>
                <img
                  src={SpotifyPlayIcon}
                  alt="Spotify Play Icon"
                  className="track__icon"
                />
              </button>
            </div>
          </div>
        ))}
      {selectedTimeRange === "medium_term" &&
        topTracksMedium.map((track, index) => (
          <div key={index} className="tracks__wrapper">
            <div className="track__container">
              <span className="track__rank">{index + 1}</span>
              <img
                src={track.album?.images[0]?.url}
                alt={track.name}
                className="track__image"
              />
              <span className="track__title">{track.name}</span>
            </div>
            <div className="track__container">
              <span className="track__artist">
                {track.artists.map((artist) => artist.name).join(", ")}
              </span>
            </div>
            <div className="track__link">
              <button className="track__button" onClick={() => handlePlay(track.id)}>
                <img
                  src={SpotifyPlayIcon}
                  alt="Spotify Play Icon"
                  className="track__icon"
                />
              </button>
            </div>
          </div>
        ))}
      {selectedTimeRange === "long_term" &&
        topTracksLong.map((track, index) => (
          <div key={index} className="tracks__wrapper">
            <div className="track__container">
              <span className="track__rank">{index + 1}</span>
              <img
                src={track.album?.images[0]?.url}
                alt={track.name}
                className="track__image"
              />
              <span className="track__title">{track.name}</span>
            </div>
            <div className="track__container">
              <span className="track__artist">
                {track.artists.map((artist) => artist.name).join(", ")}
              </span>
            </div>
            <div className="track__link">
              <button className="track__button" onClick={() => handlePlay(track.id)}>
                <img
                  src={SpotifyPlayIcon}
                  alt="Spotify Play Icon"
                  className="track__icon"
                />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Tracks;
