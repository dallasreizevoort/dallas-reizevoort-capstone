import React, { useState, useEffect, useRef } from "react";
import spotifyWebApi from "spotify-web-api-node";
import { Chart } from "react-google-charts";
import "./Genres.scss";

function Genres({ accessToken, selectedTimeRange }) {
  const [topGenresShort, setTopGenresShort] = useState([]);
  const [topGenresMedium, setTopGenresMedium] = useState([]);
  const [topGenresLong, setTopGenresLong] = useState([]);
  const [totalGenreCount, setTotalGenreCount] = useState(0);
  const [chartSize, setChartSize] = useState({ width: '600px', height: '300px' });
  const [fontSize, setFontSize] = useState(13);

  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: process.env.REACT_APP_CLIENT_ID,
    })
  );

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setChartSize({ width: '100%', height: '200px' });
      setFontSize(10);
    } else if (window.innerWidth > 768 && window.innerWidth <= 1200) {
      setChartSize({ width: '600px', height: '300px' });
      setFontSize(14);
    } else {
      setChartSize({ width: '900px', height: '500px' });
      setFontSize(18);
    }
  }, []);

  const calculateTopGenres = (artists) => {
    const allGenres = artists.flatMap((artist) => artist.genres);
    const genreCounts = allGenres.reduce((counts, genre) => {
      counts[genre] = (counts[genre] || 0) + 1;
      return counts;
    }, {});
    setTotalGenreCount(allGenres.length);
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
  };

  const fetchTopGenres = async (timeRange) => {
    const res = await spotifyApi.current.getMyTopArtists({
      time_range: timeRange,
      limit: 50,
    });
    const topGenres = calculateTopGenres(res.body.items);
    if (timeRange === "short_term") {
      setTopGenresShort(topGenres);
    } else if (timeRange === "medium_term") {
      setTopGenresMedium(topGenres);
    } else if (timeRange === "long_term") {
      setTopGenresLong(topGenres);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);
    fetchTopGenres(selectedTimeRange);
  }, [accessToken, selectedTimeRange]);

  const getChartData = (topGenres) => {
    return [
      ['Genre', 'Count'],
      ...topGenres.map(([genre, count]) => [genre, count])
    ];
  };

  if (!accessToken) return null;

  return (
    <div className="genres">
     
        <p className="genres__subtitle">A visual representation of your top genres over different time periods. The "count" refers to the number of times
          a particular genre appears in your top artists list.
           </p>
      {selectedTimeRange === "short_term" && topGenresShort.length > 0 && (
        <Chart
        width={chartSize.width}
        height={chartSize.height}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={getChartData(topGenresShort)}
          options={{
            title: 'Top Genres (Past 4 weeks)',
            fontSize: fontSize,
            titleTextStyle: { color: '#FFF', textAlign: 'center' },
            hAxis: {
              title: 'Total Count',
              minValue: 0,
              textStyle: { color: '#FFF' },
              titleTextStyle: { color: '#FFF' },
              gridlines: { color: 'rgb(95, 99, 104)' },
            },
            vAxis: {
              title: 'Genre',
              textStyle: { color: '#FFF' },
              titleTextStyle: { color: '#FFF' },
              gridlines: { color: 'rgb(95, 99, 104)' },
              textPosition: 'out',
            },
            backgroundColor: '#000000',
            legend: { textStyle: { color: '#FFF' } },
            titleTextStyle: { color: '#FFF' },
            colors: ['#1bd760'],
          }}
        />
      )}
      {selectedTimeRange === "medium_term" && topGenresMedium.length > 0 && (
        <Chart
        width={chartSize.width}
        height={chartSize.height}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={getChartData(topGenresMedium)}
          options={{
            title: 'Top Genres (Past 6 months)',
            fontSize: fontSize,
            hAxis: {
              title: 'Total Count',
              minValue: 0,
              textStyle: { color: '#FFF' },
              titleTextStyle: { color: '#FFF' },
              gridlines: { color: 'rgb(95, 99, 104)' },
            },
            vAxis: {
              title: 'Genre',
              textStyle: { color: '#FFF' },
              titleTextStyle: { color: '#FFF' },
              gridlines: { color: 'rgb(95, 99, 104)' },
              textPosition: 'out',
            },
            backgroundColor: '#000000',
            legend: { textStyle: { color: '#FFF' } },
            titleTextStyle: { color: '#FFF' },
            colors: ['#1bd760'],
          }}
        />
      )}
      {selectedTimeRange === "long_term" && topGenresLong.length > 0 && (
        <Chart
        width={chartSize.width}
        height={chartSize.height}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={getChartData(topGenresLong)}
          options={{
            title: 'Top Genres (All time)',
            fontSize: fontSize,
            hAxis: {
              title: 'Total Count',
              minValue: 0,
              textStyle: { color: '#FFF' },
              titleTextStyle: { color: '#FFF' },
              gridlines: { color: 'rgb(95, 99, 104)' },
              textPosition: 'out',
            },
            vAxis: {
              title: 'Genre',
              textStyle: { color: '#FFF' },
              titleTextStyle: { color: '#FFF' },
              gridlines: { color: 'rgb(95, 99, 104)' },
            },
            backgroundColor: '#000000',
            legend: { textStyle: { color: '#FFF' } },
            titleTextStyle: { color: '#FFF' },
            colors: ['#1bd760'],
          }}
        />
      )}
    </div>
  );
}

export default Genres;