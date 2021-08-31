const getFollowingArtists = require("./followingArtists");

describe('followingArtists', () => {
  it('should return as expected', () => {
    const expectedArtists = [
      {'name': 'artist one'},
      {'name': 'artist two'}
    ]
    const artists = getFollowingArtists();
    expect(artists).toEqual(expectedArtists);
  })
})