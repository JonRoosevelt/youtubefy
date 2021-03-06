import express from 'express';
import tokenUtils from './spotify/authorization/token-utils';
import getFollowingArtists from './spotify/following-artists/folowing-artists';
import { youtubeClientService } from './youtube/youtubeService';

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from './spotify/consts';

import {
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URI,
} from './youtube/consts';
import { spotifyClientService } from './spotify/spotifyService';

const app = express();
const port = 8888;

const SPOTIFY_CREDENTIALS = {
  web: {
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URI,
  },
};

const YOUTUBE_CREDENTIALS = {
  web: {
    clientId: YOUTUBE_CLIENT_ID,
    clientSecret: YOUTUBE_CLIENT_SECRET,
    redirectUri: YOUTUBE_REDIRECT_URI,
  },
};

app.get('/spotify/login', async (_req, res) => {
  const { createOAuthClient, redirect, waitForServiceCallback } = spotifyClientService;
  const oAuthClient = await createOAuthClient(SPOTIFY_CREDENTIALS);
  if (typeof oAuthClient === 'string') {
    redirect(res, oAuthClient);
    await waitForServiceCallback(app)
  }
});

app.get('/youtube/login', async (_req, _res) => {
  const { requestUserConsent, waitForServiceCallback, createOAuthClient } =
    youtubeClientService;
  const OAuthClient = await createOAuthClient(YOUTUBE_CREDENTIALS);
  requestUserConsent(OAuthClient);

  const authorizationToken = await waitForServiceCallback(app);
  console.log(authorizationToken)
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
