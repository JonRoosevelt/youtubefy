import {oauth2_v2} from "googleapis";
import {OAuth2Client} from "google-auth-library";

export interface Credentials {
  OAuthClient: OAuth2Client
}

export interface ClientService {
  authenticateWithOauth: (credentials: OAuth2Client) => void
  performAction: () => Promise<string>
}