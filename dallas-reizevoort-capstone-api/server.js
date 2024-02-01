import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
    clientSecret: "daa7dbcd37f34e8284c3f0b3577dd7d9",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      spotifyApi.setAccessToken(data.body["access_token"]);
      res.json({
        accessToken: data.body["access_token"],
        expiresIn: data.body["expires_in"],
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
    clientSecret: "daa7dbcd37f34e8284c3f0b3577dd7d9",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log('Scopes:', data.body.scope);
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
