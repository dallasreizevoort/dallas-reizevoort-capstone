import React, { useState, useEffect, useRef } from 'react';
import spotifyWebApi from 'spotify-web-api-node';
import SpotifyIcon from "../../assets/images/Spotify_Icon_RGB_White.png";
import './Genres.scss';

function Genres( {accessToken, selectedTimeRange}) {
    const [topGenresShort, setTopGenresShort] = useState([]);
    const [topGenresMedium, setTopGenresMedium] = useState([]);
    const [topGenresLong, setTopGenresLong] = useState([]);

    const spotifyApi = useRef(
        new spotifyWebApi({
            clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
        })
    );

    const calculateTopGenres = (artists) => {
        const allGenres = artists.flatMap((artist) => artist.genres);
        const genreCounts = allGenres.reduce((counts, genre) => {
          counts[genre] = (counts[genre] || 0) + 1;
          return counts;
        }, {});
        return Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15);
      };

    useEffect(() => {
      if (!accessToken) return;
      spotifyApi.current.setAccessToken(accessToken);

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
    }, [accessToken]);

      return (
        <div className="genres">
        {selectedTimeRange === "short_term" &&
          topGenresShort.length > 0 && (
            <>
              {topGenresShort.map(([genre, count], index) => (
                <div key={index} className="genres__wrapper">
                  <div className="genre">
                    <span className="genre__rank">{index + 1}</span>
                    <span className="genre__title">{genre}</span>
                  </div>
                  <progress
                    value={count}
                    max={Math.max(
                      ...topGenresShort.map(([_, count]) => count)
                    )}
                  ></progress>
                </div>
              ))}
            </>
          )}
        {selectedTimeRange === "medium_term" &&
          topGenresMedium.length > 0 && (
            <>
              {topGenresMedium.map(([genre, count], index) => (
                <div key={index} className="genres__wrapper">
                  <div className="genre">
                  <span className="genre__rank">{index + 1}</span>
                  <span className="genre__title">{genre}</span>
                  </div>
                  <progress
                    value={count}
                    max={Math.max(
                      ...topGenresMedium.map(([_, count]) => count)
                    )}
                  ></progress>
                </div>
              ))}
            </>
          )}
        {selectedTimeRange === "long_term" &&
          topGenresLong.length > 0 && (
            <>
              {topGenresLong.map(
                ([genre, count], index) => (
                  console.log("count", count),
                  (
                    <div key={index} className="genres__wrapper">
                      <div className="genre">
                      <span className="genre__rank">{index + 1}</span>
                      <span className="genre__title">{genre}</span>
                      </div>
                      <progress
                        value={count}
                        max={Math.max(
                          ...topGenresLong.map(([_, count]) => count)
                        )}
                      ></progress>
                    </div>
                  )
                )
              )}
            </>
          )}
      </div>
      )

}

export default Genres;