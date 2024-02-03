import React from "react";
import useAuth from "../../Auth/useAuth";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Dashboard.scss";
import Artists from "../Artists/Artists";
import Tracks from "../Tracks/Tracks";
import Genres from "../Genres/Genres";
import RecentlyPlayed from "../RecentlyPlayed/RecentlyPlayed";
import Header from "../Header/Header";
import Playlist from "../Playlist/Playlist";
import Mood from "../Mood/Mood";

import { Routes, Route } from "react-router-dom";

function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const location = useLocation();

  const [selectedTimeRange, setSelectedTimeRange] = useState("short_term");

  const showButtons =
    location.pathname.includes("/dashboard/artists") ||
    location.pathname.includes("/dashboard/tracks") ||
    location.pathname.includes("/dashboard/genres");

  return (
    <div className="dashboard">
      <Header />

      {showButtons && (
        <section className="dashboard__hero">
          <button
            className="dashboard__btn"
            onClick={() => setSelectedTimeRange("short_term")}
          >
            Past 4 weeks
          </button>
          <button
            className="dashboard__btn"
            onClick={() => setSelectedTimeRange("medium_term")}
          >
            Past 6 months
          </button>
          <button
            className="dashboard__btn"
            onClick={() => setSelectedTimeRange("long_term")}
          >
            All time
          </button>
        </section>
      )}

      <div className="dashboard__top">
        <Routes>
          <Route
            path="/dashboard/artists"
            element={
              <Artists
                accessToken={accessToken}
                selectedTimeRange={selectedTimeRange}
              />
            }
          />
          <Route
            path="/dashboard/tracks"
            element={
              <Tracks
                accessToken={accessToken}
                selectedTimeRange={selectedTimeRange}
              />
            }
          />
          <Route
            path="/dashboard/genres"
            element={
              <Genres
                accessToken={accessToken}
                selectedTimeRange={selectedTimeRange}
              />
            }
          />
          <Route
            path="/dashboard/recent"
            element={<RecentlyPlayed accessToken={accessToken} />}
          />
          <Route
            path="/dashboard/playlist"
            element={<Playlist accessToken={accessToken} />}
          />
          <Route
          path="/dashboard/mood"
          element={<Mood accessToken={accessToken} />}
          />
        </Routes>
        
      </div>
    </div>
  );
}

export default Dashboard;
