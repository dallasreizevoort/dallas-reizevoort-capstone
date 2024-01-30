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
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState([]);
  const [topArtistsShort, setTopArtistsShort] = useState([]);
  const [topArtistsMedium, setTopArtistsMedium] = useState([]);
  const [topArtistsLong, setTopArtistsLong] = useState([]);
  const [topTracksShort, setTopTracksShort] = useState([]);
  const [topTracksMedium, setTopTracksMedium] = useState([]);
  const [topTracksLong, setTopTracksLong] = useState([]);
  const [topGenresShort, setTopGenresShort] = useState([]);
  const [topGenresMedium, setTopGenresMedium] = useState([]);
  const [topGenresLong, setTopGenresLong] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("short_term");

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
    

    spotifyApi.current
      .getMyTopArtists({ time_range: "short_term", limit: 50 })
      .then((res) => {
        setTopArtistsShort(res.body.items);
      });
    spotifyApi.current
      .getMyTopArtists({ time_range: "medium_term", limit: 50 })
      .then((res) => {
        setTopArtistsMedium(res.body.items);
      });
    spotifyApi.current
      .getMyTopArtists({ time_range: "long_term", limit: 50 })
      .then((res) => {
        setTopArtistsLong(res.body.items);
      });
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

  // useEffect(() => {
  //   if (!accessToken) return;
  //   spotifyApi.current.setAccessToken(accessToken);
  //   spotifyApi.current.getMyTopArtists().then((res) => {
  //     setTopArtists(res.body.items);

  //     const allGenres = res.body.items.flatMap((artist) => artist.genres);
  //     const genreCount = allGenres.reduce((acc, genre) => {
  //       acc[genre] = (acc[genre] || 0) + 1;
  //       return acc;
  //     }, {});
  //     const topGenres = Object.entries(genreCount)
  //       .sort((a, b) => b[1] - a[1])
  //       .slice(0, 5)
  //       .map(([genre]) => genre);
  //     setTopGenres(topGenres);
  //   });

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);

    // Define a helper function to calculate top genres
    const calculateTopGenres = (artists) => {
      const allGenres = artists.flatMap((artist) => artist.genres);
      const genreCount = allGenres.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10) // Display top 10 genres
        .map(([genre]) => genre);
    };

    // Fetch data for each time range
    const timeRanges = ["short_term", "medium_term", "long_term"];
    timeRanges.forEach((timeRange) => {
      spotifyApi.current
        .getMyTopArtists({ time_range: timeRange, limit: 50 })
        .then((res) => {
          const topGenres = calculateTopGenres(res.body.items);
          if (timeRange === "short_term") {
            setTopGenresShort(topGenres);
          } else if (timeRange === "medium_term") {
            setTopGenresMedium(topGenres);
          } else if (timeRange === "long_term") {
            setTopGenresLong(topGenres);
          }
        });
    });

    spotifyApi.current.getMyTopTracks({ limit: 50 }).then((res) => {
      setTopTracks(res.body.items);
      console.log(res.body.items);

      spotifyApi.current
      .getMyTopTracks({ time_range: "short_term", limit: 50 })
        .then((res) => {
          setTopTracksShort(res.body.items);
        });
      spotifyApi.current
      .getMyTopTracks({ time_range: "medium_term", limit: 50 })
        .then((res) => {
          setTopTracksMedium(res.body.items);
        });
      spotifyApi.current
      .getMyTopTracks({ time_range: "long_term", limit: 50 })
        .then((res) => {
          setTopTracksLong(res.body.items);
        });
    });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);
    spotifyApi.current
      .getMyRecentlyPlayedTracks({ limit: 50 })
      .then((response) => {
        setRecentlyPlayed(response.body.items);
      });
  }, [accessToken]);

  return (
    <div className="dashboard">
      <Header />
      <section className="dashboard__hero">
        <button className="dashboard__btn" onClick={() => setSelectedTimeRange("short_term")}>
          Past 4 weeks
        </button>
        <button className="dashboard__btn" onClick={() => setSelectedTimeRange("medium_term")}>
          Past 6 months
        </button>
        <button className="dashboard__btn" onClick={() => setSelectedTimeRange("long_term")}>
          All time
        </button>

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
                {selectedTimeRange === "short_term" &&
                  topArtistsShort.map((artist, index) => (
                    <div key={index} className="artist">
                      <div className="artist__container">
                      <span className="artist__rank">{index + 1}</span>
                      <img
                        src={artist.images[0]?.url}
                        alt={artist.name}
                        className="artist__image"
                      />
                      </div>
                      <span className="artist__title">{artist.name}</span>
                    </div>
                  ))}
                {selectedTimeRange === "medium_term" &&
                  topArtistsMedium.map((artist, index) => (
                    <div key={index} className="artist">
                      <div className="artist__container">
                      <span className="artist__rank">{index + 1}</span>
                      <img
                        src={artist.images[0]?.url}
                        alt={artist.name}
                        className="artist__image"
                      />
                      </div>
                      <span className="artist__title">{artist.name}</span>
                    </div>
                  ))}
                {selectedTimeRange === "long_term" &&
                  topArtistsLong.map((artist, index) => (
                    <div key={index} className="artist">
                      <div className="artist__container">
                      <span className="artist__rank">{index + 1}</span>
                      <img
                        src={artist.images[0]?.url}
                        alt={artist.name}
                        className="artist__image"
                      />
                      </div>
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
                {selectedTimeRange === "short_term" &&
                  topTracksShort.map((track, index) => (
                    <div key={index} className="track">
                      <span className="track__rank">{index + 1}</span>
                      <img
                        src={track.album?.images[0]?.url}
                        alt={track.name}
                        className="track__image"
                      />
                      <span className="track__title">{track.name}</span>
                    </div>
                  ))}
                {selectedTimeRange === "medium_term" &&
                  topTracksMedium.map((track, index) => (
                    <div key={index} className="track">
                      <span className="track__rank">{index + 1}</span>
                      <img
                        src={track.album?.images[0]?.url}
                        alt={track.name}
                        className="track__image"
                      />
                      <span className="track__title">{track.name}</span>
                    </div>
                  ))}
                {selectedTimeRange === "long_term" &&
                  topTracksLong.map((track, index) => (
                    <div key={index} className="track">
                      <span className="track__rank">{index + 1}</span>
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
                {selectedTimeRange === "short_term" &&
                  topGenresShort.map((genre, index) => (
                    <div key={index} className="genre">
                      <span className="genre__rank">{index + 1}</span>
                      <span className="genre__title">{genre}</span>
                    </div>
                  ))}
                {selectedTimeRange === "medium_term" &&
                  topGenresMedium.map((genre, index) => (
                    <div key={index} className="genre">
                      <span className="genre__rank">{index + 1}</span>
                      <span className="genre__title">{genre}</span>
                    </div>
                  ))}
                {selectedTimeRange === "long_term" &&
                  topGenresLong.map((genre, index) => (
                    <div key={index} className="genre">
                      <span className="genre__rank">{index + 1}</span>
                      <span className="genre__title">{genre}</span>
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
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
