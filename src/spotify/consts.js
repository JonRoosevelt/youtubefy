import '../lib/env'

const CLIENT_ID = process.env.CLIENT_ID || ''
const REDIRECT_URI = process.env.REDIRECT_URI || ''
const CLIENT_SECRET = process.env.CLIENT_SECRET || ''
const AUTHORIZATION_URL = 'https://accounts.spotify.com/authorize';
const ARTISTS_URL = 'https://api.spotify.com/v1/me/following?type=artist';

export {
  CLIENT_SECRET,
  CLIENT_ID,
  REDIRECT_URI,
  AUTHORIZATION_URL,
  ARTISTS_URL
}