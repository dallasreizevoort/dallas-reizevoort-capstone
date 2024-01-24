import React from "react";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id&response_type=code&redirect_url=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  return <div>
        <a className="btn btn-success btn-lg" href={AUTH_URL}></a>
        Login With Spotify
  </div>
};
