import express, { Express } from 'express';
import getAccessToken from './spotify/authorization/get-access-token';
import getFollowingArtists from './spotify/following-artists/folowing-artists';
import { google } from 'googleapis';

import {
  ARTISTS_URL,
  AUTHORIZATION_URL,
  CLIENT_ID,
  REDIRECT_URI,
} from './spotify/consts';
import { getAccessCookies } from './youtube/authentication/get-access-cookies';
import * as youtubeCredentials from './youtube/credentials/youtube.json';
import { OAuth2Client } from 'googleapis-common';

const app = express();

const port = 8888;

const OAuth2 = google.auth.OAuth2;

const createOAuthClient = async () => {
  return new OAuth2(
    youtubeCredentials.web.client_id,
    youtubeCredentials.web.client_secret,
    youtubeCredentials.web.redirect_uris[0]
  );
};

const requestUserConsent = (OAuthClient: OAuth2Client) => {
  const consentUrl = OAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube'],
  });

  console.log(`> Please give your consent: ${consentUrl}`);
};

const waitForGoogleCallback = async (app: Express) => {
  return new Promise((resolve, reject) => {
    console.log('> Waiting for user consent...');
    app.get('/youtube/callback', (req, res) => {
      const authCode = req.query.code;
      console.log(`> Consent given: ${authCode}`);
      res.send('<h1>Thank you</h1><p>Now close this tab.</p>');
      resolve(authCode);
    });
  });
};

app.get('/spotify/login', (req, res) => {
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
  const OAuthClient = await createOAuthClient();
  requestUserConsent(OAuthClient);

  const authorizationToken = await waitForGoogleCallback(app);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
