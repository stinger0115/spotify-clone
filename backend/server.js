const express = require("express");
const app = new express();
const cors = require("cors");
const Spotifywebapi = require("spotify-web-api-node");
const lyricsFinder = require("lyrics-finder");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


 
app.post("/login", (req, res) => {
  // console.log("got the request");
  // console.log("BODY IS: ",req.body);
  const code = req.body.code;
  const spotifyapi = new Spotifywebapi({
    redirectUri: "http://localhost:3000",
    clientId: "b4600204fc574bbb8c17cd3efe063665",
    clientSecret: "be03e0df55d441b38ea36b0d59c7e451",
  });

  spotifyapi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.send({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.status(400).send("error");
    });
  
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  const spotifyapi = new Spotifywebapi({
    redirectUri: "http://localhost:3000",
    clientId: "b4600204fc574bbb8c17cd3efe063665",
    clientSecret: "be03e0df55d441b38ea36b0d59c7e451",
    refreshToken,
  });

  spotifyapi
    .refreshAccessToken()
    .then((data) => {
      res.send({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log("Error while refreshing");
      res.status(400).send(err);
    });
});


app.get("/lyrics", async (req, res) => {
  //   console.log("Artist: ", req.query.artist);
  //   console.log("Track: ", req.query.track);
  const lyrics = (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found";
  
  res.send({ lyrics });
});



app.listen(3001, (err) => {
  console.log("Listening at : 3001 and error: ", err);
});