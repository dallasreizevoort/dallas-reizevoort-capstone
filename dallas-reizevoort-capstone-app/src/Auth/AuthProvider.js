import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";

// Spotify web API is stateless, there are no server side sessions or storage.
// The token will continue to work for within my site to make requests for 1 hour until it expires.

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
