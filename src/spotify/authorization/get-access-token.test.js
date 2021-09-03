import getAccessToken from "./get-access-token";

describe('getAccessToken',  () => {
  const expectedResponse = {
    statusCode: 200,
    body: {
      access_token: 'any token',
      refresh_token: 'any refresh token'
    }
  }
  const response = getAccessToken('any code');
  it('should return expected response', () => {
    expect(response).toEqual(expectedResponse)
  })
})