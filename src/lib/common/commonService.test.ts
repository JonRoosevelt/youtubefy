import { Server } from 'http';
import { commonService } from './commonService';

describe('stopWebServer', () => {
  it('should call server.close', () => {
    const mockedEmit = jest.spyOn(Server.prototype, 'close');
    const server = new Server();
    commonService.stopWebServer(server);
    expect(mockedEmit).toHaveBeenCalled();
  });
});
