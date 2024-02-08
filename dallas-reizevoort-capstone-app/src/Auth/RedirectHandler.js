import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function RedirectHandler({ code }) {
  const navigate = useNavigate();
  const location = useLocation();

  // temporary fix
  useEffect(() => {
    if (code && !location.pathname.startsWith("/dashboard")) {
      navigate(`/dashboard?code=${code}`, { replace: true });
      navigate("/dashboard/tracks", { replace: true });
    }
  }, [navigate, code, location]);

  return null;
}

export default RedirectHandler;
