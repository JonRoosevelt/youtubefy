import fetch from 'node-fetch';

type Artist = {
  external_urls: {
    spotify: string;
  },
  name: string
}

const getFollowingArtists = async(accessToken: string, url: string, artistList: string[]) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(res => res.json())
  response.artists.items.forEach((artist: Artist) => artistList.push(artist.name))
  if (response.artists.next) {
    await getFollowingArtists(accessToken, response.artists.next, artistList)
  }
}

export default getFollowingArtists;