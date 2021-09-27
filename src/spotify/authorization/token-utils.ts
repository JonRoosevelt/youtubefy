import fetch from 'node-fetch';

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from '../consts';

const tokenUtils = {
  getAccessToken: async (code: string) => {
    const response = await fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${SPOTIFY_REDIRECT_URI}&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
    });
    const json = await response.json();
    return {
      accessToken: json.access_token,
    };
  }
}

export default tokenUtils;

