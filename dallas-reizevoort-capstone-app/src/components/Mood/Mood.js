import React, { useEffect, useRef } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Chart } from "react-google-charts";
import "./Mood.scss";

function Mood({ accessToken }) {
  const spotifyApi = useRef(
    new SpotifyWebApi({
      clientId: process.env.REACT_APP_CLIENT_ID,
    })
  );

  const [moodData, setMoodData] = React.useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);
    spotifyApi.current
      .getMyRecentlyPlayedTracks({ limit: 30 })
      .then((response) => {
        const trackIds = response.body.items.map((item) => item.track.id);
        return spotifyApi.current.getAudioFeaturesForTracks(trackIds);
      })
      .then((response) => {
        const audioFeatures = response.body.audio_features;

        const data = audioFeatures
          .map((features, index) => {
            const date = new Date(
              new Date().getTime() - index * 1000 * 60 * 60 * 24
            );
            const dateString = date.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            });
            return [dateString, features.valence];
          })
          .reverse();

        console.log(audioFeatures);

        setMoodData([["Time", "Mood (valence)"], ...data]);
      })
      .catch((err) => {
        console.error("Something went wrong:", err);
      });
  }, [accessToken]);

  return (
    <div className="mood">
      <h1 className="mood__title">How happy or sad is your music?</h1>
      <p className="mood__subtitle">
        Valence, ranging from 0.0 to 1.0, is Spotify's measure of a track's
        mood. High valence tracks sound positive and cheerful, while low valence
        tracks sound more negative and sad.
      </p>

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            color: "#FFFFFF",
            fontFamily: "Gotham",
            fontSize: "13px",
          }}
        >
          Mood (valence)
        </div>
        <Chart
          width={"500px"}
          height={"300px"}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={moodData}
          options={{
            backgroundColor: "#191414",
            fontName: "Gotham",
            fontSize: 13,
            hAxis: {
              title: "Days",
              format: "MMM dd",
              titleTextStyle: { color: "#FFFFFF" },
              textStyle: { color: "#FFFFFF" },
              gridlines: { color: "transparent" },
            },
            vAxis: {
              title: "",
              titleTextStyle: { color: "#FFFFFF" },
              textStyle: { color: "#FFFFFF" },
              gridlines: { color: "transparent" },
            },
            legend: {
              position: "top",
              alignment: "center",
              textStyle: { color: "#FFFFFF" },
            },
            colors: ["#1BD760"],
          }}
        />
      </div>
      <p className="mood__disclaimer">
        Data is based on your 30 most recently played songs
      </p>
    </div>
  );
}

export default Mood;
