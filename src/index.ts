import express from "express";
import getAccessToken from "./spotify/authorization/get-access-token";
import getFollowingArtists from "./spotify/following-artists/folowing-artists";

import {ARTISTS_URL, AUTHORIZATION_URL, CLIENT_ID, REDIRECT_URI} from "./spotify/consts";

const app = express();

const port = 8888;

app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email user-follow-read';
  res.redirect(AUTHORIZATION_URL +
    '?response_type=code' +
    '&client_id=' + CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI));
});

app.get('/callback', async (req, res) => {
  const code = req.url.substring(req.url.indexOf('code=') + 5, req.url.length)
  const { accessToken }: any = await getAccessToken(code);
  const artistList: string[] = [];
  if (accessToken) {
    await getFollowingArtists(accessToken, ARTISTS_URL, artistList);
    if (artistList.length > 0) {
      res.send(artistList.sort())
    } else {
      res.status(400)
        .send('invalid access token')
    }
  } else {
    res.status(400)
      .send('invalid access token')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})