import { ClientService, Credentials } from '../lib/interfaces/service';
import { Express } from 'express';
import { OAuth2Client } from 'googleapis-common';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

interface YoutubeClientService {
  requestUserConsent(OAuthClient: OAuth2Client): void;
}

export const youtubeClientService: ClientService & YoutubeClientService = {
  createOAuthClient: async (credentials: Credentials) => {
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
};
