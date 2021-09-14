import fs from 'fs';
import readline from 'readline';
import { google, youtube_v3 } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import { BodyResponseCallback } from 'googleapis-common/build/src/api';
import Schema$ActivitySnippet = youtube_v3.Schema$ActivitySnippet;
const OAuth2 = google.auth.OAuth2;

type Credentials = {
  installed: {
    client_secret: string;
    client_id: string;
    redirect_uris: string[];
  };
};

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const TOKEN_DIR = '../credentials';
const TOKEN_PATH = `${TOKEN_DIR}/youtube.json`;

// Load client secrets from a local file.
export const getAccessCookies = () => {
  fs.readFile(
    'client_secret.json',
    function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the YouTube API.
      authorize({
        credentials: JSON.parse(content.toString()),
        callback: getChannel,
      });
    }
  );
};

interface AuthorizeParams {
  credentials: Credentials;
  callback: (arg0: OAuth2Client) => void;
}

function authorize({ credentials, callback }: AuthorizeParams) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token: Buffer): void => {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token.toString());
      callback(oauth2Client);
    }
  });
}

function getNewToken(
  oauth2Client: OAuth2Client,
  callback: (arg0: any) => void
) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err: any, token: any) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token: any) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err: any) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

interface Schema$Channel {
  items: {
    id?: string | null;
    snippet?: Schema$ActivitySnippet;
    statistics?: {
      viewCount?: string | null;
    };
  }[];
}
function getChannel(auth: OAuth2Client) {
  const service = google.youtube('v3');
  service.channels.list(
    {
      auth,
      part: ['snippet', 'contentDetails', 'statistics'],
      forUsername: 'GoogleDevelopers',
    },
    (err, _response): BodyResponseCallback<Schema$Channel> | undefined => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      const channels = _response?.data?.items;
      if (channels) {
        if (channels.length === 0) {
          console.log('No channel found.');
        } else {
          console.log(
            "This channel's ID is %s. Its title is '%s', and " +
              'it has %s views.',
            channels[0]?.id,
            channels[0]?.snippet?.title,
            channels[0]?.statistics?.viewCount
          );
        }
      }
    }
  );
}

