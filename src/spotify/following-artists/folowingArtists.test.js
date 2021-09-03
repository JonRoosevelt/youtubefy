import getFollowingArtists from "./followingArtists";

describe('followingArtists', () => {
  it('should return as expected', () => {
    const expectedArtists = [
      {'name': 'artist one'},
      {'name': 'artist two'}
    ]
    const artists = getFollowingArtists('any');
    expect(artists).toEqual(expectedArtists);
  })
})