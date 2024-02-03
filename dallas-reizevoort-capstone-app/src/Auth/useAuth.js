// // useAuth.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// function useAuth(code) {
//   const [accessToken, setAccessToken] = useState();
//   const [refreshToken, setRefreshToken] = useState();
//   const [expiresIn, setExpiresIn] = useState();
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   console.log(code);

//   useEffect(() => {
//     if (!code) return;
//     console.log('code:', code);
//     axios
//       .post("http://localhost:3001/login", { code })
//       .then((res) => {
//         console.log('res.data:', res.data);
//         setAccessToken(res.data.accessToken);
//         setRefreshToken(res.data.refreshToken);
//         setExpiresIn(res.data.expiresIn);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error during axios.post call to /login:', error);
//         navigate('/');
//       });
//   }, [code, navigate]);

//   useEffect(() => {
//     if (!refreshToken || !expiresIn) return;
//     const interval = setInterval(() => {
//       axios
//         .post("http://localhost:3001/refresh", { refreshToken })
//         .then((res) => {
//           console.log('res.data:', res.data);
//           setAccessToken(res.data.accessToken);
//           setExpiresIn(res.data.expiresIn);
//         })
//         .catch((error) => {
//           console.error('Error during axios.post call to /refresh:', error);
//           navigate('/');
//         });
//     }, (expiresIn - 60) * 1000);

//     return () => clearInterval(interval);
//   }, [refreshToken, expiresIn, navigate]);

//   console.log('accessToken:', accessToken);
//   console.log('loading:', loading);

//   return { accessToken, loading };
// }

// export default useAuth;