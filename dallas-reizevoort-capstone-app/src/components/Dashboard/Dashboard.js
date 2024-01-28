import React from "react";
import useAuth from "../../useAuth";
import { useState, useEffect, useRef } from "react";
import "./Dashboard.scss";
import spotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "../TrackSearchResult";
import Player from "../Player";
import Header from "../Header/Header";
import { Routes, Route } from "react-router-dom";

function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
  }

  console.log(searchResults);

  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
    })
  );
  const cancel = useRef(false);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    cancel.current = false;
    if (!search) return setSearchResults([]);
    if (!accessToken || !spotifyApi.current.getAccessToken()) return;
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      spotifyApi.current.searchTracks(search).then((res) => {
        if (cancel.current) return;
        setSearchResults(
          res.body.tracks.items.map((track) => {
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
              albumUrl: smallestAlbumImage.url, // Removed the trailing period here
            };
          })
        );
      });
    }, 300);
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      cancel.current = true;
    };
  }, [search, accessToken]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);
    spotifyApi.current.getMyTopArtists().then((res) => {
      setTopArtists(res.body.items);

      const allGenres = res.body.items.flatMap((artist) => artist.genres);
      const genreCount = allGenres.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});
      const topGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([genre]) => genre);
      setTopGenres(topGenres);
    });

    spotifyApi.current.getMyTopTracks().then((res) => {
      setTopTracks(res.body.items);
      console.log(res.body.items);
    });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);
    spotifyApi.current.getMyRecentlyPlayedTracks({ limit: 10 })
      .then((response) => {
        setRecentlyPlayed(response.body.items);
      });
  }, [accessToken]);

  return (
    <div className="dashboard">
      <Header />
      <section className="dashboard__hero">
        {/* <form className="dashboard__form" onSubmit={handleSearch}> */}
        {/* <input
            className="dashboard__input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          /> */}
        {/* <button className="dashboard__button" type="submit">
            Search
          </button> */}
        {/* </form> */}
      </section>
      <div className="dashboard__songs"></div>
      {searchResults.map((track) => (
        <TrackSearchResult
          track={track}
          key={track.uri}
          chooseTrack={chooseTrack}
        />
      ))}

      {/* <Player accessToken={accessToken} trackUri={playingTrack?.uri} /> */}
      <div className="dashboard__top">
        <Routes>
          <Route
            path="/top-artists"
            element={
              <div className="dashboard__artists">
                {topArtists.map((artist, index) => (
                  <div key={index} className="artist">
                    <span className="artist__rank">{index + 1}.</span>
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="artist__image"
                    />
                    <span className="artist__title">{artist.name}</span>
                  </div>
                ))}
              </div>
            }
          />
          <Route
            path="/top-tracks"
            element={
              <div className="dashboard__tracks">
                {topTracks.map((track, index) => (
                  <div key={index} className="track">
                    <span className="track__rank">{index + 1}.</span>
                    <img
                      src={track.album?.images[0]?.url}
                      alt={track.name}
                      className="track__image"
                    />
                    <span className="track__title">{track.name}</span>
                  </div>
                ))}
              </div>
            }
          />
          <Route
            path="/top-genres"
            element={
              <div className="dashboard__genres">
                {topGenres.map((genre, index) => (
                  <div key={index} className="genre">
                    <span className="genre__rank">{index + 1}.</span>
                    <span className="genre__type">{genre}</span>
                  </div>
                ))}
              </div>
            }
          />
          <Route
            path="/recently-played"
            element={
              <div className="dashboard__recents">
                {recentlyPlayed.map((track, index) => (
                  <div key={index} className="recent">
                    <span className="track__rank">{index + 1}.</span>
                    <img
                      src={track.track.album.images[0].url}
                      alt={track.track.name}
                      className="track__image"
                    />
                    <span className="track__title">{track.track.name}</span>
                  </div>
                ))}
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
