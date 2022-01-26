import { Credentials as ServiceCredentials } from '../lib/interfaces/service';
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
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  const credentials: ServiceCredentials = {
    web: {
      clientId: 'any client',
      clientSecret: 'any secret',
      redirectUri: 'http://any-redirect-uri',
    },
  };
  describe('createOAuthClient', () => {
    it('should return expected OAuth2', () => {
      const oauth2 = youtubeClientService.createOAuthClient(credentials);
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
  describe('requestServiceForAccessToken', () => {
    let mockedOauthClient: OAuth2Client;
    beforeEach(() => {
      jest.mock('google-auth-library');
      mockedOauthClient = new OAuth2({
        ...credentials.web,
      }) as OAuth2Client;
    });
    describe('token available', () => {
      const mockedToken = 'any-token';
      const mockedGetToken = jest.fn().mockImplementation(() => {
        return {
          tokens: mockedToken,
        };
      });
      const mockedSetCredentials = jest.fn();
      beforeEach(() => {
        jest
          .spyOn(mockedOauthClient, 'getToken')
          .mockImplementation(mockedGetToken);
        jest
          .spyOn(mockedOauthClient, 'setCredentials')
          .mockImplementation(mockedSetCredentials);
      });

      it('should set credentials with expected token', async () => {
        const authorizationToken = 'any-auth-token';
        await youtubeClientService.requestServiceForAccessToken(
          mockedOauthClient,
          authorizationToken
        );
        expect(mockedOauthClient.setCredentials).toHaveBeenCalledWith(
          mockedToken
        );
      });
    });
    describe('token not available', () => {
      beforeEach(() => {
        jest.spyOn(mockedOauthClient, 'getToken');
        jest.spyOn(mockedOauthClient, 'setCredentials');
      });

      it('should not set credentials', async () => {
        const authorizationToken = 'any-auth-token';
        await youtubeClientService.requestServiceForAccessToken(
          mockedOauthClient,
          authorizationToken
        );
        expect(mockedOauthClient.setCredentials).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('requestGoogleForAccessTokens', () => {
    jest.spyOn(google, options);
    it('should call google options with OAuth2Client', () => {
      const oauthClient = new OAuth2({ ...credentials.web }) as OAuth2Client;
      youtubeClientService.setGlobalGoogleAuthentication(oauthClient);
      expect(google.options).toHaveBeenCalledWith({ auth: oauthClient });
    });
  });
});
