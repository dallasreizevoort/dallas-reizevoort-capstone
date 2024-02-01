import React, { useState, useEffect } from "react";
import axios from "axios";

function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    console.log('Access token:', accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!code) return;

    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        if (res.data && res.data.accessToken && res.data.refreshToken && res.data.expiresIn) {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(res.data.expiresIn);
          console.log('Login response:', res.data);
        } else {
          console.error('Unexpected response from Spotify API:', res.data);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.error('Bad Request error when logging in:', error.response.data);
        } else {
          console.error('Error when logging in:', error);
        }
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      console.log('Refresh token:', refreshToken);
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
          console.log('Refresh response:', res.data);
        })
        .catch((error) => {
          console.error('Error when refreshing token:', error);
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}

export default useAuth;