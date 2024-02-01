import React from "react";
import Header from "./components/Header/Header";
import Settings from "./components/Settings/Settings";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import "./styles/partials/global.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthProvider";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    <AuthProvider>
      <Router>
        {code ? (
          <Dashboard code={code} />
        ) : (
          <>
            <Login />
            <Settings />
          </>
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;