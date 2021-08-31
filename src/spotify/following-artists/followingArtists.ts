import request from "request";


const getFollowingArtists = async(accessToken: string) => {
  const authOptions = {
    url: 'https://api.spotify.com/v1/me/following?type=artist',
    headers: { 'Authorization': 'Bearer ' + accessToken},
    json: true
  };

  // use the access token to access the Spotify Web API
  await request.get(authOptions, (req, res) => {
    if (res?.statusCode === 200) {
      const { data } = res.body;
      return {
        artists: data
      }
    }
  })
}

export default getFollowingArtists;