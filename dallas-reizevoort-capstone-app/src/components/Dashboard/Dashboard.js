import React from "react";
import useAuth from "../../useAuth";
import { useState, useEffect, useRef } from "react";
import "./Dashboard.scss";
import spotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "../TrackSearchResult";
import Player from "../Player";

function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState(); 
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);


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
    });

    spotifyApi.current.getMyTopTracks().then((res) => {
      setTopTracks(res.body.items);
    });
  }, [accessToken]);


  return (
    <div className="dashboard">
      <form className="dashboard__form" onSubmit={handleSearch}>
        <input
          className="dashboard__input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <button className="dashboard__button" type="submit">
          Search
        </button>
        <div className="dashboard__songs">
        </div>
        {searchResults.map(track => (
          <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
        ))}
      </form>
      <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      <div className="dashboard__top">
        <div className="dashboard__top--artists">
          <h2>Top Artists</h2>
          {topArtists.map((artist, index) => (
            <div key={index}>
              <img src={artist.images[0]?.url} alt={artist.name} />
              {artist.name}</div>
          ))};
          </div>
          <div className="dashboard__top--tracks">
            <h2>Top Tracks</h2>
            {topTracks.map((track, index) => (
              <div key={index}>{track.name}</div>
            ))};
            </div>
    </div>
    </div>
  );
}

export default Dashboard;
