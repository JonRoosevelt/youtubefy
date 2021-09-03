import fetch from "node-fetch";

import {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI} from "../consts";

const getAccessToken = async (code: string) => {
  const response = await fetch(
    `https://accounts.spotify.com/api/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    },
  );
  const json = await response.json();
  return {
    accessToken: json.access_token
  };
};

export default getAccessToken;