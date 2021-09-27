import '../lib/env';

const SPOTIFY_CLIENT_ID = process.env.CLIENT_ID || '';
const SPOTIFY_REDIRECT_URI = process.env.REDIRECT_URI || '';
const SPOTIFY_CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const SPOTIFY_AUTHORIZATION_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_ARTISTS_URL =
  'https://api.spotify.com/v1/me/following?type=artist';

export {
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_AUTHORIZATION_URL,
  SPOTIFY_ARTISTS_URL,
};

