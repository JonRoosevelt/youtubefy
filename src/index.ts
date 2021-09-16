import express from 'express';
import getAccessToken from './spotify/authorization/get-access-token';
import getFollowingArtists from './spotify/following-artists/folowing-artists';

import { youtubeClientService } from './youtube/youtubeService';

import {
  ARTISTS_URL,
  AUTHORIZATION_URL,
  CLIENT_ID,
  REDIRECT_URI,
} from './spotify/consts';

import {
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URI,
} from './youtube/consts';

const app = express();

const port = 8888;

const YOUTUBE_CREDENTIALS = {
  web: {
    clientId: YOUTUBE_CLIENT_ID,
    clientSecret: YOUTUBE_CLIENT_SECRET,
    redirectUri: YOUTUBE_REDIRECT_URI,
  },
};

app.get('/spotify/login', (_req, res) => {
  const scopes = 'user-read-private user-read-email user-follow-read';
  res.redirect(
    AUTHORIZATION_URL +
      '?response_type=code' +
      '&client_id=' +
      CLIENT_ID +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' +
      encodeURIComponent(REDIRECT_URI)
  );
});

app.get('/spotify/callback', async (req, res) => {
  const code = req.url.substring(req.url.indexOf('code=') + 5, req.url.length);
  const { accessToken }: any = await getAccessToken(code);
  const artistList: string[] = [];
  if (accessToken) {
    await getFollowingArtists(accessToken, ARTISTS_URL, artistList);
    if (artistList.length > 0) {
      res.send(artistList.sort());
    } else {
      res.status(400).send('invalid access token');
    }
  } else {
    res.status(400).send('invalid access token');
  }
});

app.get('/youtube/login', async (_req, _res) => {
  const { requestUserConsent, waitForServiceCallback, createOAuthClient } =
    youtubeClientService;
  const OAuthClient = await createOAuthClient(YOUTUBE_CREDENTIALS);
  requestUserConsent(OAuthClient);

  const authorizationToken = await waitForServiceCallback(app);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
