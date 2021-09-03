import getFollowingArtists from "./folowing-artists";
import fetch from 'node-fetch'
jest.mock('node-fetch', ()=>jest.fn())

const mockedResponse = (returnBody, status = 200) => ({
  ok: true,
  status,
  json: () => {
    return returnBody ? returnBody : {}
  }
})

describe('followingArtists', () => {
  it('should return as expected', async () => {
    fetch.mockReturnValue(Promise.resolve(mockedResponse({
      artists: {
        items: [
          {
            name: 'artist one'
          },
          {
            name: 'artist two'
          }
        ]
      }
    })))
    const artistList = []
    const expectedArtists = [
      'artist one',
      'artist two'
    ]
    await getFollowingArtists('any token', 'any-url', artistList);
    expect(artistList).toEqual(expectedArtists);
  })
})