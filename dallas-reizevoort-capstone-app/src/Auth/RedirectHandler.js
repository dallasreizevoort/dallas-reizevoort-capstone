import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//Storing access token is bad for security.
// Option 1: store in backend and make all requests on backend
// Option 2: always have code in dashboard.js and make requests from there

function RedirectHandler({ setCode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    if (code) {
      setCode(code);
      navigate("/dashboard");
    }
  }, [navigate, location.search, setCode]);

  return null; // This component does not need to render anything
}

export default RedirectHandler;