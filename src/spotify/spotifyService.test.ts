import express, { Response, Express } from 'express';
import request from 'supertest';
import fetch from 'node-fetch';
import tokenUtils from './authorization/token-utils';
import { spotifyClientService } from './spotifyService';
import supertest from "supertest";

const { Response: fetchResponse } = jest.requireActual('node-fetch');

jest.mock('./authorization/token-utils');
jest.mock('node-fetch', () => jest.fn());


type ArtistList = {
  artists: {
    items: [
      {name: string}
    ]
  }
}

async function arrangeSuccessfulTest(artistsLists: ArtistList | {}): Promise<supertest.Test> {
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new fetchResponse(JSON.stringify(artistsLists)))
  const app = express();
  await spotifyClientService.waitForServiceCallback(app as Express);
  return request(app)
    .get('/spotify/callback?code=any-code')
    .expect(200)
}

describe('spotifyClientService', () => {
  describe('createOAuthClient', () => {
    it('should return expected uri', async () => {
      const credentials = {
        web: {
          clientId: 'any client id',
          clientSecret: 'any clientSecret',
          redirectUri: 'any redirect uri',
        },
      };
      const expectedOAuthClient =
        'https://accounts.spotify.com/authorize?response_type=code&client_id=any client id&scope=user-read-private%20user-read-email%20user-follow-read&redirect_uri=any%20redirect%20uri';
      const oauthUri = await spotifyClientService.createOAuthClient(
        credentials
      );
      expect(oauthUri).toEqual(expectedOAuthClient);
    });
  });

  describe('redirect', () => {
    const response: any = {
      redirect: jest.fn(),
    };
    const oauthUri = 'any-oauth-uri';
    spotifyClientService.redirect(response as Response, oauthUri);
    it('should call redirect with expected oauth uri', () => {
      expect(response.redirect).toHaveBeenCalledWith(oauthUri);
    });
  });

  describe('waitForServiceCallback', () => {
    describe('when access token', () => {
      beforeEach(() => {
        tokenUtils.getAccessToken = jest.fn(() => {
          return Promise.resolve({ accessToken: 'any-token' });
        });
      });

      it('should return the artists list', async () => {
        const artistsLists = {
          artists: {
            items: [
              {name: 'KISS'}
            ]
          }
        };
        const response = await arrangeSuccessfulTest(artistsLists);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(['KISS']);
      });

      it('should return empty artists list', async () => {
        const emptyArtistsList = {};
        const response = await arrangeSuccessfulTest(emptyArtistsList);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([]);
      });
    });
  });
  describe('when no access token', () => {
    beforeEach(() => {
      tokenUtils.getAccessToken = jest.fn(() => {
        return Promise.resolve({ accessToken: null });
      });
    });
    it('should return 400', async () => {
      const app = express();
      await spotifyClientService.waitForServiceCallback(app as Express);
      const response = await request(app).get(
        '/spotify/callback?code=any-code'
      );
      expect(response.statusCode).toEqual(400);
    });
  });
});
