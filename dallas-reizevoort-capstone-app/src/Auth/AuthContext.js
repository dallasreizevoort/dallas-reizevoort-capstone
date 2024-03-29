import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/*
Currently using URLSearchParams to get code from URL. This is not secure and causes many issues 
with routing/refresh.
Need a better way to handle access/refresh token. local/session storage also has security risks.
Maybe use HTTP-Only cookies? or store everything in server-side session.
Will Update.
*/

const AuthContext = React.createContext();

function AuthProvider({ children, code }) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Running first useEffect hook");
    console.log("Code:", code);
    if (!code) return;
    axios
      .post("http://localhost:3001/login", { code })
      .then((res) => {
        console.log("Received response from /login:", res.data);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error during axios.post call to /login:", error);
        navigate("/");
      });
  }, [code]);

  useEffect(() => {
    console.log("Running second useEffect hook");
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", { refreshToken })
        .then((res) => {
          console.log("Received response from /refresh:", res.data);
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((error) => {
          console.error("Error during axios.post call to /refresh:", error);
          navigate("/");
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return (
    <AuthContext.Provider value={{ accessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthContext;
