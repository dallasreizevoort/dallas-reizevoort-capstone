import React from "react";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import "./styles/partials/global.scss";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return code ? (
    <Dashboard code={code} />
  ) : (
    <Login />
  );
}

export default App;