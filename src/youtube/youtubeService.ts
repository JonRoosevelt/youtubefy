import {
  ClientService,
  Credentials as ServiceCredentials,
} from '../lib/interfaces/service';
import { Express } from 'express';
import { OAuth2Client } from 'googleapis-common';
import { google, Common } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

interface YoutubeClientService {
  requestUserConsent(OAuthClient: OAuth2Client | string): void;
  requestServiceForAccessToken(
    oauthClient: OAuth2Client,
    authorizationToken: string
  ): Promise<void>;
  setGlobalGoogleAuthentication(OAuthClient: OAuth2Client): void;
}

export const youtubeClientService: ClientService & YoutubeClientService = {
  createOAuthClient: (credentials: ServiceCredentials) => {
    return new OAuth2(
      credentials.web.clientId,
      credentials.web.clientSecret,
      credentials.web.redirectUri
    );
  },
  requestUserConsent: (OAuthClient: OAuth2Client) => {
    const consentUrl = OAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube'],
    });

    console.log(`> Please give your consent: ${consentUrl}`);
  },
  waitForServiceCallback: async (app: Express) => {
    return new Promise((resolve, _reject) => {
      console.log('> Waiting for user consent...');
      app.get('/youtube/callback', (req, res) => {
        if (req.query.code && !Array.isArray(req.query.data)) {
          const authCode = req.query.code.toString();
          console.log(`> Consent given: ${authCode}`);
          res.send('<h1>Thank you</h1><p>Now close this tab.</p>');
          resolve(authCode);
        }
      });
    });
  },
  requestServiceForAccessToken: async (
    oauthClient: OAuth2Client,
    authorizationToken: string
  ) => {
    try {
      const { tokens } = await oauthClient.getToken(authorizationToken);
      console.log('> Access tokens received');
      console.log(tokens);
      oauthClient.setCredentials(tokens);
    } catch (error) {
      console.error(error);
    }
  },
  setGlobalGoogleAuthentication: (OAuthClient: OAuth2Client) {
    google.options({
      auth: OAuthClient
    })
  }
};
