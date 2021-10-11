import { Express } from 'express';
import { OAuth2Client } from 'googleapis-common';
import http from 'http';
export interface Credentials {
  web: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
}

export interface ClientService {
  createOAuthClient(credentials: Credentials): Promise<OAuth2Client | string>;
  waitForServiceCallback(app: Express): Promise<string | void>;
  stopWebServer(server: http.Server): void;
}
