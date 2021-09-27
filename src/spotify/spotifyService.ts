import { ClientService, Credentials } from '../lib/interfaces/service';
import { SPOTIFY_ARTISTS_URL, SPOTIFY_AUTHORIZATION_URL } from './consts';
import { Express, Response } from 'express';
import tokenUtils from './authorization/token-utils';
import getFollowingArtists from './following-artists/folowing-artists';

interface SpotifyClientService {
  redirect(app: Response, oauthUri: string): void;
}

export const spotifyClientService: ClientService & SpotifyClientService = {
  createOAuthClient: async (credentials: Credentials) => {
    const { clientId, redirectUri } = credentials.web;
    const scopes = 'user-read-private user-read-email user-follow-read';
    return (
      SPOTIFY_AUTHORIZATION_URL +
      '?response_type=code' +
      '&client_id=' +
      clientId +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' +
      encodeURIComponent(redirectUri)
    );
  },
  redirect: (res: Response, oauthUri: string) => {
    res.redirect(oauthUri);
  },
  waitForServiceCallback: async (app: Express) => {
    app.get('/spotify/callback', async (req, res) => {
      const code = req.url.substring(
        req.url.indexOf('code=') + 5,
        req.url.length
      );
      const { accessToken = null }: any = await tokenUtils.getAccessToken(code);
      const artistList = new Array<string>();
      if (accessToken) {
        await getFollowingArtists(accessToken, SPOTIFY_ARTISTS_URL, artistList);
        if (artistList.length > 0) {
          res.send(artistList.sort());
        } else {
          res.status(200).send([]);
        }
      } else {
        res.status(400).send('invalid access token');
      }
    });
  },
};
