import React from "react";
import SpotifyIcon from '../../assets/images/Spotify_Icon_RGB_White.png';
import "./Login.scss";

const scopes = [
  "user-top-read",
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-recently-played",
];
const redirectUri = "http://localhost:3000";
const clientId = "6ba0cc8b29e145ea99f2401c09a35e6e";
const state =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${encodeURIComponent(scopes.join(" "))}&state=${state}`;
// "https://accounts.spotify.com/authorize?client_id=6ba0cc8b29e145ea99f2401c09a35e6e&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Login() {
  return (
    <div className="login">
      <h1 className="login__header">SoundTrack Analyzer</h1>
      <h2 className="login__text">insights into your music taste</h2>
      <div className="login__icon-container">
      <a className="login__link" href={AUTH_URL}>
        <img className="login__icon" src={SpotifyIcon} alt="Spotify Icon" />
      </a>
      </div>
    </div>
  );
}

export default Login;
