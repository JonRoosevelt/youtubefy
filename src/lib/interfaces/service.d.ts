import { Express } from 'express';
import { OAuth2Client } from 'googleapis-common';
export interface Credentials {
  web: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
}

export interface ClientService {
  createOAuthClient(credentials: Credentials): Promise<OAuth2Client>;
  waitForServiceCallback(app: Express): Promise<string>;
}
