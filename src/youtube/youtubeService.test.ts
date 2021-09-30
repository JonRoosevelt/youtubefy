import { Credentials } from '../lib/interfaces/service';
import { youtubeClientService } from './youtubeService';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const OAuth2 = google.auth.OAuth2;

type oauth2 = {
  _clientId: string;
  _clientSecret: string;
  redirectUri: string;
};

type GenerateAuthUrl = {
  access_type: string;
  scope: [string];
};

describe('youtubeClientService', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  const credentials: Credentials = {
    web: {
      clientId: 'any client',
      clientSecret: 'any secret',
      redirectUri: 'http://any-redirect-uri',
    },
  };
  describe('createOAuthClient', () => {
    it('should return expected OAuth2', async () => {
      const oauth2 = await youtubeClientService.createOAuthClient(credentials);
      const { _clientId, _clientSecret, redirectUri } =
        oauth2 as Partial<oauth2>;
      expect(_clientId).toEqual(credentials.web.clientId);
      expect(_clientSecret).toEqual(credentials.web.clientSecret);
      expect(redirectUri).toEqual(credentials.web.redirectUri);
    });
  });
  describe('requestUserConsent', () => {
    jest.mock('google-auth-library');
    const oauthClient = new OAuth2({ ...credentials.web }) as OAuth2Client;
    jest
      .spyOn(OAuth2Client.prototype, 'generateAuthUrl')
      .mockImplementation(jest.fn());
    const expectedGenerateAuthUrlParams: GenerateAuthUrl = {
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube'],
    };
    it('should generate auth url', () => {
      youtubeClientService.requestUserConsent(oauthClient);
      expect(oauthClient.generateAuthUrl).toHaveBeenCalledWith(
        expectedGenerateAuthUrlParams
      );
    });
  });
});
