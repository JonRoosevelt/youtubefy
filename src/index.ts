import express from "express";
import request from "request";
import getAccessToken from "./spotify/authorization/get_access_token";
import getFollowingArtists from "./spotify/following-artists/followingArtists";

const CLIENT_ID = process.env.CLIENT_ID || ''
const REDIRECT_URI = process.env.REDIRECT_URI || ''
const CLIENT_SECRET = process.env.CLIENT_SECRET || ''

const app = express();

const port = 8888;

app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email user-follow-read';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI));
});

app.get('/callback', async (req, res) => {
  const code = req.url.substring(req.url.indexOf('code=') + 5, req.url.length)
  const { accessToken }: any = await getAccessToken(code);
  if (accessToken) {
    const { artists }: any = await getFollowingArtists(accessToken);
    if (artists) {
      res.send(artists)
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