import React, { useState } from "react";
import Header from "./components/Header/Header";
import Settings from "./components/Settings/Settings";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import RedirectHandler from "./Auth/RedirectHandler";
import "./styles/partials/global.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  return (
    <Router>
      <AuthProvider code={code}>
        <RedirectHandler code={code} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard code={code} />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
