
import tokenUtils from "./token-utils";
import fetch, {Response} from 'node-fetch';

jest.mock('node-fetch', ()=>jest.fn())

const mockedResponse = (returnBody, status = 200) => ({
  ok: true,
  status,
  json: () => {
    return returnBody ? returnBody : {}
  }
})

describe('tokenUtils',  () => {
  it('should return expected response', async() => {
    fetch.mockReturnValue(
      Promise.resolve(
        mockedResponse({access_token: 'any token'})
      )
    )
    const accessToken = await tokenUtils('any code');
    const expectedAccessToken = {accessToken: 'any token'}
    expect(accessToken).toEqual(expectedAccessToken)
  })
})