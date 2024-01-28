import React from "react";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import "./styles/partials/global.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    <Router>
      {code ? (
        <>
          <Dashboard code={code} />
        </>
      ) : (
        <Login />
      )}
    </Router>
  );
}

export default App;
