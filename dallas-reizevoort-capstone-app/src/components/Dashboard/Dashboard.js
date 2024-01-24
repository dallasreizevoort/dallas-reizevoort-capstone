import React from "react";
import useAuth from "../../useAuth";


function Dashboard({code}) {
    const accessToken = useAuth(code)
  return (
    <div className="dashboard">
      <div>{code}</div>
    </div>
  );
}


export default Dashboard;