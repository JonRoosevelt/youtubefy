import {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI} from "../consts";
import request from "request";

const getAccessToken = async(code: string) => {
  const options = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  await request.post(options, (req, res) => {
    if (res?.statusCode === 200) {
      const {body} = res;
      const {access_token, refresh_token} = body;
      return {
        accessToken: access_token,
        refreshToken: refresh_token
      }
    }
  })
}

export default getAccessToken;