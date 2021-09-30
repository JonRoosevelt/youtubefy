import { Credentials } from '../lib/interfaces/service';
import { youtubeClientService } from './youtubeService';

type oauth2 = {
  _clientId: string;
  _clientSecret: string;
  redirectUri: string;
};

describe('youtubeClientService', () => {
  describe('createOAuthClient', () => {
    it('shoud return expected OAuth2', async () => {
      const credentials: Credentials = {
        web: {
          clientId: 'any client',
          clientSecret: 'any secret',
          redirectUri: 'http://any-redirect-uri',
        },
      };
      const oauth2 = await youtubeClientService.createOAuthClient(credentials);
      const { _clientId, _clientSecret, redirectUri } =
        oauth2 as Partial<oauth2>;
      expect(_clientId).toEqual(credentials.web.clientId);
      expect(_clientSecret).toEqual(credentials.web.clientSecret);
      expect(redirectUri).toEqual(credentials.web.redirectUri);
    });
  });
});
