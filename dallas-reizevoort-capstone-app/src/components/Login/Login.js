import React from "react";
import "./Login.scss";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=6ba0cc8b29e145ea99f2401c09a35e6e&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Login() {
  return (
    <div className="login">
      <a className="login__btn" href={AUTH_URL}>
      Login With Spotify
      </a>
    </div>
    
  );
} 

export default Login;