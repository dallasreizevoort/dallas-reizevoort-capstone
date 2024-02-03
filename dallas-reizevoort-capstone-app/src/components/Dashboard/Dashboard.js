import React from "react";
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

function Dashboard() {
  const location = useLocation();

  const [selectedTimeRange, setSelectedTimeRange] = useState("short_term");

  const showButtons =
    location.pathname.includes("/artists") ||
    location.pathname.includes("/tracks") ||
    location.pathname.includes("/genres");

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
            path="artists"
            element={
              <Artists
                selectedTimeRange={selectedTimeRange}
              />
            }
          />
          <Route
            path="tracks"
            element={
              <Tracks
                selectedTimeRange={selectedTimeRange}
              />
            }
          />
          <Route
            path="genres"
            element={
              <Genres
                selectedTimeRange={selectedTimeRange}
              />
            }
          />
          <Route
            path="recent"
            element={<RecentlyPlayed />}
          />
          <Route
            path="playlist"
            element={<Playlist />}
          />
          <Route
          path="mood"
          element={<Mood />}
          />
        </Routes>
        
      </div>
    </div>
  );
}

export default Dashboard;